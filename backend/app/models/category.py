from sqlalchemy import Column, Integer, String, Boolean
from sqlalchemy.orm import relationship
from app.core.database import Base

class Category(Base):
    __tablename__ = "categories"
    id        = Column(Integer, primary_key=True, index=True)
    name      = Column(String(150), nullable=False, unique=True)
    icon      = Column(String(10), default="📌")
    color     = Column(String(20), default="#1a3c5e")
    is_custom = Column(Boolean, default=False)
    complaints = relationship("Complaint", back_populates="category")
