-- Script để kiểm tra migration đã thành công
-- Chạy script này sau khi migration để verify

USE anvi_db;

-- 1. Kiểm tra cấu trúc bảng user
SELECT 'Checking user table structure...' AS status;
DESCRIBE user;

-- 2. Kiểm tra cấu trúc bảng account
SELECT 'Checking account table structure...' AS status;
DESCRIBE account;

-- 3. Kiểm tra cấu trúc bảng permission
SELECT 'Checking permission table structure...' AS status;
DESCRIBE permission;

-- 4. Kiểm tra dữ liệu user (nếu có)
SELECT 'Checking user data...' AS status;
SELECT id, full_name, email, role, status, created_at 
FROM user 
ORDER BY id 
LIMIT 5;

-- 5. Kiểm tra dữ liệu account (nếu có)
SELECT 'Checking account data...' AS status;
SELECT username, user_id, role, created_at 
FROM account 
ORDER BY user_id 
LIMIT 5;

-- 6. Kiểm tra dữ liệu permission (nếu có)
SELECT 'Checking permission data...' AS status;
SELECT id, user_id, instance, permission, created_at 
FROM permission 
ORDER BY user_id 
LIMIT 5;

-- 7. Kiểm tra foreign key relationships
SELECT 'Checking foreign key relationships...' AS status;
SELECT 
    a.username,
    a.user_id,
    u.id AS user_table_id,
    u.full_name,
    u.email,
    CASE 
        WHEN a.user_id = u.id THEN 'OK'
        ELSE 'MISMATCH'
    END AS relationship_status
FROM account a
LEFT JOIN user u ON a.user_id = u.id
LIMIT 5;

-- 8. Kiểm tra permission relationships
SELECT 'Checking permission relationships...' AS status;
SELECT 
    p.id AS permission_id,
    p.user_id,
    u.id AS user_table_id,
    u.full_name,
    CASE 
        WHEN p.user_id = u.id THEN 'OK'
        ELSE 'MISMATCH'
    END AS relationship_status
FROM permission p
LEFT JOIN user u ON p.user_id = u.id
LIMIT 5;

-- 9. Kiểm tra data types
SELECT 'Checking data types...' AS status;
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

-- 10. Kiểm tra indexes
SELECT 'Checking indexes...' AS status;
SELECT 
    TABLE_NAME,
    INDEX_NAME,
    COLUMN_NAME,
    NON_UNIQUE,
    SEQ_IN_INDEX
FROM INFORMATION_SCHEMA.STATISTICS
WHERE TABLE_SCHEMA = 'anvi_db'
AND TABLE_NAME IN ('user', 'account', 'permission')
AND COLUMN_NAME IN ('id', 'user_id')
ORDER BY TABLE_NAME, INDEX_NAME, SEQ_IN_INDEX;

-- 11. Kiểm tra auto_increment
SELECT 'Checking auto_increment...' AS status;
SELECT 
    TABLE_NAME,
    AUTO_INCREMENT
FROM INFORMATION_SCHEMA.TABLES
WHERE TABLE_SCHEMA = 'anvi_db'
AND TABLE_NAME = 'user';

-- 12. Tổng kết
SELECT 'Migration verification complete!' AS status;
SELECT 
    (SELECT COUNT(*) FROM user) AS total_users,
    (SELECT COUNT(*) FROM account) AS total_accounts,
    (SELECT COUNT(*) FROM permission) AS total_permissions,
    (SELECT MAX(id) FROM user) AS max_user_id;
