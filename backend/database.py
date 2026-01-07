from motor.motor_asyncio import AsyncIOMotorClient
from config import settings

client = AsyncIOMotorClient(settings.MONGO_URL)
db = client.foodlens
users_collection = db.get_collection("users")