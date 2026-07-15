import os
import json
import asyncio
from aiokafka import AIOKafkaConsumer
from database import SessionLocal, ProductEmbedding
from embedding_service import generate_embedding
import logging

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

KAFKA_BOOTSTRAP_SERVERS = os.getenv("KAFKA_BOOTSTRAP_SERVERS", "localhost:9092")
KAFKA_TOPIC = "product-created"
KAFKA_GROUP_ID = "fastapi-embedding-consumer"

async def consume_product_events():
    logger.info(f"Starting Kafka Consumer for topic: {KAFKA_TOPIC}")
    
    # Cấu hình consumer
    consumer = AIOKafkaConsumer(
        KAFKA_TOPIC,
        bootstrap_servers=KAFKA_BOOTSTRAP_SERVERS,
        group_id=KAFKA_GROUP_ID,
        auto_offset_reset="earliest", # Đọc từ đầu nếu chưa có offset
        value_deserializer=lambda x: json.loads(x.decode("utf-8")) if x else None
    )

    # Thử kết nối, có retry nếu Kafka chưa lên
    connected = False
    for _ in range(5):
        try:
            await consumer.start()
            connected = True
            logger.info("Successfully connected to Kafka")
            break
        except Exception as e:
            logger.warning(f"Failed to connect to Kafka: {e}. Retrying in 5s...")
            await asyncio.sleep(5)
            
    if not connected:
        logger.error("Could not connect to Kafka after multiple retries.")
        return

    try:
        async for msg in consumer:
            data = msg.value
            logger.info(f"Received message: {data}")
            if not data or "id" not in data:
                continue

            product_id = data.get("id")
            name = data.get("name", "")
            description = data.get("description", "")
            category = data.get("categoryName", "")

            # Gộp text để tạo embedding
            text_to_embed = f"{name}. {description}. Category: {category}"
            
            # Sinh embedding
            embedding_vector = generate_embedding(text_to_embed)

            # Lưu vào Database
            db = SessionLocal()
            try:
                # Cập nhật hoặc tạo mới
                existing = db.query(ProductEmbedding).filter(ProductEmbedding.product_id == product_id).first()
                if existing:
                    existing.embedding_vector = embedding_vector
                else:
                    new_embedding = ProductEmbedding(
                        product_id=product_id,
                        embedding_vector=embedding_vector
                    )
                    db.add(new_embedding)
                db.commit()
                logger.info(f"Successfully saved embedding for product {product_id}")
            except Exception as db_err:
                db.rollback()
                logger.error(f"Error saving embedding to DB: {db_err}")
            finally:
                db.close()
    except asyncio.CancelledError:
        logger.info("Kafka consumer task was cancelled.")
    except Exception as e:
        logger.error(f"Error in Kafka consumer loop: {e}")
    finally:
        await consumer.stop()
        logger.info("Kafka Consumer stopped.")
