from fastapi import APIRouter, HTTPException, Body
from models.weight import WeightEntry
from database import weight_collection
from datetime import datetime
router = APIRouter(prefix="/users", tags=["Insight"])

@router.post("/add_weight")
async def add_weight(entry: WeightEntry):
    try:
        # LOGIC: Find document with matching Email AND Date
        # If found -> Update weight ($set)
        # If not found -> Insert new document (upsert=True)
        
        result = await weight_collection.update_one(
            {
                "email": entry.email, 
                "date": entry.date
            },
            {
                "$set": {
                    "weight": entry.weight,
                    "email": entry.email,
                    "date": entry.date,
                    "timestamp": datetime.now() # Optional: for sorting by exact time if needed
                }
            },
            upsert=True
        )

        if result.upserted_id:
            return {"message": "New weight entry created", "type": "created"}
        else:
            return {"message": "Weight updated for today", "type": "updated"}

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# Optional: Endpoint to get history for the graph
@router.get("/weight_history/{email}")
async def get_weight_history(email: str):
    cursor = weight_collection.find({"email": email}).sort("date", 1).limit(30) # Last 30 entries
    weights = await cursor.to_list(length=30)
    
    # Clean data for frontend (convert ObjectId to str if needed, though strictly not needed for graph)
    cleaned_weights = [{"date": w["date"], "weight": w["weight"]} for w in weights]
    
    return {"history": cleaned_weights}