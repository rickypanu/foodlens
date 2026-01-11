# routes/user_routes.py
from fastapi import APIRouter, HTTPException, Depends, Body
from database import users_collection
from bson import ObjectId
from auth.dependencies import get_current_user 

router = APIRouter()

@router.get("/me")
async def get_my_profile(current_user: dict = Depends(get_current_user)):
    current_user["_id"] = str(current_user["_id"])
    current_user.pop("password", None)
    return current_user

# --- NEW: Update Profile Endpoint ---
@router.put("/me")
async def update_my_profile(
    updated_data: dict = Body(...), 
    current_user: dict = Depends(get_current_user)
):
    # 1. Remove sensitive or immutable fields so they can't be overwritten
    updated_data.pop("_id", None) 
    updated_data.pop("password", None)
    
    # 2. Update the user in MongoDB
    # We use "$set" to update only the fields sent in the request
    update_result = await users_collection.update_one(
        {"_id": current_user["_id"]},
        {"$set": updated_data}
    )

    if update_result.modified_count == 0 and update_result.matched_count == 0:
        raise HTTPException(status_code=400, detail="Update failed")

    # 3. Fetch and return the new profile data
    new_user = await users_collection.find_one({"_id": current_user["_id"]})
    new_user["_id"] = str(new_user["_id"])
    new_user.pop("password", None)
    
    return new_user