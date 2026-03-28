from sqlalchemy import Column, Integer, String, Boolean, DateTime, Text
from sqlalchemy.orm import relationship
from datetime import datetime
from app.core.database import Base

class User(Base):
    __tablename__ = "users"

    id            = Column(Integer, primary_key=True, index=True)
    first_name    = Column(String(100), nullable=False)
    last_name     = Column(String(100), nullable=False)
    email         = Column(String(255), unique=True, index=True, nullable=False)
    phone         = Column(String(20), nullable=True)
    city          = Column(String(100), nullable=True)
    password_hash = Column(String(255), nullable=False)
    role          = Column(String(20), default="user")  # user | admin
    avatar_url    = Column(String(500), nullable=True)
    is_active     = Column(Boolean, default=True)
    is_blocked    = Column(Boolean, default=False)
    email_verified= Column(Boolean, default=False)
    phone_verified= Column(Boolean, default=False)
    created_at    = Column(DateTime, default=datetime.utcnow)
    updated_at    = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    complaints    = relationship("Complaint", back_populates="user")
    comments      = relationship("Comment", back_populates="user")
