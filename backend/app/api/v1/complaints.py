from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func, desc
from app.core.database import get_db
from app.models.complaint import Complaint
from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime

router = APIRouter()

class ComplaintCreate(BaseModel):
    title: str
    body: str
    category_id: int
    company: str

class ComplaintUpdate(BaseModel):
    status: Optional[str] = None
    title: Optional[str] = None
    body: Optional[str] = None

@router.get("/")
async def list_complaints(
    page: int = Query(1, ge=1),
    limit: int = Query(20, le=100),
    status: Optional[str] = None,
    category: Optional[str] = None,
    q: Optional[str] = None,
    sort: str = "newest",
    db: AsyncSession = Depends(get_db),
):
    query = select(Complaint).where(Complaint.is_published == True)
    if status:
        query = query.where(Complaint.status == status)
    if q:
        query = query.where(Complaint.title.ilike(f"%{q}%") | Complaint.body.ilike(f"%{q}%"))
    if sort == "popular":
        query = query.order_by(desc(Complaint.views))
    elif sort == "votes":
        query = query.order_by(desc(Complaint.votes))
    else:
        query = query.order_by(desc(Complaint.created_at))
    query = query.offset((page - 1) * limit).limit(limit)
    result = await db.execute(query)
    items = result.scalars().all()
    return {"items": items, "page": page, "limit": limit}

@router.post("/", status_code=201)
async def create_complaint(data: ComplaintCreate, db: AsyncSession = Depends(get_db)):
    # In production: get user from JWT token
    complaint = Complaint(**data.model_dump(), user_id=1, status="Açık")
    db.add(complaint)
    await db.commit()
    await db.refresh(complaint)
    return complaint

@router.get("/{complaint_id}")
async def get_complaint(complaint_id: int, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Complaint).where(Complaint.id == complaint_id))
    complaint = result.scalar_one_or_none()
    if not complaint:
        raise HTTPException(404, "Şikayet bulunamadı.")
    # Increment view count
    complaint.views += 1
    await db.commit()
    return complaint

@router.patch("/{complaint_id}")
async def update_complaint(complaint_id: int, data: ComplaintUpdate, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Complaint).where(Complaint.id == complaint_id))
    complaint = result.scalar_one_or_none()
    if not complaint:
        raise HTTPException(404, "Şikayet bulunamadı.")
    for field, value in data.model_dump(exclude_none=True).items():
        setattr(complaint, field, value)
    complaint.updated_at = datetime.utcnow()
    await db.commit()
    return complaint

@router.delete("/{complaint_id}", status_code=204)
async def delete_complaint(complaint_id: int, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Complaint).where(Complaint.id == complaint_id))
    complaint = result.scalar_one_or_none()
    if not complaint:
        raise HTTPException(404, "Şikayet bulunamadı.")
    await db.delete(complaint)
    await db.commit()

@router.post("/{complaint_id}/vote")
async def vote_complaint(complaint_id: int, direction: str = "up", db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Complaint).where(Complaint.id == complaint_id))
    complaint = result.scalar_one_or_none()
    if not complaint:
        raise HTTPException(404, "Şikayet bulunamadı.")
    if direction == "up":
        complaint.votes += 1
    elif direction == "down" and complaint.votes > 0:
        complaint.votes -= 1
    await db.commit()
    return {"votes": complaint.votes}
