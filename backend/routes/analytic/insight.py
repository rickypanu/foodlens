from fastapi import APIRouter, HTTPException
from models.weight import WeightEntry, WeightHistoryResponse
from database import db 
from datetime import datetime

router = APIRouter(prefix="/users")

@router.post("/add_weight")
async def add_weight(entry: WeightEntry):
    """
    Receives: { user_id, weight, date }
    Logic: Checks if a document with this 'user_id' AND 'date' exists.
           - If YES: Overwrite it.
           - If NO: Create a new one.
    """
    
    # 1. Ensure date is a string (YYYY-MM-DD) for consistent querying
    date_str = entry.date.strftime("%Y-%m-%d")

    # 2. Define the filter: Unique combo of User + Date
    filter_query = {
        "user_id": entry.user_id, 
        "date": date_str
    }
    
    # 3. Define the data to save
    update_data = {
        "$set": {
            "weight": entry.weight,
            "date": date_str,
            "user_id": entry.user_id
        }
    }

    # 4. Perform the UPSERT (Update or Insert)
    await db.weights.update_one(filter_query, update_data, upsert=True)
    
    return {"message": "Weight saved successfully", "date": date_str}


@router.get("/weight_history/{user_id}", response_model=WeightHistoryResponse)
async def get_weight_history(user_id: str, days: int = 30):
    """
    Fetch the last 30 days of weight data for the graph.
    Sorts by date ascending so the graph flows left-to-right.
    """
    cursor = db.weights.find(
        {"user_id": user_id}
    ).sort("date", 1).limit(days)
    
    history = await cursor.to_list(length=days)
    
    return {"history": history}