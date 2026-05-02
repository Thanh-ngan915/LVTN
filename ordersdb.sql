-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: May 01, 2026 at 05:32 AM
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
-- Database: `ordersdb`
--

-- --------------------------------------------------------

--
-- Table structure for table `deliveryinformation`
--

CREATE TABLE `deliveryinformation` (
  `id` int(11) NOT NULL,
  `full_name` varchar(50) NOT NULL,
  `phone` varchar(12) NOT NULL,
  `address` text NOT NULL,
  `is_primary` varchar(100) NOT NULL DEFAULT 'false' COMMENT 'Địa chỉ mặc định',
  `user_id` int(11) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci COMMENT='Địa chỉ giao hàng của user';

-- --------------------------------------------------------

--
-- Table structure for table `order`
--

CREATE TABLE `order` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `store_id` int(11) NOT NULL,
  `total` float NOT NULL DEFAULT 0,
  `discount` float NOT NULL DEFAULT 0,
  `pay` float NOT NULL DEFAULT 0,
  `voucher_id` int(11) DEFAULT NULL,
  `delivery_information_id` int(11) NOT NULL,
  `status` char(20) NOT NULL DEFAULT 'pending' COMMENT 'pending | confirmed | shipping | done | cancelled',
  `update_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci COMMENT='Bảng trung tâm lưu thông tin đơn hàng';

-- --------------------------------------------------------

--
-- Table structure for table `orderflow`
--

CREATE TABLE `orderflow` (
  `id` int(11) NOT NULL,
  `status` text NOT NULL COMMENT 'Trạng thái mới của đơn',
  `note` text DEFAULT NULL,
  `order_id` int(11) NOT NULL,
  `created_by` varchar(50) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci COMMENT='Lịch sử trạng thái đơn hàng';

-- --------------------------------------------------------

--
-- Table structure for table `orderrefund`
--

CREATE TABLE `orderrefund` (
  `id` int(11) NOT NULL,
  `order_id` int(11) NOT NULL,
  `status` varchar(50) NOT NULL DEFAULT 'pending' COMMENT 'pending | approved | rejected | completed',
  `title` varchar(50) DEFAULT NULL,
  `description` text DEFAULT NULL,
  `created_by` varchar(1000) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci COMMENT='Yêu cầu hoàn trả đơn hàng';

-- --------------------------------------------------------

--
-- Table structure for table `productorder`
--

CREATE TABLE `productorder` (
  `id` int(11) NOT NULL,
  `product_id` int(11) NOT NULL,
  `order_id` int(11) NOT NULL,
  `quantity` int(11) NOT NULL DEFAULT 1,
  `price_before` float NOT NULL DEFAULT 0 COMMENT 'Giá gốc tại thời điểm mua',
  `price_after` float NOT NULL DEFAULT 0 COMMENT 'Giá sau giảm tại thời điểm mua'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci COMMENT='Chi tiết sản phẩm trong đơn hàng';

-- --------------------------------------------------------

--
-- Table structure for table `productorderrefund`
--

CREATE TABLE `productorderrefund` (
  `id` int(11) NOT NULL,
  `order_refund_id` int(11) NOT NULL,
  `product_id` int(11) NOT NULL,
  `quantity` int(11) NOT NULL DEFAULT 1,
  `description` varchar(50) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci COMMENT='Chi tiết sản phẩm trong yêu cầu hoàn trả';

-- --------------------------------------------------------

--
-- Table structure for table `rating`
--

CREATE TABLE `rating` (
  `id` int(11) NOT NULL,
  `store_id` int(11) NOT NULL,
  `order_id` int(11) NOT NULL,
  `stars` double NOT NULL DEFAULT 5 COMMENT '1.0 - 5.0',
  `is_reply` tinyint(1) NOT NULL DEFAULT 0 COMMENT '0=chưa reply, 1=đã reply',
  `created_by` varchar(50) DEFAULT NULL,
  `updated_by` varchar(50) DEFAULT NULL,
  `update_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci COMMENT='Đánh giá của user sau khi mua hàng';

-- --------------------------------------------------------

--
-- Table structure for table `ratingmaterial`
--

CREATE TABLE `ratingmaterial` (
  `id` int(11) NOT NULL,
  `url` text NOT NULL COMMENT 'Đường dẫn ảnh/video',
  `rating_id` int(11) NOT NULL,
  `created_by` varchar(50) DEFAULT NULL,
  `updated_by` varchar(50) DEFAULT NULL,
  `update_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci COMMENT='Ảnh/video đính kèm đánh giá';

-- --------------------------------------------------------

--
-- Table structure for table `ratingreply`
--

CREATE TABLE `ratingreply` (
  `id` int(11) NOT NULL,
  `url` text DEFAULT NULL,
  `rating_id` int(11) NOT NULL,
  `rating_reply_id` int(11) DEFAULT NULL COMMENT 'NULL = comment gốc; có giá trị = reply của reply',
  `stars` double DEFAULT NULL,
  `is_reply` tinyint(1) NOT NULL DEFAULT 0,
  `created_by` varchar(50) DEFAULT NULL,
  `updated_by` varchar(50) DEFAULT NULL,
  `update_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci COMMENT='Phản hồi/reply cho đánh giá (hỗ trợ lồng nhau)';

-- --------------------------------------------------------

--
-- Table structure for table `voucher`
--

CREATE TABLE `voucher` (
  `id` int(11) NOT NULL,
  `code` varchar(100) NOT NULL,
  `title` varchar(255) NOT NULL,
  `init_quantity` int(11) NOT NULL DEFAULT 0,
  `current_quantity` int(11) NOT NULL DEFAULT 0,
  `description` text DEFAULT NULL,
  `type` varchar(50) NOT NULL COMMENT 'percent | fixed',
  `percent` double DEFAULT 0,
  `maximum` int(11) DEFAULT 0 COMMENT 'Giảm tối đa (VNĐ)',
  `start_date` datetime NOT NULL,
  `end_date` datetime NOT NULL,
  `status` int(11) NOT NULL DEFAULT 1 COMMENT '1=active, 0=inactive',
  `store_id` int(11) DEFAULT NULL COMMENT 'NULL = voucher toàn sàn',
  `created_by` varchar(50) DEFAULT NULL,
  `updated_by` varchar(50) DEFAULT NULL,
  `update_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci COMMENT='Mã giảm giá';

--
-- Indexes for dumped tables
--

--
-- Indexes for table `deliveryinformation`
--
ALTER TABLE `deliveryinformation`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_delivery_user` (`user_id`);

--
-- Indexes for table `order`
--
ALTER TABLE `order`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_order_user` (`user_id`),
  ADD KEY `idx_order_store` (`store_id`),
  ADD KEY `idx_order_status` (`status`),
  ADD KEY `fk_order_voucher` (`voucher_id`),
  ADD KEY `fk_order_delivery` (`delivery_information_id`);

--
-- Indexes for table `orderflow`
--
ALTER TABLE `orderflow`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_orderflow_order` (`order_id`);

--
-- Indexes for table `orderrefund`
--
ALTER TABLE `orderrefund`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_refund_order` (`order_id`);

--
-- Indexes for table `productorder`
--
ALTER TABLE `productorder`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_productorder_order` (`order_id`),
  ADD KEY `idx_productorder_product` (`product_id`);

--
-- Indexes for table `productorderrefund`
--
ALTER TABLE `productorderrefund`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_prodrefund_refund` (`order_refund_id`),
  ADD KEY `idx_prodrefund_product` (`product_id`);

--
-- Indexes for table `rating`
--
ALTER TABLE `rating`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_rating_store` (`store_id`),
  ADD KEY `idx_rating_order` (`order_id`);

--
-- Indexes for table `ratingmaterial`
--
ALTER TABLE `ratingmaterial`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_ratingmaterial_rating` (`rating_id`);

--
-- Indexes for table `ratingreply`
--
ALTER TABLE `ratingreply`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_ratingreply_rating` (`rating_id`),
  ADD KEY `idx_ratingreply_parent` (`rating_reply_id`);

--
-- Indexes for table `voucher`
--
ALTER TABLE `voucher`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `code` (`code`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `deliveryinformation`
--
ALTER TABLE `deliveryinformation`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `order`
--
ALTER TABLE `order`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `orderflow`
--
ALTER TABLE `orderflow`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `orderrefund`
--
ALTER TABLE `orderrefund`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `productorder`
--
ALTER TABLE `productorder`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `productorderrefund`
--
ALTER TABLE `productorderrefund`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `rating`
--
ALTER TABLE `rating`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `ratingmaterial`
--
ALTER TABLE `ratingmaterial`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `ratingreply`
--
ALTER TABLE `ratingreply`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `voucher`
--
ALTER TABLE `voucher`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `order`
--
ALTER TABLE `order`
  ADD CONSTRAINT `fk_order_delivery` FOREIGN KEY (`delivery_information_id`) REFERENCES `deliveryinformation` (`id`) ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_order_voucher` FOREIGN KEY (`voucher_id`) REFERENCES `voucher` (`id`) ON DELETE SET NULL ON UPDATE CASCADE;

--
-- Constraints for table `orderflow`
--
ALTER TABLE `orderflow`
  ADD CONSTRAINT `fk_orderflow_order` FOREIGN KEY (`order_id`) REFERENCES `order` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `orderrefund`
--
ALTER TABLE `orderrefund`
  ADD CONSTRAINT `fk_refund_order` FOREIGN KEY (`order_id`) REFERENCES `order` (`id`) ON UPDATE CASCADE;

--
-- Constraints for table `productorder`
--
ALTER TABLE `productorder`
  ADD CONSTRAINT `fk_productorder_order` FOREIGN KEY (`order_id`) REFERENCES `order` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `productorderrefund`
--
ALTER TABLE `productorderrefund`
  ADD CONSTRAINT `fk_prodrefund_refund` FOREIGN KEY (`order_refund_id`) REFERENCES `orderrefund` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `rating`
--
ALTER TABLE `rating`
  ADD CONSTRAINT `fk_rating_order` FOREIGN KEY (`order_id`) REFERENCES `order` (`id`) ON UPDATE CASCADE;

--
-- Constraints for table `ratingmaterial`
--
ALTER TABLE `ratingmaterial`
  ADD CONSTRAINT `fk_ratingmaterial_rating` FOREIGN KEY (`rating_id`) REFERENCES `rating` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `ratingreply`
--
ALTER TABLE `ratingreply`
  ADD CONSTRAINT `fk_ratingreply_parent` FOREIGN KEY (`rating_reply_id`) REFERENCES `ratingreply` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_ratingreply_rating` FOREIGN KEY (`rating_id`) REFERENCES `rating` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
