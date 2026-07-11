import os
import json
from sqlalchemy import create_engine, Column, Integer, JSON
from sqlalchemy.orm import declarative_base, sessionmaker

# Lấy thông tin DB từ biến môi trường hoặc dùng mặc định
DB_HOST = os.getenv("DB_HOST", "localhost")
DB_PORT = os.getenv("DB_PORT", "3306")
DB_USER = os.getenv("DB_USER", "root")
DB_PASSWORD = os.getenv("DB_PASSWORD", "")
DB_NAME = os.getenv("DB_NAME", "productdb")

SQLALCHEMY_DATABASE_URL = f"mysql+pymysql://{DB_USER}:{DB_PASSWORD}@{DB_HOST}:{DB_PORT}/{DB_NAME}"

engine = create_engine(SQLALCHEMY_DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

class ProductEmbedding(Base):
    __tablename__ = "product_embedding"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    product_id = Column(Integer, unique=True, index=True, nullable=False)
    embedding_vector = Column(JSON, nullable=False) # Lưu vector dưới dạng mảng JSON

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

def init_db():
    Base.metadata.create_all(bind=engine)
