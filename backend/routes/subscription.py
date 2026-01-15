from fastapi import APIRouter, HTTPException, Body
from pydantic import BaseModel
from bson import ObjectId
from datetime import datetime, timedelta
# Import your specific collections. 
# Ensure subscription_collection is defined in database.py!
from database import users_collection, subscription_collection 

router = APIRouter(prefix="/users", tags=["Subscription"])

# 1. Define a Pydantic Model to validate data coming from React Native
class TrialRequest(BaseModel):
    user_id: str

@router.post("/start-trial")
async def start_free_trial(payload: TrialRequest):
    print(f"Received trial request for user_id: {payload.user_id}") # Debug log

    try:
        # 1. Validate ObjectId
        if not ObjectId.is_valid(payload.user_id):
            raise HTTPException(status_code=400, detail="Invalid User ID format")
        
        user_oid = ObjectId(payload.user_id)
        
        # 2. Check if user exists
        user = await users_collection.find_one({"_id": user_oid})
        if not user:
            raise HTTPException(status_code=404, detail="User not found in database")

        # 3. Prevent multiple trials (Optional: Comment out if testing repeatedly)
        # if user.get("subscription_status") in ["active", "trial"]:
        #      return {"message": "User is already on a plan", "status": user.get("subscription_status")}

        # 4. Calculate Dates
        start_date = datetime.utcnow()
        end_date = start_date + timedelta(days=5)

        # 5. Create Subscription Record
        sub_data = {
            "user_id": str(user_oid),
            "plan_type": "trial", 
            "start_date": start_date,
            "end_date": end_date,
            "amount": 0,
            "currency": "INR",
            "active": True,
            "created_at": start_date
        }
        await subscription_collection.insert_one(sub_data)

        # 6. UPDATE THE USER (Crucial Step)
        result = await users_collection.update_one(
            {"_id": user_oid},
            {
                "$set": {
                    "is_premium": True,
                    "subscription_status": "trial",
                    "trial_end_date": end_date
                }
            }
        )
        
        if result.modified_count == 0:
            print("Warning: User document was not modified")

        print("User updated successfully in DB")

        return {
            "message": "Trial activated successfully",
            "is_premium": True,
            "trial_end_date": end_date.isoformat()
        }

    except Exception as e:
        print(f"Server Error: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))