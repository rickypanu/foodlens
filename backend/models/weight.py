from pydantic import BaseModel
from typing import List
from datetime import date

# This matches the body you are sending from React Native
class WeightEntry(BaseModel):
    user_id: str
    weight: float
    date: date  # Pydantic will automatically parse "YYYY-MM-DD" strings

class WeightHistoryResponse(BaseModel):
    history: List[WeightEntry]