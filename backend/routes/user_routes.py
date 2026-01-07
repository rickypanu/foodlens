from fastapi import APIRouter, HTTPException, status
from models.user import UserSignupSchema, UserLoginSchema
from database import users_collection
from auth.security import get_password_hash, verify_password, create_access_token

router = APIRouter(prefix="/users", tags=["Users"])

def calculate_health_metrics(data: UserSignupSchema):
    # Mifflin-St Jeor Formula
    bmr = (10 * data.weight) + (6.25 * data.height) - (5 * data.age) + 5
    multipliers = {"sedentary": 1.2, "light": 1.375, "moderate": 1.55, "high": 1.725}
    tdee = bmr * multipliers.get(data.activity_level.lower(), 1.2)
    
    # Goal Adjustment
    target_cal = tdee - 500 if data.goal == "fat_loss" else tdee + 300 if data.goal == "muscle_gain" else tdee
    
    return {
        "daily_calories": round(target_cal),
        "protein_target": round(data.weight * 1.5),
        "fiber_target": 30,
        "sugar_cap": 50
    }

@router.post("/signup")
async def signup(user_data: UserSignupSchema):
    # Check if user exists
    user_exists = await users_collection.find_one({"email": user_data.email})
    if user_exists:
        raise HTTPException(status_code=400, detail="User already exists")

    # Hash password and prepare data
    user_dict = user_data.dict()
    user_dict["password"] = get_password_hash(user_data.password)
    user_dict["metrics"] = calculate_health_metrics(user_data)

    await users_collection.insert_one(user_dict)
    token = create_access_token({"sub": user_data.email})
    return {"token": token, "message": "Account created successfully"}

@router.post("/login")
async def login(credentials: UserLoginSchema):
    user = await users_collection.find_one({"email": credentials.email})
    if not user or not verify_password(credentials.password, user["password"]):
        raise HTTPException(status_code=401, detail="Invalid email or password")
    
    token = create_access_token({"sub": user["email"]})
    return {"token": token, "userName": user["name"]}