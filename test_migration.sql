-- Script test nhanh để kiểm tra migration
-- Copy và paste vào phpMyAdmin hoặc MySQL Command Line

USE anvi_db;

-- 1. Kiểm tra cấu trúc bảng
SELECT 'Checking table structures...' AS status;

DESCRIBE user;
DESCRIBE account;
DESCRIBE permission;

-- 2. Kiểm tra kiểu dữ liệu
SELECT 'Checking data types...' AS status;

SELECT 
    TABLE_NAME,
    COLUMN_NAME,
    DATA_TYPE,
    COLUMN_TYPE,
    EXTRA
FROM INFORMATION_SCHEMA.COLUMNS
WHERE TABLE_SCHEMA = 'anvi_db'
AND TABLE_NAME IN ('user', 'account', 'permission')
AND COLUMN_NAME IN ('id', 'user_id')
ORDER BY TABLE_NAME, COLUMN_NAME;

-- 3. Kết quả mong đợi:
-- user.id: bigint(20), auto_increment
-- account.user_id: bigint(20)
-- permission.user_id: bigint(20)

SELECT 'Migration check complete!' AS status;
SELECT 'If you see bigint(20) for all id/user_id columns, migration is successful!' AS result;
