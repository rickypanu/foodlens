import os
from dotenv import load_dotenv

load_dotenv()

class Settings:
    MONGO_URL: str = os.getenv("MONGO_URL")
    SECRET_KEY: str = os.getenv("SECRET_KEY")
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_DAYS: int = 30

settings = Settings()