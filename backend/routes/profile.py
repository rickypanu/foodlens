# routes/user_routes.py
from fastapi import APIRouter, HTTPException, Depends
from database import users_collection
from bson import ObjectId

# Assuming you have an auth function like this
from auth.dependencies import get_current_user 

router = APIRouter()

@router.get("/me")
async def get_my_profile(current_user: dict = Depends(get_current_user)):
    # Convert _id to string for JSON response
    current_user["_id"] = str(current_user["_id"])
    current_user.pop("password", None)
    return current_user