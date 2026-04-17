-- Script sửa hoàn chỉnh database cho Google Login
-- Chạy script này để đảm bảo database hoàn toàn sạch và đúng cấu trúc

USE anvi_db;

-- ===== BƯỚC 1: BACKUP (nếu cần) =====
-- Bạn có thể export database trước khi chạy script này

-- ===== BƯỚC 2: XÓA DỮ LIỆU CŨ =====
SET FOREIGN_KEY_CHECKS = 0;

TRUNCATE TABLE permission;
TRUNCATE TABLE account;
TRUNCATE TABLE user;
TRUNCATE TABLE storerole;

SET FOREIGN_KEY_CHECKS = 1;

-- ===== BƯỚC 3: ĐẢM BẢO CẤU TRÚC ĐÚNG =====

-- Bảng user
ALTER TABLE user 
  MODIFY COLUMN id BIGINT NOT NULL AUTO_INCREMENT,
  MODIFY COLUMN image TEXT DEFAULT NULL,
  MODIFY COLUMN full_name TEXT DEFAULT NULL,
  MODIFY COLUMN birthday datetime(6) DEFAULT NULL,
  MODIFY COLUMN email varchar(255) DEFAULT NULL,
  MODIFY COLUMN address TEXT DEFAULT NULL,
  MODIFY COLUMN rank_id varchar(50) DEFAULT NULL,
  MODIFY COLUMN role TEXT DEFAULT NULL,
  MODIFY COLUMN status varchar(10) DEFAULT NULL,
  MODIFY COLUMN update_at datetime(6) DEFAULT NULL,
  MODIFY COLUMN created_at datetime(6) DEFAULT NULL,
  MODIFY COLUMN permission TEXT DEFAULT NULL;

-- Bảng account
ALTER TABLE account 
  MODIFY COLUMN username varchar(100) NOT NULL,
  MODIFY COLUMN created_at datetime(6) DEFAULT NULL,
  MODIFY COLUMN created_by varchar(50) DEFAULT NULL,
  MODIFY COLUMN password varchar(255) NOT NULL,
  MODIFY COLUMN role varchar(50) DEFAULT NULL,
  MODIFY COLUMN store_role_id varchar(50) DEFAULT NULL,
  MODIFY COLUMN update_at datetime(6) DEFAULT NULL,
  MODIFY COLUMN updated_by varchar(50) DEFAULT NULL,
  MODIFY COLUMN user_id BIGINT DEFAULT NULL;

-- Bảng permission
ALTER TABLE permission 
  MODIFY COLUMN id varchar(50) NOT NULL,
  MODIFY COLUMN created_at datetime(6) DEFAULT NULL,
  MODIFY COLUMN created_by varchar(50) DEFAULT NULL,
  MODIFY COLUMN instance varchar(50) DEFAULT NULL,
  MODIFY COLUMN permission varchar(10) DEFAULT NULL,
  MODIFY COLUMN update_at datetime(6) DEFAULT NULL,
  MODIFY COLUMN updated_by varchar(50) DEFAULT NULL,
  MODIFY COLUMN user_id BIGINT DEFAULT NULL;

-- Bảng storerole (không cần thay đổi)
-- Giữ nguyên VARCHAR cho id vì đây là UUID

-- ===== BƯỚC 4: RESET AUTO_INCREMENT =====
ALTER TABLE user AUTO_INCREMENT = 1;

-- ===== BƯỚC 5: XÓA BẢNG MAPPING CŨ (nếu có) =====
DROP TABLE IF EXISTS user_id_mapping;

-- ===== BƯỚC 6: THÊM INDEXES (nếu chưa có) =====
-- Index cho account.user_id
SELECT COUNT(*) INTO @index_exists 
FROM INFORMATION_SCHEMA.STATISTICS 
WHERE TABLE_SCHEMA = 'anvi_db' 
AND TABLE_NAME = 'account' 
AND INDEX_NAME = 'idx_user_id';

