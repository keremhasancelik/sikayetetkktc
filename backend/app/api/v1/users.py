from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from typing import Optional
router = APIRouter()

class ProfileUpdate(BaseModel):
    first_name: Optional[str] = None
    last_name: Optional[str] = None
    phone: Optional[str] = None
    city: Optional[str] = None

@router.get("/me")
async def get_profile():
    return {"message": "JWT token ile kullanıcı bilgileri döner"}

@router.patch("/me")
async def update_profile(data: ProfileUpdate):
    return {"message": "Profil güncellendi", **data.model_dump(exclude_none=True)}

@router.delete("/me")
async def delete_account():
    return {"message": "Hesap silindi"}

@router.patch("/me/notifications")
async def update_notifications(settings: dict):
    return {"message": "Bildirim tercihleri güncellendi"}
