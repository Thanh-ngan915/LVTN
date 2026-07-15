import pytest
import asyncio
from unittest.mock import patch, MagicMock, AsyncMock
from kafka_consumer import consume_product_events

@pytest.mark.asyncio
async def test_consume_product_events():
    # Mock AIOKafkaConsumer
    mock_consumer_instance = AsyncMock()
    
    # Giả lập data nhận được từ Kafka
    mock_msg = MagicMock()
    mock_msg.value = {
        "id": 999,
        "name": "Test Product",
        "description": "Test Description",
        "categoryName": "Test Category"
    }
    
    # Làm cho async for trả về 1 message rồi throw CancelledError để dừng loop
    async def mock_aiter():
        yield mock_msg
        raise asyncio.CancelledError()
        
    mock_consumer_instance.__aiter__.side_effect = mock_aiter

    with patch('kafka_consumer.AIOKafkaConsumer', return_value=mock_consumer_instance), \
         patch('kafka_consumer.generate_embedding', return_value=[0.1, 0.2, 0.3]) as mock_gen_embedding, \
         patch('kafka_consumer.SessionLocal') as mock_session_local:
        
        mock_db = MagicMock()
        mock_session_local.return_value = mock_db
        
        mock_query = MagicMock()
        mock_db.query.return_value = mock_query
        mock_query.filter.return_value = mock_query
        mock_query.first.return_value = None # Không tìm thấy, tạo mới

        # Chạy hàm consume (nó sẽ raise CancelledError nhưng đã được try-except bên trong)
        await consume_product_events()

        # Kiểm tra generate_embedding được gọi với đúng argument
        mock_gen_embedding.assert_called_once_with("Test Product. Test Description. Category: Test Category")

        # Kiểm tra db add và commit được gọi
        assert mock_db.add.called
        mock_db.commit.assert_called_once()
        mock_db.close.assert_called_once()
