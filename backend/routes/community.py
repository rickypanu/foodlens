from fastapi import APIRouter, HTTPException, UploadFile, File, status
from fastapi.responses import JSONResponse
from pydantic import BaseModel
from typing import List, Optional
from uuid import uuid4
import shutil
import os
from database import communitypost  # MotorCollection

# Router for community posts
router = APIRouter(prefix="/posts", tags=["Posts"])

# Pydantic model for a post
class PostCreate(BaseModel):
    user_id: str
    user_name: str
    type: str
    title: Optional[str] = None
    content: str
    image_url: Optional[str] = None
    tags: Optional[List[str]] = []
    is_public: bool
    likes_count: int = 0
    comments_count: int = 0

# Endpoint to create a post
@router.post("/", status_code=status.HTTP_201_CREATED)
async def create_post(post: PostCreate):
    post_dict = post.dict()
    post_dict["_id"] = str(uuid4())  # MongoDB uses _id

    result = await communitypost.insert_one(post_dict)  # <-- async insert
    if not result.inserted_id:
        raise HTTPException(status_code=500, detail="Failed to create post")
    
    return post_dict

# Endpoint to list posts
@router.get("/", response_model=List[PostCreate])
async def list_posts():
    posts_cursor = communitypost.find({})
    posts = await posts_cursor.to_list(length=100)  # limit to 100 posts
    return posts

# Optional: endpoint to upload images
@router.post("/upload-image")
async def upload_image(file: UploadFile = File(...)):
    try:
        file_ext = os.path.splitext(file.filename)[1]
        filename = f"{uuid4()}{file_ext}"
        file_path = f"uploads/{filename}"

        os.makedirs("uploads", exist_ok=True)
        with open(file_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)

        return {"file_url": f"/{file_path}"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Upload failed: {str(e)}")
