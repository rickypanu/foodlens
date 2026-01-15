from fastapi import APIRouter, HTTPException
from typing import List, Optional
from bson import ObjectId
from datetime import date as dt_date, datetime, timedelta 
from database import users_collection, addmeal_collection 

router = APIRouter(prefix="/users", tags=["Home"])

# --- 1. UPDATED DAILY STATS  ---
@router.get("/{email}/daily-stats")
async def get_daily_stats(email: str, date_str: Optional[str] = None):
    try:
        # 1. Set Date
        target_date = date_str or dt_date.today().isoformat()
        
        # 2. Check User
        user = await users_collection.find_one({"email": email})
        if not user:
            raise HTTPException(status_code=404, detail="User not found")

        # 3. Get Meals
        cursor = addmeal_collection.find({"email": email, "date": target_date})
        meals = await cursor.to_list(length=100)

        total_calories = 0
        total_protein = 0
        cleaned_meals = []

        for meal in meals:
            # --- A. Calculate Nutrition ---
            # Use safe .get() in case nutrition is missing
            nutri = meal.get("nutrition", {}) or {} 
            cals = nutri.get("calories_mean", 0)
            prot = nutri.get("protein_mean", 0)
            
            total_calories += cals
            total_protein += prot
            
            # --- B. Get Meal Type (e.g., "Breakfast") ---
            m_type = meal.get("meal_type", "Meal").capitalize()

            # --- C. Get Components (The Fix) ---
            # Your structure has "dish_name" inside the components list
            component_list = meal.get("components", [])
            item_names = []
            
            if isinstance(component_list, list):
                for item in component_list:
                    # EXTRACT 'dish_name' HERE
                    d_name = item.get("dish_name") 
                    if d_name:
                        item_names.append(d_name)
            
            # --- D. Create Description String ---
            if item_names:
                # joins ["Roti", "Dal"] -> "Roti, Dal"
                food_description = ", ".join(item_names) 
            else:
                # Fallback if components array is empty
                food_description = meal.get("predicted_class", "Meal")

            cleaned_meals.append({
                "id": str(meal["_id"]),
                "type": m_type,            
                "items": food_description  
            })

        return {
            "date": target_date,
            "total_calories": round(total_calories),
            "total_protein": round(total_protein, 1),
            "meal_count": len(meals),
            "meals": cleaned_meals
        }

    except Exception as e:
        print(f"Error fetching stats: {e}")
        raise HTTPException(status_code=500, detail=str(e))
    
# --- 2. NEW WEEKLY ACTIVITY ENDPOINT ---
@router.get("/{email}/weekly-activity")
async def get_weekly_activity(email: str):
    """
    Returns activity for the current week (Mon-Sun).
    """
    try:
        today = dt_date.today()
        # Find the Monday of this week
        start_of_week = today - timedelta(days=today.weekday())
        
        week_data = []
        
        # Loop through Mon (0) to Sun (6)
        for i in range(7):
            current_day = start_of_week + timedelta(days=i)
            date_str = current_day.isoformat()
            
            # Check if any meal exists for this day
            count = await addmeal_collection.count_documents({
                "email": email,
                "date": date_str
            })
            
            week_data.append({
                "day": current_day.strftime("%a"), # Mon, Tue, Wed
                "date": date_str,
                "is_today": date_str == today.isoformat(),
                "has_data": count > 0
            })
            
        return week_data

    except Exception as e:
        print(f"Error fetching week data: {e}")
        raise HTTPException(status_code=500, detail=str(e))
    
#3 ----- delete meal
@router.delete("/{email}/meals/{meal_id}")
async def delete_meal(email: str, meal_id: str):
    print(f"Backend received delete for: {email}, meal: {meal_id}") # <--- ADD PRINT HERE
    try:
        if not ObjectId.is_valid(meal_id):
             raise HTTPException(status_code=400, detail="Invalid Meal ID format")

        result = await addmeal_collection.delete_one({
            "_id": ObjectId(meal_id),
            "email": email
        })

        if result.deleted_count == 0:
            print("Meal not found or email mismatch")
            raise HTTPException(status_code=404, detail="Meal not found")

        return {"status": "success", "message": "Meal deleted"}

    except Exception as e:
        print(f"Error deleting meal: {e}")
        raise HTTPException(status_code=500, detail=str(e))