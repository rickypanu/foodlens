# addmeal.py

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, EmailStr, Field
from typing import List, Optional
from database import users_collection, addmeal_collection 
from datetime import date as dt_date, datetime
from datetime import date as dt_date
# -----------------------------
# Pydantic models for validation
# -----------------------------

class Nutrition(BaseModel):
    calories_mean: float = 0
    protein_mean: float = 0
    carbs_mean: float = 0
    fat_mean: float = 0
    fiber_mean: float = 0
    sodium_mean: float = 0
    sat_fat_mean: float = 0
    sugar_mean: float = 0

class Component(BaseModel):
    dish_id: str
    dish_name: str
    quantity: float = 1
    unit: str = "serving"
    nutrition: Optional[Nutrition]

class Meal(BaseModel):
    email: EmailStr
    date: dt_date = Field(default_factory=dt_date.today)
    meal_type: str
    source_type: str
    oil_level: Optional[str] = "medium"
    components: List[Component] = []
    nutrition: Optional[Nutrition]
    confidence_score: Optional[float]

# -----------------------------
# APIRouter
# -----------------------------
router = APIRouter(prefix="/users", tags=["Addmeal"])

@router.post("/meals")
async def add_meal(meal: Meal):
    try:
        # Check if user exists, otherwise create
        user = await users_collection.find_one({"email": meal.email})
        if not user:
            user_doc = {"email": meal.email, "created_at": datetime.utcnow()}
            user_insert = await users_collection.insert_one(user_doc)
            user_id = user_insert.inserted_id
        else:
            user_id = user["_id"]

        # Prepare meal document
        meal_doc = {
            "user_id": user_id,
            "email":meal.email,
            "date": meal.date.isoformat(),
            "meal_type": meal.meal_type,
            "source_type": meal.source_type,
            "oil_level": meal.oil_level,
            "components": [c.model_dump() for c in meal.components],
            "nutrition": meal.nutrition.model_dump() if meal.nutrition else None,
            "confidence_score": meal.confidence_score,
            "created_at": datetime.utcnow()
        }

        # Insert meal
        result = await addmeal_collection.insert_one(meal_doc)
        
        # Convert Mongo Objects to strings so FastAPI can return them as JSON
        meal_doc["_id"] = str(result.inserted_id)
        meal_doc["user_id"] = str(meal_doc["user_id"])  

        return {"success": True, "meal": meal_doc}

    except Exception as e:
        # It is helpful to print the FULL error to see what's wrong
        import traceback
        traceback.print_exc() 
        print("Error saving meal:", e)
        raise HTTPException(status_code=500, detail=str(e)) 

@router.get("/{email}/daily-stats")
async def get_daily_stats(email: str, date_str: Optional[str] = None):
    """
    Fetch total calories, protein, and meal count for a specific date.
    Default date is today.
    """
    try:
        # Use today's date if none provided
        target_date = date_str or dt_date.today().isoformat()
        
        # 1. Find user (optional check)
        user = await users_collection.find_one({"email": email})
        if not user:
            raise HTTPException(status_code=404, detail="User not found")

        # 2. Query meals for this email and date
        # Note: We match the string format "YYYY-MM-DD" used in your add_meal function
        cursor = addmeal_collection.find({
            "email": email, 
            "date": target_date
        })
        
        meals = await cursor.to_list(length=100)

        # 3. Calculate Totals
        total_calories = 0
        total_protein = 0
        meal_count = len(meals)

        for meal in meals:
            if "nutrition" in meal and meal["nutrition"]:
                total_calories += meal["nutrition"].get("calories_mean", 0)
                total_protein += meal["nutrition"].get("protein_mean", 0)

        # 4. Return aggregated data
        return {
            "date": target_date,
            "total_calories": round(total_calories),
            "total_protein": round(total_protein, 1),
            "meal_count": meal_count
        }

    except Exception as e:
        print("Error fetching stats:", e)
        raise HTTPException(status_code=500, detail=str(e))