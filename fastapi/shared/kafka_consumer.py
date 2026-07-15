"""
shared/kafka_consumer.py
──────────────────────────
Lắng nghe Kafka topic "product-events" và "store-events", gọi hàm incremental
update tương ứng trong shared/vector_db.py.

Được start bởi chatbot_service/main_chat.py lúc FastAPI app khởi động.
"""
import os
import json
import threading
import time

from kafka import KafkaConsumer
from kafka.errors import NoBrokersAvailable

from shared.vector_db import (
    upsert_product_in_index,
    upsert_store_products_in_index,
    upsert_policy_in_index,
    delete_policy_from_index,
)

KAFKA_BOOTSTRAP = os.getenv("KAFKA_BOOTSTRAP_SERVERS", "localhost:9092")
GROUP_ID = os.getenv("KAFKA_CONSUMER_GROUP", "chatbot-embedding-service")

PRODUCT_TOPIC = "product-events"
STORE_TOPIC = "store-events"
POLICY_TOPIC = "policy-events"


def _make_consumer(topic: str) -> KafkaConsumer:
    return KafkaConsumer(
        topic,
        bootstrap_servers=KAFKA_BOOTSTRAP,
        group_id=GROUP_ID,
        value_deserializer=lambda v: json.loads(v.decode("utf-8")),
        auto_offset_reset="earliest",
        enable_auto_commit=True,
    )


def _consume_product_events():
    while True:
        try:
            consumer = _make_consumer(PRODUCT_TOPIC)
            print(f"👂 Đang lắng nghe topic '{PRODUCT_TOPIC}'…")
            for msg in consumer:
                event = msg.value
                event_type = event.get("eventType")
                product_id = event.get("productId")
                print(f"📩 [product-events] {event_type} — product_id={product_id}")
                try:
                    if event_type == "DELETED":
                        delete_product_from_index(product_id)
                    else:
                        upsert_product_in_index(product_id)
                except Exception as e:
                    print(f"⚠️  Lỗi xử lý event sản phẩm {product_id}: {e}")
        except NoBrokersAvailable:
            print("⚠️  Không kết nối được Kafka broker, thử lại sau 5s…")
            time.sleep(5)
        except Exception as e:
            print(f"⚠️  Consumer product-events lỗi, khởi động lại sau 5s: {e}")
            time.sleep(5)


def _consume_store_events():
    while True:
        try:
            consumer = _make_consumer(STORE_TOPIC)
            print(f"👂 Đang lắng nghe topic '{STORE_TOPIC}'…")
            for msg in consumer:
                event = msg.value
                store_id = event.get("storeId")
                print(f"📩 [store-events] {event.get('eventType')} — store_id={store_id}")
                try:
                    upsert_store_products_in_index(store_id)
                except Exception as e:
                    print(f"⚠️  Lỗi xử lý event shop {store_id}: {e}")
        except NoBrokersAvailable:
            print("⚠️  Không kết nối được Kafka broker, thử lại sau 5s…")
            time.sleep(5)
        except Exception as e:
            print(f"⚠️  Consumer store-events lỗi, khởi động lại sau 5s: {e}")
            time.sleep(5)

def _consume_policy_events():
    while True:
        try:
            consumer = _make_consumer(POLICY_TOPIC)
            print(f"👂 Đang lắng nghe topic '{POLICY_TOPIC}'…")
            for msg in consumer:
                event = msg.value
                event_type = event.get("eventType")
                policy_id = event.get("policyId")
                print(f"📩 [policy-events] {event_type} — policy_id={policy_id}")
                try:
                    if event_type == "DELETED":
                        delete_policy_from_index(policy_id)
                    else:
                        upsert_policy_in_index(policy_id)
                except Exception as e:
                    print(f"⚠️  Lỗi xử lý event policy {policy_id}: {e}")
        except NoBrokersAvailable:
            print("⚠️  Không kết nối được Kafka broker, thử lại sau 5s…")
            time.sleep(5)
        except Exception as e:
            print(f"⚠️  Consumer policy-events lỗi, khởi động lại sau 5s: {e}")
            time.sleep(5)


def start_kafka_consumers():
    """Gọi 1 lần khi FastAPI app khởi động (xem chatbot_service/main_chat.py)."""
    threading.Thread(target=_consume_product_events, daemon=True).start()
    threading.Thread(target=_consume_store_events, daemon=True).start()
    threading.Thread(target=_consume_policy_events, daemon=True).start()
    print("🚀 Kafka consumers đã khởi động (chạy nền)")