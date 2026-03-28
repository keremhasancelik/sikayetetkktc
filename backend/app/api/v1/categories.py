from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from app.core.database import get_db
from pydantic import BaseModel
from typing import Optional
router = APIRouter()

class CategoryCreate(BaseModel):
    name: str
    icon: str = "📌"
    color: str = "#1a3c5e"
    is_custom: bool = True

@router.get("/")
async def list_categories():
    return {"items": [
        {"id": i+1, "name": n, "icon": ic, "count": c}
        for i, (n, ic, c) in enumerate([
            ("Kamu Kurumları","🏛️",12840), ("Telekomünikasyon","📡",9320),
            ("Bankacılık & Finans","🏦",8750), ("Sağlık Hizmetleri","🏥",7430),
            ("Eğitim Kurumları","🎓",6210), ("Ulaşım & Lojistik","🚌",5890),
            ("Su & Elektrik","⚡",11200), ("Belediye Hizmetleri","🏙️",9870),
            ("E-Ticaret & Alışveriş","🛒",7640), ("Sigorta","🛡️",4320),
            ("Gayrimenkul","🏠",3890), ("Diğer","📋",5430),
        ])
    ]}

@router.post("/", status_code=201)
async def create_category(data: CategoryCreate):
    return {"id": 100, **data.model_dump(), "count": 0}

@router.delete("/{cat_id}", status_code=204)
async def delete_category(cat_id: int):
    return None
