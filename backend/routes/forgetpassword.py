import os
from fastapi import APIRouter, HTTPException, status, BackgroundTasks
from pydantic import BaseModel, EmailStr
from datetime import datetime, timedelta
import secrets 
from passlib.context import CryptContext
from database import users_collection # Ensure this import matches your project structure
from fastapi_mail import FastMail, MessageSchema, ConnectionConfig, MessageType
from dotenv import load_dotenv

# --- CONFIGURATION ---
MAIL_USERNAME = os.getenv("MAIL_USERNAME")
MAIL_PASSWORD = os.getenv("MAIL_PASSWORD")
MAIL_FROM = os.getenv("MAIL_FROM")
MAIL_PORT = int(os.getenv("MAIL_PORT", 587)) # Convert to int, default to 587
MAIL_SERVER = os.getenv("MAIL_SERVER")
MAIL_FROM_NAME = "Healthplate Support"

conf = ConnectionConfig(
    MAIL_USERNAME=MAIL_USERNAME,
    MAIL_PASSWORD=MAIL_PASSWORD,
    MAIL_FROM=MAIL_FROM,
    MAIL_PORT=MAIL_PORT,
    MAIL_SERVER=MAIL_SERVER,
    MAIL_STARTTLS=True,
    MAIL_SSL_TLS=False,
    USE_CREDENTIALS=True,
    VALIDATE_CERTS=True
)

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
router = APIRouter()

# --- Models ---
class ForgotPasswordRequest(BaseModel):
    email: EmailStr

class ResetPasswordRequest(BaseModel):
    email: EmailStr
    otp: str
    new_password: str

# --- Helpers ---
def generate_otp():
    return str(secrets.randbelow(999999)).zfill(6) 

def hash_password(password: str):
    return pwd_context.hash(password)

async def send_email_otp(email: EmailStr, otp: str):
    print(f"--> BACKGROUND TASK: Sending email to {email}")
    html = f"""
    <h2>Password Reset Request</h2>
    <p>Your verification code is:</p>
    <h1 style="color: #4CAF50;">{otp}</h1>
    <p>This code expires in 2 minutes.</p>
    <h3>Regards Healthplate </h3>
    """
    message = MessageSchema(
        subject="Healthplate Password Reset Code",
        recipients=[email],
        body=html,
        subtype=MessageType.html
    )
    fm = FastMail(conf)
    try:
        await fm.send_message(message)
        print("--> EMAIL SENT SUCCESSFULLY")
        return True
    except Exception as e:
        return False

# --- Endpoints ---

@router.post("/auth/forgot-password")
async def forgot_password(request: ForgotPasswordRequest, background_tasks: BackgroundTasks):
    # 1. Check DB
    user = await users_collection.find_one({"email": request.email})
    if not user:
        raise HTTPException(status_code=404, detail="User with this email not found")
    
    # 2. Generate OTP
    otp = generate_otp()
    expire_time = datetime.utcnow() + timedelta(minutes=2)
    
    # 3. Update DB
    await users_collection.update_one(
        {"email": request.email}, 
        {"$set": {"reset_token": otp, "reset_token_expire": expire_time}}
    )
    # 4. Send Email (Background)
    background_tasks.add_task(send_email_otp, request.email, otp)
    
    return {"message": "Reset code sent to your email"}

@router.post("/auth/reset-password")
async def reset_password(request: ResetPasswordRequest):
    user = await users_collection.find_one({"email": request.email})
    if not user:
        raise HTTPException(status_code=400, detail="Invalid request")

    db_otp = user.get("reset_token")
    db_expire = user.get("reset_token_expire")
    
    if not db_otp or db_otp != request.otp:
        raise HTTPException(status_code=400, detail="Invalid or incorrect OTP")
    
    if datetime.utcnow() > db_expire:
        raise HTTPException(status_code=400, detail="OTP has expired")
        
    hashed_pw = hash_password(request.new_password)
    
    await users_collection.update_one(
        {"email": request.email},
        {
            "$set": {"password": hashed_pw},
            "$unset": {"reset_token": "", "reset_token_expire": ""}
        }
    )
    return {"message": "Password reset successfully"}