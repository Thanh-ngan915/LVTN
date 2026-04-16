-- Script test nhanh sau khi Google login
-- Chạy script này để kiểm tra xem Google login đã hoạt động đúng chưa

USE anvi_db;

-- 1. Kiểm tra cấu trúc bảng
SELECT '=== CHECKING TABLE STRUCTURES ===' AS status;

SELECT 
    COLUMN_NAME,
    DATA_TYPE,
    COLUMN_TYPE,
    IS_NULLABLE,
    COLUMN_KEY,
    EXTRA
FROM INFORMATION_SCHEMA.COLUMNS
WHERE TABLE_SCHEMA = 'anvi_db'
AND TABLE_NAME = 'user'
AND COLUMN_NAME = 'id';

-- Kết quả mong đợi: bigint(20), NO, PRI, auto_increment

-- 2. Kiểm tra users đã tạo
SELECT '=== CHECKING USERS ===' AS status;

SELECT 
    id,
    full_name,
    email,
    role,
    status,
    created_at
FROM user
ORDER BY id DESC
LIMIT 5;

-- Kết quả mong đợi: id là số (1, 2, 3...), KHÔNG phải UUID

-- 3. Kiểm tra accounts
SELECT '=== CHECKING ACCOUNTS ===' AS status;

SELECT 
    username,
    user_id,
    role,
    created_at
FROM account
ORDER BY created_at DESC
LIMIT 5;

-- Kết quả mong đợi: 
-- - username có dạng: google_123456789
-- - user_id là số (1, 2, 3...)

-- 4. Kiểm tra permissions
SELECT '=== CHECKING PERMISSIONS ===' AS status;

SELECT 
    id,
    user_id,
    instance,
    permission,
    created_at
FROM permission
ORDER BY created_at DESC
LIMIT 5;

-- Kết quả mong đợi: user_id là số (1, 2, 3...)

-- 5. Kiểm tra foreign key relationships
SELECT '=== CHECKING RELATIONSHIPS ===' AS status;

SELECT 
    u.id AS user_id,
    u.full_name,
    u.email,
    a.username,
    a.user_id AS account_user_id,
    p.user_id AS permission_user_id,
    CASE 
        WHEN u.id = a.user_id AND u.id = p.user_id THEN '✓ OK'
        ELSE '✗ MISMATCH'
    END AS status
FROM user u
LEFT JOIN account a ON u.id = a.user_id
LEFT JOIN permission p ON u.id = p.user_id
ORDER BY u.id DESC
LIMIT 5;

-- Kết quả mong đợi: Tất cả status = '✓ OK'

-- 6. Kiểm tra Google accounts
SELECT '=== CHECKING GOOGLE ACCOUNTS ===' AS status;

SELECT 
    a.username,
    a.user_id,
    u.full_name,
    u.email,
    u.image
FROM account a
JOIN user u ON a.user_id = u.id
WHERE a.username LIKE 'google_%'
ORDER BY a.created_at DESC
LIMIT 5;

-- Kết quả mong đợi:
-- - username bắt đầu bằng 'google_'
-- - user_id là số
-- - email có domain @st.hcmuaf.edu.vn hoặc @gmail.com

-- 7. Tổng kết
SELECT '=== SUMMARY ===' AS status;

SELECT 
    (SELECT COUNT(*) FROM user) AS total_users,
    (SELECT COUNT(*) FROM account WHERE username LIKE 'google_%') AS google_accounts,
    (SELECT COUNT(*) FROM account WHERE username NOT LIKE 'google_%') AS normal_accounts,
    (SELECT MAX(id) FROM user) AS max_user_id,
    (SELECT AUTO_INCREMENT FROM INFORMATION_SCHEMA.TABLES 
     WHERE TABLE_SCHEMA = 'anvi_db' AND TABLE_NAME = 'user') AS next_user_id;

-- 8. Kiểm tra xem có UUID nào còn sót lại không
SELECT '=== CHECKING FOR REMAINING UUIDs ===' AS status;

-- Nếu query này trả về kết quả, có nghĩa là vẫn còn UUID
SELECT 
    'WARNING: Found UUID in user table!' AS warning,
    id
FROM user
WHERE id > 1000000; -- BIGINT IDs sẽ nhỏ hơn 1000000

-- Nếu không có kết quả = OK!

SELECT '=== TEST COMPLETE ===' AS status;
SELECT 'If all user_id values are numbers (not UUIDs), Google login is working correctly!' AS result;
