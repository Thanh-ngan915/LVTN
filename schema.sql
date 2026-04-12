-- Tạo database
CREATE DATABASE IF NOT EXISTS anvi_db;
USE anvi_db;

-- Bảng USER
CREATE TABLE IF NOT EXISTS `user` (
    `id` VARCHAR(50) PRIMARY KEY,
    `image` TEXT,
    `full_name` TEXT,
    `birthday` TIMESTAMP NULL,
    `email` VARCHAR(255),
    `address` TEXT,
    `rankId` VARCHAR(50),
    `role` TEXT,
    `status` VARCHAR(10),
    `update_at` TIMESTAMP NULL,
    `created_at` TIMESTAMP NULL,
    `permission` TEXT
);

-- Bảng STOREROLE
CREATE TABLE IF NOT EXISTS `storerole` (
    `id` VARCHAR(50) PRIMARY KEY,
    `store_role` VARCHAR(50),
    `status` VARCHAR(10),
    `role` VARCHAR(20),
    `created_by` VARCHAR(50),
    `updated_by` VARCHAR(50),
    `update_at` TIMESTAMP NULL,
    `created_at` TIMESTAMP NULL
);

-- Bảng PERMISSION
CREATE TABLE IF NOT EXISTS `permission` (
    `id` VARCHAR(50) PRIMARY KEY,
    `instance` VARCHAR(50),
    `permission` VARCHAR(10),
    `user_id` VARCHAR(50),
    `created_by` VARCHAR(50),
    `updated_by` VARCHAR(50),
    `update_at` TIMESTAMP NULL,
    `created_at` TIMESTAMP NULL,
    FOREIGN KEY (`user_id`) REFERENCES `user`(`id`)
);

-- Bảng ACCOUNT
CREATE TABLE IF NOT EXISTS `account` (
    `username` VARCHAR(100) PRIMARY KEY,
    `password` VARCHAR(255) NOT NULL,
    `user_id` VARCHAR(50),
    `store_role_id` VARCHAR(50),
    `role` VARCHAR(50),
    `created_by` VARCHAR(50),
    `updated_by` VARCHAR(50),
    `update_at` TIMESTAMP NULL,
    `created_at` TIMESTAMP NULL,
    FOREIGN KEY (`user_id`) REFERENCES `user`(`id`),
    FOREIGN KEY (`store_role_id`) REFERENCES `storerole`(`id`)
);

-- ============================================
-- LIVESTREAM SERVICE - SEPARATE DATABASE
-- ============================================

-- Create livestream database
CREATE DATABASE IF NOT EXISTS livestreamdb;
USE livestreamdb;

-- Create livestream_rooms table
CREATE TABLE IF NOT EXISTS livestream_rooms (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    room_name VARCHAR(255) NOT NULL UNIQUE,
    title VARCHAR(255) NOT NULL,
    description LONGTEXT,
    host_id BIGINT NOT NULL,
    host_name VARCHAR(255) NOT NULL,
    status VARCHAR(50) NOT NULL DEFAULT 'ACTIVE',
    current_viewers INT DEFAULT 0,
    max_viewers INT DEFAULT 1000,
    thumbnail LONGTEXT,
    started_at TIMESTAMP,
    ended_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_host_id (host_id),
    INDEX idx_status (status),
    INDEX idx_room_name (room_name)
);

-- Create livestream_participants table
CREATE TABLE IF NOT EXISTS livestream_participants (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    room_id BIGINT NOT NULL,
    user_id BIGINT NOT NULL,
    username VARCHAR(255) NOT NULL,
    role VARCHAR(50) NOT NULL,
    status VARCHAR(50) NOT NULL DEFAULT 'ACTIVE',
    joined_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    left_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (room_id) REFERENCES livestream_rooms(id) ON DELETE CASCADE,
    UNIQUE KEY unique_participant (room_id, user_id),
    INDEX idx_room_id (room_id),
    INDEX idx_user_id (user_id),
    INDEX idx_status (status),
    INDEX idx_role (role)
);

-- Create additional indexes for performance optimization
CREATE INDEX idx_participant_status ON livestream_participants(room_id, status);
CREATE INDEX idx_active_rooms ON livestream_rooms(status, created_at);
