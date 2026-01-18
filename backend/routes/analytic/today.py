from fastapi import APIRouter, HTTPException
from datetime import datetime
from database import users_collection, addmeal_collection

router = APIRouter(tags=["Stats"])

@router.get("/daily-summary")
async def get_daily_summary(email: str):
    """
    Fetches daily summary matching the specific schema provided.
    """
    
    # 1. Find the User to get Targets (Metrics)
    user = await users_collection.find_one({"email": email})
    
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    # 2. Get "Today" as a STRING (because your DB uses "2026-01-16")
    today_str = datetime.now().strftime("%Y-%m-%d")

    # 3. Aggregation Pipeline
    pipeline = [
        {
            "$match": {
                # Match by email directly (since your addmeal doc has "email")
                "email": email,
                
                # Match date as a STRING
                "date": today_str
            }
        },
        {
            "$group": {
                "_id": None,
                # Sum the NESTED fields inside "nutrition"
                # using "calories_mean" as per your JSON
                "total_calories": {"$sum": "$nutrition.calories_mean"},
                "total_protein": {"$sum": "$nutrition.protein_mean"},
                "total_fat":{"$sum": "$nutrition.fat_mean"},
                "total_fiber": {"$sum": "$nutrition.fiber_mean"},
                "total_sodium": {"$sum": "$nutrition.sodium_mean"},
                "total_sugar": {"$sum": "$nutrition.sugar_mean"}
            }
        }
    ]
    
    cursor = addmeal_collection.aggregate(pipeline)
    result = await cursor.to_list(length=1)
    
    # Default values if no food found today
    totals = result[0] if result else {
        "total_calories": 0, "total_protein": 0, "total_fat": 0, 
        "total_fiber": 0, "total_sodium": 0, "total_sugar": 0
    }

    # 4. Get User Targets from "metrics" (not profile)
    # Your user doc has "metrics": { "daily_calories": 1948, ... }
    metrics = user.get("metrics", {})
    
    # Set targets based on your user schema
    daily_cal = float(metrics.get("daily_calories", 2000))
    
    targets = {
        "calorie_target_low": daily_cal - 200,
        "calorie_target_high": daily_cal + 200,
        "protein_target": float(metrics.get("protein_target", 100)),
        "fiber_target_low": float(metrics.get("fiber_target", 30)),
        "sodium_cap": 2300, # Hardcoded default as it wasn't in your user json
        "sugar_cap": float(metrics.get("sugar_cap", 50))
    }

    # 5. Calculate Adherence Logic
    calories_ok = targets["calorie_target_low"] <= totals["total_calories"] <= targets["calorie_target_high"]
    protein_ok = totals["total_protein"] >= targets["protein_target"]
    fiber_ok = totals["total_fiber"] >= targets["fiber_target_low"]
    sodium_ok = totals["total_sodium"] <= targets["sodium_cap"]

    # Calculate Score
    checks = [calories_ok, protein_ok, fiber_ok, sodium_ok]
    score = int((sum(checks) / len(checks)) * 100)

    return {
        "data": {
            "calories": totals["total_calories"],
            "protein": totals["total_protein"],
            "fat": totals["total_fat"],
            "sugar": totals["total_sugar"],
            "fiber": totals["total_fiber"],
            "sodium": totals["total_sodium"],
            "sugar": totals["total_sugar"]
        },
        "profile": targets,
        "adherence": {
            "score": score,
            "caloriesOk": calories_ok,
            "proteinOk": protein_ok,
            "fiberOk": fiber_ok,
            "sodiumOk": sodium_ok
        }
    }