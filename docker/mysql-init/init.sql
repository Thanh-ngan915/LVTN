-- Script tự động tạo tất cả databases khi MySQL container khởi động lần đầu
-- File này được mount vào /docker-entrypoint-initdb.d/ trong container MySQL

CREATE DATABASE IF NOT EXISTS usersdb
    CHARACTER SET utf8mb4
    COLLATE utf8mb4_unicode_ci;

CREATE DATABASE IF NOT EXISTS ordersdb
    CHARACTER SET utf8mb4
    COLLATE utf8mb4_unicode_ci;

CREATE DATABASE IF NOT EXISTS productdb
    CHARACTER SET utf8mb4
    COLLATE utf8mb4_unicode_ci;

CREATE DATABASE IF NOT EXISTS storesdb
    CHARACTER SET utf8mb4
    COLLATE utf8mb4_unicode_ci;

-- Cấp quyền cho user root truy cập tất cả databases
GRANT ALL PRIVILEGES ON usersdb.* TO 'root'@'%';
GRANT ALL PRIVILEGES ON ordersdb.* TO 'root'@'%';
GRANT ALL PRIVILEGES ON productdb.* TO 'root'@'%';
GRANT ALL PRIVILEGES ON storesdb.* TO 'root'@'%';
FLUSH PRIVILEGES;
