from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.middleware.trustedhost import TrustedHostMiddleware
from contextlib import asynccontextmanager
from app.core.database import create_tables
from app.api.v1 import auth, complaints, comments, categories, users, admin, uploads

@asynccontextmanager
async def lifespan(app: FastAPI):
    await create_tables()
    yield

app = FastAPI(
    title="ŞikayetKKTC API",
    description="KKTC Şikayet Platformu Backend API",
    version="1.0.0",
    lifespan=lifespan,
    docs_url="/api/docs",
    redoc_url="/api/redoc",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "https://sikayetkktc.com",
        "https://www.sikayetkktc.com",
        "http://localhost:3000",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router,       prefix="/api/v1/auth",       tags=["Auth"])
app.include_router(complaints.router, prefix="/api/v1/complaints", tags=["Complaints"])
app.include_router(comments.router,   prefix="/api/v1/complaints", tags=["Comments"])
app.include_router(categories.router, prefix="/api/v1/categories", tags=["Categories"])
app.include_router(users.router,      prefix="/api/v1/users",      tags=["Users"])
app.include_router(admin.router,      prefix="/api/v1/admin",      tags=["Admin"])
app.include_router(uploads.router,    prefix="/api/v1/uploads",    tags=["Uploads"])

@app.get("/api/health")
async def health():
    return {"status": "ok", "service": "sikayetkktc-api"}
