from pydantic import BaseModel
from typing import List

class WeightEntry(BaseModel):
    email: str  # Changed from user_id to email as requested
    weight: float
    date: str   # Format YYYY-MM-DD

class WeightHistoryResponse(BaseModel):
    history: List[dict]