SET @sql = IF(@index_exists = 0, 
  'ALTER TABLE account ADD INDEX idx_user_id (user_id)', 
  'SELECT "Index already exists" AS message');
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- Index cho permission.user_id
SELECT COUNT(*) INTO @index_exists 
FROM INFORMATION_SCHEMA.STATISTICS 
WHERE TABLE_SCHEMA = 'anvi_db' 
AND TABLE_NAME = 'permission' 
AND INDEX_NAME = 'idx_user_id';

SET @sql = IF(@index_exists = 0, 
  'ALTER TABLE permission ADD INDEX idx_user_id (user_id)', 
  'SELECT "Index already exists" AS message');
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- ===== BƯỚC 7: KIỂM TRA KẾT QUẢ =====
SELECT '========================================' AS '';
SELECT 'DATABASE STRUCTURE CHECK' AS '';
SELECT '========================================' AS '';

-- Kiểm tra cấu trúc user table
SELECT 'USER TABLE:' AS '';
SELECT 
    COLUMN_NAME,
    COLUMN_TYPE,
    IS_NULLABLE,
    COLUMN_KEY,
    EXTRA
FROM INFORMATION_SCHEMA.COLUMNS
WHERE TABLE_SCHEMA = 'anvi_db'
AND TABLE_NAME = 'user'
AND COLUMN_NAME IN ('id')
ORDER BY ORDINAL_POSITION;

-- Kiểm tra cấu trúc account table
SELECT 'ACCOUNT TABLE:' AS '';
SELECT 
    COLUMN_NAME,
    COLUMN_TYPE,
    IS_NULLABLE,
    COLUMN_KEY,
    EXTRA
FROM INFORMATION_SCHEMA.COLUMNS
WHERE TABLE_SCHEMA = 'anvi_db'
AND TABLE_NAME = 'account'
AND COLUMN_NAME IN ('username', 'user_id', 'store_role_id')
ORDER BY ORDINAL_POSITION;

-- Kiểm tra cấu trúc permission table
SELECT 'PERMISSION TABLE:' AS '';
SELECT 
    COLUMN_NAME,
    COLUMN_TYPE,
    IS_NULLABLE,
    COLUMN_KEY,
    EXTRA
FROM INFORMATION_SCHEMA.COLUMNS
WHERE TABLE_SCHEMA = 'anvi_db'
AND TABLE_NAME = 'permission'
AND COLUMN_NAME IN ('id', 'user_id')
ORDER BY ORDINAL_POSITION;

-- Kiểm tra dữ liệu
SELECT '========================================' AS '';
SELECT 'DATA CHECK' AS '';
SELECT '========================================' AS '';

SELECT 
    (SELECT COUNT(*) FROM user) AS total_users,
    (SELECT COUNT(*) FROM account) AS total_accounts,
    (SELECT COUNT(*) FROM permission) AS total_permissions,
    (SELECT COUNT(*) FROM storerole) AS total_storeroles;

-- Kiểm tra AUTO_INCREMENT
SELECT 
    TABLE_NAME,
    AUTO_INCREMENT
FROM INFORMATION_SCHEMA.TABLES
WHERE TABLE_SCHEMA = 'anvi_db'
AND TABLE_NAME = 'user';

SELECT '========================================' AS '';
SELECT 'EXPECTED RESULTS:' AS '';
SELECT '========================================' AS '';
SELECT 'user.id: bigint(20), NO, PRI, auto_increment' AS expected;
SELECT 'account.user_id: bigint(20), YES' AS expected;
SELECT 'permission.user_id: bigint(20), YES' AS expected;
SELECT 'All counts should be 0' AS expected;
SELECT 'AUTO_INCREMENT should be 1' AS expected;

SELECT '========================================' AS '';
SELECT 'DATABASE IS READY!' AS status;
SELECT 'You can now test Google login' AS next_step;
SELECT '========================================' AS '';
