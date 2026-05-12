-- =====================================================
-- Migration: Chuyển user_id, store_id từ INT sang VARCHAR
-- để khớp với UUID từ usersdb
-- =====================================================

USE ordersdb;

-- 1. Bảng order: đổi user_id và store_id sang VARCHAR
ALTER TABLE `order` MODIFY COLUMN `user_id` VARCHAR(100) NOT NULL;
ALTER TABLE `order` MODIFY COLUMN `store_id` VARCHAR(100) NOT NULL;

-- 2. Bảng deliveryinformation: đổi user_id sang VARCHAR
ALTER TABLE `deliveryinformation` MODIFY COLUMN `user_id` VARCHAR(100) NOT NULL;

-- 3. Bảng voucher: đổi store_id sang VARCHAR
ALTER TABLE `voucher` MODIFY COLUMN `store_id` VARCHAR(100);

-- 4. Thêm các cột product metadata vào productorder (nếu chưa có)
ALTER TABLE `productorder` ADD COLUMN IF NOT EXISTS `product_name` VARCHAR(500) DEFAULT NULL;
ALTER TABLE `productorder` ADD COLUMN IF NOT EXISTS `product_image` VARCHAR(1000) DEFAULT NULL;
ALTER TABLE `productorder` ADD COLUMN IF NOT EXISTS `color` VARCHAR(100) DEFAULT NULL;
ALTER TABLE `productorder` ADD COLUMN IF NOT EXISTS `size` VARCHAR(50) DEFAULT NULL;

-- Done!
SELECT 'Migration completed successfully!' AS result;
