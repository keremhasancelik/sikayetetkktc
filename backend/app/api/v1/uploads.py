from fastapi import APIRouter, UploadFile, File, HTTPException
from typing import List
import uuid

router = APIRouter()

ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp", "application/pdf"]
MAX_SIZE = 10 * 1024 * 1024  # 10MB

@router.post("/")
async def upload_file(file: UploadFile = File(...)):
    if file.content_type not in ALLOWED_TYPES:
        raise HTTPException(400, "Desteklenmeyen dosya tipi. JPG, PNG, PDF yükleyebilirsiniz.")
    content = await file.read()
    if len(content) > MAX_SIZE:
        raise HTTPException(400, "Dosya 10MB'dan büyük olamaz.")
    filename = f"{uuid.uuid4()}-{file.filename}"
    # Production: boto3 ile Cloudflare R2'ye yükle
    # s3_client.put_object(Bucket=settings.R2_BUCKET, Key=filename, Body=content)
    return {
        "filename": filename,
        "url": f"https://files.sikayetkktc.com/{filename}",
        "size": len(content),
        "content_type": file.content_type,
    }

@router.post("/multiple")
async def upload_multiple(files: List[UploadFile] = File(...)):
    if len(files) > 5:
        raise HTTPException(400, "En fazla 5 dosya yüklenebilir.")
    results = []
    for file in files:
        if file.content_type not in ALLOWED_TYPES:
            continue
        content = await file.read()
        filename = f"{uuid.uuid4()}-{file.filename}"
        results.append({"filename": filename, "url": f"https://files.sikayetkktc.com/{filename}"})
    return {"uploaded": results, "count": len(results)}
