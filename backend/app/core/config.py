from pydantic_settings import BaseSettings
from typing import Optional

class Settings(BaseSettings):
    # App
    APP_NAME: str = "ŞikayetKKTC"
    APP_ENV: str = "production"
    SECRET_KEY: str = "CHANGE_THIS_IN_PRODUCTION_USE_openssl_rand_hex_32"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24 * 7  # 7 days

    # Database (Supabase / Neon PostgreSQL)
    DATABASE_URL: str = "postgresql+asyncpg://user:password@db.supabase.co:5432/postgres"

    # Redis (Upstash)
    REDIS_URL: str = "redis://default:password@region.upstash.io:6379"

    # Cloudflare R2 (File Storage)
    R2_ACCOUNT_ID: str = ""
    R2_ACCESS_KEY: str = ""
    R2_SECRET_KEY: str = ""
    R2_BUCKET: str = "sikayetkktc-uploads"
    R2_PUBLIC_URL: str = "https://files.sikayetkktc.com"

    # Email (Resend)
    RESEND_API_KEY: str = ""
    EMAIL_FROM: str = "noreply@sikayetkktc.com"

    # WhatsApp (optional: Twilio/Meta API)
    WHATSAPP_NUMBER: str = "+905391234567"

    # Admin
    ADMIN_EMAIL: str = "admin@sikayetkktc.com"
    ADMIN_PASSWORD: str = "CHANGE_THIS"

    class Config:
        env_file = ".env"

settings = Settings()
