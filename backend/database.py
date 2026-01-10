from motor.motor_asyncio import AsyncIOMotorClient
from config import settings

client = AsyncIOMotorClient(settings.MONGO_URL)
db = client.foodlens
users_collection = db.get_collection("users")
addmeal_collection = db.get_collection("dailymeal")
communitypost = db.get_collection("communitypost")