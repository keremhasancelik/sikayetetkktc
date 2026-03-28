from sqlalchemy import Column, Integer, String, Boolean, DateTime, Text, ForeignKey
from sqlalchemy.orm import relationship
from datetime import datetime
from app.core.database import Base

class Complaint(Base):
    __tablename__ = "complaints"

    id           = Column(Integer, primary_key=True, index=True)
    title        = Column(String(300), nullable=False)
    body         = Column(Text, nullable=False)
    company      = Column(String(200), nullable=False, index=True)
    category_id  = Column(Integer, ForeignKey("categories.id"), nullable=False)
    user_id      = Column(Integer, ForeignKey("users.id"), nullable=False)
    status       = Column(String(30), default="Açık", index=True)
    is_published = Column(Boolean, default=True)
    views        = Column(Integer, default=0)
    votes        = Column(Integer, default=0)
    created_at   = Column(DateTime, default=datetime.utcnow, index=True)
    updated_at   = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    user         = relationship("User", back_populates="complaints")
    category     = relationship("Category", back_populates="complaints")
    comments     = relationship("Comment", back_populates="complaint", cascade="all, delete")
    attachments  = relationship("Attachment", back_populates="complaint", cascade="all, delete")
