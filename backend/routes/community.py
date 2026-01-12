import os
import shutil
from uuid import uuid4
from datetime import datetime
from typing import List, Optional
from fastapi import APIRouter, HTTPException, UploadFile, File
from pydantic import BaseModel, Field, BeforeValidator
from typing_extensions import Annotated
from bson import ObjectId

# Database import 
from database import communitypost 

router = APIRouter(prefix="/posts", tags=["Posts"])

# --- Helpers & Models ---

PyObjectId = Annotated[str, BeforeValidator(str)]

class PostModel(BaseModel):
    id: Optional[PyObjectId] = Field(alias="_id", default=None)
    user_id: str
    user_name: str
    type: str
    title: Optional[str] = None
    content: str
    image_url: Optional[str] = None
    tags: List[str] = []
    is_public: bool = True
    likes_count: int = 0
    comments_count: int = 0
    created_at: datetime = Field(default_factory=datetime.utcnow)

# Ensure this matches the JSON sent from React Native
class CreatePostRequest(BaseModel):
    user_id: str
    user_name: str
    type: str
    title: Optional[str] = ""
    content: str
    image_url: Optional[str] = ""
    tags: str # We receive tags as a comma string, then process them
    is_public: bool = True

# --- Routes ---

# 1. Upload Image
UPLOAD_DIR = "static/uploads"
os.makedirs(UPLOAD_DIR, exist_ok=True)

@router.post("/upload")
async def upload_image(file: UploadFile = File(...)):
    try:
        file_extension = file.filename.split(".")[-1]
        filename = f"{uuid4()}.{file_extension}"
        file_path = os.path.join(UPLOAD_DIR, filename)
        
        with open(file_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)
            
        # Update this IP if you are not using localhost for accessing the image
        return {"file_url": f"http://192.168.136.55:8000/static/uploads/{filename}"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# 2. Create Post
@router.post("/", response_model=PostModel)
async def create_post(post: CreatePostRequest):
    # Process tags
    tag_list = [t.strip() for t in post.tags.split(',') if t.strip()]
    
    new_post = PostModel(
        user_id=post.user_id,
        user_name=post.user_name,
        type=post.type,
        title=post.title,
        content=post.content,
        image_url=post.image_url,
        tags=tag_list,
        is_public=post.is_public
    )
    
    result = await communitypost.insert_one(new_post.model_dump(by_alias=True, exclude=["id"]))
    created_post = await communitypost.find_one({"_id": result.inserted_id})
    return created_post

# 3. Get Feed
@router.get("/", response_model=List[PostModel])
async def get_feed(limit: int = 20):
    posts = await communitypost.find() \
        .sort("created_at", -1) \
        .limit(limit) \
        .to_list(limit)
    return posts