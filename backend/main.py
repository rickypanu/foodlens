from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routes import user_routes
import uvicorn

app = FastAPI(title="Healthplate API")

# --- CORS Configuration ---
# Allow all origins for development. In production, replace ["*"] with specific app URLs.
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], 
    allow_credentials=True,
    allow_methods=["*"], 
    allow_headers=["*"],
)

# Connect the modular routes
app.include_router(user_routes.router)

@app.get("/")
async def root():
    return {"message": "Healthplate Backend is Running"}

# if __name__ == "__main__":
#     # Using 0.0.0.0 allows your physical phone to connect via your laptop's IP address
#     uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)