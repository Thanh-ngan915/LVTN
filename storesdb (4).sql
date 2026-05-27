-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: May 24, 2026 at 06:20 PM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `storesdb`
--

-- --------------------------------------------------------

--
-- Table structure for table `category_condition_voucher`
--

CREATE TABLE `category_condition_voucher` (
  `id` varchar(50) NOT NULL,
  `voucher_id` varchar(50) DEFAULT NULL,
  `category_shortname` varchar(50) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci ROW_FORMAT=DYNAMIC;

-- --------------------------------------------------------

--
-- Table structure for table `price_condition_voucher`
--

CREATE TABLE `price_condition_voucher` (
  `id` varchar(50) NOT NULL,
  `voucher_id` varchar(50) DEFAULT NULL,
  `total_min` float DEFAULT NULL,
  `total_max` float DEFAULT NULL,
  `price_min` float DEFAULT NULL,
  `price_max` float DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci ROW_FORMAT=DYNAMIC;

-- --------------------------------------------------------

--
-- Table structure for table `product_promotion`
--

CREATE TABLE `product_promotion` (
  `id` varchar(50) NOT NULL,
  `product_id` int(11) DEFAULT NULL,
  `name` varchar(1000) DEFAULT NULL,
  `image` float DEFAULT NULL,
  `quantity` int(11) DEFAULT NULL,
  `bought` int(11) DEFAULT NULL,
  `price_after` float DEFAULT NULL,
  `is_delete` tinyint(1) DEFAULT NULL,
  `created_by` varchar(50) DEFAULT NULL,
  `updated_by` varchar(50) DEFAULT NULL,
  `update_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci ROW_FORMAT=DYNAMIC;

-- --------------------------------------------------------

--
-- Table structure for table `sale_promotion`
--

CREATE TABLE `sale_promotion` (
  `id` varchar(50) NOT NULL,
  `title` varchar(255) DEFAULT NULL,
  `description` text DEFAULT NULL,
  `type` varchar(50) DEFAULT NULL,
  `status` int(11) DEFAULT NULL,
  `start_date` timestamp NULL DEFAULT NULL,
  `end_date` timestamp NULL DEFAULT NULL,
  `created_by` varchar(50) DEFAULT NULL,
  `updated_by` varchar(50) DEFAULT NULL,
  `update_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci ROW_FORMAT=DYNAMIC;

-- --------------------------------------------------------

--
-- Table structure for table `store`
--

CREATE TABLE `store` (
  `id` varchar(50) NOT NULL,
  `name` varchar(255) DEFAULT NULL,
  `image` varchar(255) DEFAULT NULL,
  `location` varchar(255) DEFAULT NULL,
  `description` varchar(255) DEFAULT NULL,
  `status` varchar(255) DEFAULT NULL,
  `created_by` varchar(255) DEFAULT NULL,
  `updated_by` varchar(255) DEFAULT NULL,
  `update_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci ROW_FORMAT=DYNAMIC;

--
-- Dumping data for table `store`
--

INSERT INTO `store` (`id`, `name`, `image`, `location`, `description`, `status`, `created_by`, `updated_by`, `update_at`, `created_at`) VALUES
('780b7001-dc57-49a1-a10c-306d9de33000', 'Ngân Trần', '', 'quang trung, quảng ngãi', 'bán len', 'pending', 'eb7d2c41-3f5a-4b82-a1d9-7c3e8f910b2d', NULL, '2026-05-21 18:08:22', '2026-05-21 18:08:22'),
('bd24206e-d42f-4736-9106-16dca8c687e9', 'Thu Ngân', '', '123 Đường 17, Linh Chiểu, Thủ Đức', 'ssda', 'pending', '9ae5e6ec-3d7b-452b-ac1a-ea01c1d05b31', NULL, '2026-05-13 04:21:09', '2026-05-13 04:21:09'),
('d57a019b-64d6-47e7-97bc-d9a60a7baa3a', 'Non la Viet Nam', 'https://res.cloudinary.com/dqghfi8be/image/upload/v1778726646/xme74r8oudzuvmgi90ol.png', 'nguyen tri phuong, quang ngai', 'nón lá việt nam truyền thống viêt', 'pending', '079420b0-9de3-44fa-94a8-30dab6c1f1c8', NULL, '2026-05-14 02:44:36', '2026-05-14 02:44:36');

-- --------------------------------------------------------

--
-- Table structure for table `store_sale_promotion`
--

CREATE TABLE `store_sale_promotion` (
  `id` varchar(50) NOT NULL,
  `sale_promotion_id` varchar(50) DEFAULT NULL,
  `store_id` text DEFAULT NULL,
  `status` int(11) DEFAULT NULL,
  `created_by` varchar(50) DEFAULT NULL,
  `updated_by` varchar(50) DEFAULT NULL,
  `update_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci ROW_FORMAT=DYNAMIC;

-- --------------------------------------------------------

--
-- Table structure for table `voucher`
--

CREATE TABLE `voucher` (
  `id` varchar(50) NOT NULL,
  `code` varchar(100) DEFAULT NULL,
  `title` varchar(255) DEFAULT NULL,
  `description` varchar(255) DEFAULT NULL,
  `init_quantity` int(11) DEFAULT NULL,
  `current_quantity` int(11) DEFAULT NULL,
  `status` int(11) DEFAULT NULL,
  `type` int(11) DEFAULT NULL,
  `store_id` varchar(50) DEFAULT NULL,
  `percent` double DEFAULT NULL,
  `maximum` int(11) DEFAULT NULL,
  `start_date` timestamp NULL DEFAULT NULL,
  `end_date` timestamp NULL DEFAULT NULL,
  `created_by` varchar(50) DEFAULT NULL,
  `updated_by` varchar(50) DEFAULT NULL,
  `update_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci ROW_FORMAT=DYNAMIC;

--
-- Indexes for dumped tables
--

--
-- Indexes for table `category_condition_voucher`
--
ALTER TABLE `category_condition_voucher`
  ADD PRIMARY KEY (`id`) USING BTREE,
  ADD KEY `fk_ccv_voucher` (`voucher_id`) USING BTREE;

--
-- Indexes for table `price_condition_voucher`
--
ALTER TABLE `price_condition_voucher`
  ADD PRIMARY KEY (`id`) USING BTREE,
  ADD KEY `fk_pcv_voucher` (`voucher_id`) USING BTREE;

--
-- Indexes for table `product_promotion`
--
ALTER TABLE `product_promotion`
  ADD PRIMARY KEY (`id`) USING BTREE,
  ADD KEY `fk_pp_sale_promotion` (`product_id`) USING BTREE;

--
-- Indexes for table `sale_promotion`
--
ALTER TABLE `sale_promotion`
  ADD PRIMARY KEY (`id`) USING BTREE;

--
-- Indexes for table `store`
--
ALTER TABLE `store`
  ADD PRIMARY KEY (`id`) USING BTREE;

--
-- Indexes for table `store_sale_promotion`
--
ALTER TABLE `store_sale_promotion`
  ADD PRIMARY KEY (`id`) USING BTREE,
  ADD KEY `fk_ssp_sale_promotion` (`sale_promotion_id`) USING BTREE;

--
-- Indexes for table `voucher`
--
ALTER TABLE `voucher`
  ADD PRIMARY KEY (`id`) USING BTREE,
  ADD KEY `fk_voucher_store` (`store_id`) USING BTREE;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `category_condition_voucher`
--
ALTER TABLE `category_condition_voucher`
  ADD CONSTRAINT `fk_ccv_voucher` FOREIGN KEY (`voucher_id`) REFERENCES `voucher` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `price_condition_voucher`
--
ALTER TABLE `price_condition_voucher`
  ADD CONSTRAINT `fk_pcv_voucher` FOREIGN KEY (`voucher_id`) REFERENCES `voucher` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `store_sale_promotion`
--
ALTER TABLE `store_sale_promotion`
  ADD CONSTRAINT `fk_ssp_sale_promotion` FOREIGN KEY (`sale_promotion_id`) REFERENCES `sale_promotion` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `voucher`
--
ALTER TABLE `voucher`
  ADD CONSTRAINT `fk_voucher_store` FOREIGN KEY (`store_id`) REFERENCES `store` (`id`) ON DELETE SET NULL ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
