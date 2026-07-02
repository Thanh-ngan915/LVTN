-- Migration: Thêm cột shipping_fee vào bảng `order`
-- Chạy 1 lần duy nhất nếu cột chưa tồn tại

ALTER TABLE `order`
    ADD COLUMN IF NOT EXISTS `shipping_fee` FLOAT NOT NULL DEFAULT 30000
    COMMENT 'Phí vận chuyển tính từ GHTK (hoặc mặc định 30,000đ)';

-- Cập nhật các đơn cũ: giữ logic cũ (>=500k miễn phí, còn lại 30,000)
UPDATE `order`
SET `shipping_fee` = CASE
    WHEN `total` >= 500000 THEN 0
    ELSE 30000
END
WHERE `shipping_fee` = 30000 OR `shipping_fee` IS NULL;
