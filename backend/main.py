from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routes import user_routes, addmeal, community, profile, home,subscription
import uvicorn
import time
from fastapi.staticfiles import StaticFiles
import os

app = FastAPI(title="Healthplate API")

origins = [
    "*", # Allow all origins (for development only)
    "http://localhost:8081", # Expo web default
    "http://192.168.136.55:8081",
]

# Create the directory if it doesn't exist
os.makedirs("static/uploads", exist_ok=True)

# MOUNT STATIC FILES -> This makes the image URL working
app.mount("/static", StaticFiles(directory="static"), name="static")

# --- CORS Configuration ---
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins, 
    allow_credentials=True,
    allow_methods=["*"], 
    allow_headers=["*"],
)

# Connect the modular routes
app.include_router(user_routes.router)
app.include_router(addmeal.router)
app.include_router(community.router)
app.include_router(profile.router)
app.include_router(home.router)
app.include_router(subscription.router)
@app.get("/")
async def root():
    return {"message": "Healthplate Backend is Running"}

@app.api_route("/health", methods=["GET", "HEAD"])
def health():
    return {
        "status": "ok",
        "uptime": time.process_time(),
        "timestamp": time.time(),
    }
# if __name__ == "__main__":
#     # Using 0.0.0.0 allows your physical phone to connect via your laptop's IP address
#     uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)