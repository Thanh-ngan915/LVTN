-- Script sửa lỗi Google Login
-- Chạy script này để dọn dẹp dữ liệu cũ và chuẩn bị cho BIGINT user IDs

USE anvi_db;

-- Bước 1: Backup dữ liệu quan trọng (nếu cần)
-- Bạn có thể export trước khi chạy script này

-- Bước 2: Xóa tất cả dữ liệu cũ với UUID
SET FOREIGN_KEY_CHECKS = 0;

TRUNCATE TABLE permission;
TRUNCATE TABLE account;
TRUNCATE TABLE user;
TRUNCATE TABLE storerole;

SET FOREIGN_KEY_CHECKS = 1;

-- Bước 3: Đảm bảo cấu trúc bảng đúng với BIGINT

-- Kiểm tra và sửa bảng user
ALTER TABLE user MODIFY COLUMN id BIGINT NOT NULL AUTO_INCREMENT;

-- Kiểm tra và sửa bảng account
ALTER TABLE account MODIFY COLUMN user_id BIGINT DEFAULT NULL;

-- Kiểm tra và sửa bảng permission
ALTER TABLE permission MODIFY COLUMN user_id BIGINT DEFAULT NULL;

-- Bước 4: Reset AUTO_INCREMENT
ALTER TABLE user AUTO_INCREMENT = 1;

-- Bước 5: Xóa bảng mapping nếu tồn tại (từ migration cũ)
DROP TABLE IF EXISTS user_id_mapping;

-- Bước 6: Kiểm tra kết quả
SELECT 'Checking table structures...' AS status;

DESCRIBE user;
DESCRIBE account;
DESCRIBE permission;

-- Bước 7: Kiểm tra kiểu dữ liệu
SELECT 
    TABLE_NAME,
    COLUMN_NAME,
    DATA_TYPE,
    COLUMN_TYPE,
    IS_NULLABLE,
    COLUMN_KEY,
    EXTRA
FROM INFORMATION_SCHEMA.COLUMNS
WHERE TABLE_SCHEMA = 'anvi_db'
AND TABLE_NAME IN ('user', 'account', 'permission')
AND COLUMN_NAME IN ('id', 'user_id')
ORDER BY TABLE_NAME, COLUMN_NAME;

-- Kết quả mong đợi:
-- user.id: bigint(20), NO, PRI, auto_increment
-- account.user_id: bigint(20), YES
-- permission.user_id: bigint(20), YES

SELECT 'Database cleaned and ready for BIGINT user IDs!' AS result;
SELECT 'You can now test Google login - it will create new users with numeric IDs' AS next_step;
