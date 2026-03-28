from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from app.core.database import get_db
from pydantic import BaseModel
router = APIRouter()

class CommentCreate(BaseModel):
    body: str

@router.get("/{complaint_id}/comments")
async def list_comments(complaint_id: int, db: AsyncSession = Depends(get_db)):
    return {"items": [], "complaint_id": complaint_id}

@router.post("/{complaint_id}/comments", status_code=201)
async def create_comment(complaint_id: int, data: CommentCreate, db: AsyncSession = Depends(get_db)):
    return {"id": 1, "complaint_id": complaint_id, "body": data.body}

@router.delete("/{complaint_id}/comments/{comment_id}", status_code=204)
async def delete_comment(complaint_id: int, comment_id: int):
    return None
