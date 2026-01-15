# routes/profile.py
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
    # 1. Protection: Remove immutable/sensitive fields
    # It is important to prevent users from changing their _id or email if that is your unique key
    updated_data.pop("_id", None) 
    updated_data.pop("password", None)
    # user_id is usually not changeable
    updated_data.pop("user_id", None) 

    # 2. Update logic
    update_result = await users_collection.update_one(
        {"_id": current_user["_id"]},
        {"$set": updated_data}
    )

    # 3. Fetch fresh data
    new_user = await users_collection.find_one({"_id": current_user["_id"]})
    new_user["_id"] = str(new_user["_id"])
    new_user.pop("password", None)
    
    # REMOVED THE COMMA HERE
    return new_user