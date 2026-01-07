from pydantic import BaseModel, EmailStr
from typing import List, Optional

class UserSignupSchema(BaseModel):
    # Page 1
    email: EmailStr
    password: str
    # Page 2
    name: str
    # Page 3
    age: int
    height: float # in cm
    weight: float # in kg
    # Page 4
    activity_level: str # sedentary, light, moderate, high
    goal: str           # maintain, fat_loss, muscle_gain, energy
    # Page 5
    dietary_type: str   # vegetarian, egg, vegan, non-veg
    # Page 6
    food_preferences: Optional[List[str]] = []
    allergies: Optional[List[str]] = []
    disliked_food: Optional[List[str]] = []
    cuisines: Optional[List[str]] = []
    # Page 7
    health_concerns: Optional[List[str]] = []

class UserLoginSchema(BaseModel):
    email: EmailStr
    password: str