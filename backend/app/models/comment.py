from sqlalchemy import Column, Integer, String, Text, DateTime, ForeignKey, Boolean
from sqlalchemy.orm import relationship
from datetime import datetime
from app.core.database import Base

class Comment(Base):
    __tablename__ = "comments"
    id           = Column(Integer, primary_key=True, index=True)
    body         = Column(Text, nullable=False)
    user_id      = Column(Integer, ForeignKey("users.id"), nullable=False)
    complaint_id = Column(Integer, ForeignKey("complaints.id"), nullable=False)
    likes        = Column(Integer, default=0)
    is_approved  = Column(Boolean, default=True)
    created_at   = Column(DateTime, default=datetime.utcnow)
    user         = relationship("User", back_populates="comments")
    complaint    = relationship("Complaint", back_populates="comments")
