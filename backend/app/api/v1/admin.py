from fastapi import APIRouter, Depends, HTTPException
router = APIRouter()

@router.get("/stats")
async def get_stats():
    return {
        "total_complaints": 4282012,
        "resolved": 1847330,
        "pending": 2312456,
        "total_users": 342891,
        "daily_new": 1284,
        "monthly_visitors": 8920000,
    }

@router.get("/users")
async def list_all_users(page: int = 1, limit: int = 20):
    return {"items": [], "page": page, "total": 0}

@router.patch("/users/{user_id}/block")
async def block_user(user_id: int):
    return {"message": f"Kullanıcı {user_id} engellendi"}

@router.patch("/users/{user_id}/unblock")
async def unblock_user(user_id: int):
    return {"message": f"Kullanıcı {user_id} engeli kaldırıldı"}

@router.delete("/users/{user_id}")
async def delete_user(user_id: int):
    return {"message": f"Kullanıcı {user_id} silindi"}

@router.get("/settings")
async def get_site_settings():
    return {"site_name": "ŞikayetKKTC", "meta_title": "...", "whatsapp": "+905391234567"}

@router.patch("/settings")
async def update_site_settings(settings: dict):
    return {"message": "Ayarlar kaydedildi", **settings}
