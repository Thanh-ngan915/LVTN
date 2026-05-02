-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Apr 18, 2026 at 01:29 PM
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
-- Database: `productdb`
--

-- --------------------------------------------------------

--
-- Table structure for table `category`
--

CREATE TABLE `category` (
  `shortname` varchar(50) NOT NULL,
  `name` varchar(255) DEFAULT NULL,
  `description` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `category`
--

INSERT INTO `category` (`shortname`, `name`, `description`) VALUES
('ao', 'Áo', 'Các loại áo thời trang nam nữ'),
('dam', 'Đầm & Váy', 'Đầm dự tiệc, váy công sở, áo dài'),
('giay', 'Giày & Dép', 'Giày thể thao, dép sandal'),
('phu_kien', 'Phụ kiện', 'Thắt lưng, mũ nón, kính mát'),
('quan', 'Quần', 'Quần jean, kaki, short các loại'),
('tui', 'Túi & Balo', 'Túi xách, balo thời trang');

-- --------------------------------------------------------

--
-- Table structure for table `product`
--

CREATE TABLE `product` (
  `id` int(11) NOT NULL,
  `name` text DEFAULT NULL,
  `price_before` float DEFAULT NULL,
  `price_after` float DEFAULT NULL,
  `init_quantity` int(11) DEFAULT NULL,
  `current_quantity` int(11) DEFAULT NULL,
  `sold` int(11) DEFAULT NULL,
  `description` text DEFAULT NULL,
  `status` varchar(20) DEFAULT NULL,
  `category` varchar(50) DEFAULT NULL,
  `store_id` varchar(50) DEFAULT NULL,
  `voucher_id` varchar(50) DEFAULT NULL,
  `rate` double DEFAULT NULL,
  `is_delete` bit(1) DEFAULT NULL,
  `created_by` varchar(50) DEFAULT NULL,
  `updated_by` varchar(50) DEFAULT NULL,
  `update_at` datetime(6) DEFAULT NULL,
  `created_at` datetime(6) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `product`
--

INSERT INTO `product` (`id`, `name`, `price_before`, `price_after`, `init_quantity`, `current_quantity`, `sold`, `description`, `status`, `category`, `store_id`, `voucher_id`, `rate`, `is_delete`, `created_by`, `updated_by`, `update_at`, `created_at`) VALUES
(1, 'Áo Thun Nam Basic Oversize Cotton', 250000, 179000, 200, 185, 15, 'Áo thun nam form rộng, chất liệu cotton 100% cao cấp, thoáng mát. Phù hợp đi chơi, đi học hàng ngày.', 'active', 'ao', 'store_001', NULL, 4.7, b'0', 'admin', NULL, NULL, '2026-04-17 03:39:35.000000'),
(2, 'Áo Polo Nam Cổ Bẻ Premium', 450000, 320000, 150, 138, 12, 'Áo polo nam chất liệu pique cao cấp, thêu logo tinh tế. Form chuẩn, tôn dáng.', 'active', 'ao', 'store_001', NULL, 4.8, b'0', 'admin', NULL, NULL, '2026-04-17 03:39:35.000000'),
(3, 'Áo Sơ Mi Nữ Linen Cổ V', 380000, 289000, 120, 108, 12, 'Áo sơ mi nữ vải linen tự nhiên, kiểu cổ V nhẹ nhàng, phù hợp công sở và đi chơi.', 'active', 'ao', 'store_001', NULL, 4.6, b'0', 'admin', NULL, NULL, '2026-04-17 03:39:35.000000'),
(4, 'Áo Khoác Jean Unisex Vintage', 650000, 499000, 80, 72, 8, 'Áo khoác jean form rộng unisex phong cách vintage retro. Chất liệu denim dày dặn, bền đẹp.', 'active', 'ao', 'store_001', NULL, 4.9, b'0', 'admin', NULL, NULL, '2026-04-17 03:39:35.000000'),
(5, 'Áo Hoodie Nỉ Bông Unisex', 420000, 329000, 100, 91, 9, 'Áo hoodie chất nỉ bông dày, ấm áp. Thiết kế tối giản, dễ phối đồ.', 'active', 'ao', 'store_002', NULL, 4.5, b'0', 'admin', NULL, NULL, '2026-04-17 03:39:35.000000'),
(6, 'Áo Crop Top Nữ Thun Gân', 180000, 129000, 150, 142, 8, 'Áo crop top nữ chất thun gân co giãn 4 chiều, ôm body vừa vặn.', 'active', 'ao', 'store_002', NULL, 4.4, b'0', 'admin', NULL, NULL, '2026-04-17 03:39:35.000000'),
(7, 'Quần Jean Nam Skinny Xanh Đậm', 550000, 389000, 120, 105, 15, 'Quần jean nam dáng skinny co giãn nhẹ, màu xanh đậm classic. Dễ phối với nhiều loại áo.', 'active', 'quan', 'store_001', NULL, 4.6, b'0', 'admin', NULL, NULL, '2026-04-17 03:39:35.000000'),
(8, 'Quần Kaki Nam Slim Fit Kem', 420000, 299000, 100, 88, 12, 'Quần kaki nam dáng slim fit gọn gàng, màu kem thanh lịch. Phù hợp công sở và đi chơi.', 'active', 'quan', 'store_001', NULL, 4.7, b'0', 'admin', NULL, NULL, '2026-04-17 03:39:35.000000'),
(9, 'Quần Short Nữ Lưng Cao Vintage', 280000, 199000, 130, 118, 12, 'Quần short nữ lưng cao phong cách vintage, chất liệu denim mềm mại.', 'active', 'quan', 'store_002', NULL, 4.5, b'0', 'admin', NULL, NULL, '2026-04-17 03:39:35.000000'),
(10, 'Quần Jogger Unisex Thun Nỉ', 350000, 249000, 150, 135, 15, 'Quần jogger unisex chất nỉ bông, co giãn thoải mái. Phù hợp thể thao và casual.', 'active', 'quan', 'store_002', NULL, 4.3, b'0', 'admin', NULL, NULL, '2026-04-17 03:39:35.000000'),
(11, 'Đầm Maxi Hoa Nhí Mùa Hè', 680000, 490000, 80, 74, 6, 'Đầm maxi dáng dài họa tiết hoa nhí nhẹ nhàng, vải voan mỏng mát. Phù hợp đi biển và dạo phố.', 'active', 'dam', 'store_003', 'vc-003', 4.8, b'0', 'admin', NULL, NULL, '2026-04-17 03:39:35.000000'),
(12, 'Váy Xòe Công Sở Houndstooth', 520000, 380000, 90, 84, 6, 'Váy xòe kẻ houndstooth thanh lịch, kiểu thiết kế công sở tinh tế. Dài qua gối.', 'active', 'dam', 'store_003', 'vc-003', 4.7, b'0', 'admin', NULL, NULL, '2026-04-17 03:39:35.000000'),
(13, 'Đầm Wrap Đơn Giản Màu Trơn', 590000, 420000, 70, 65, 5, 'Đầm wrap kiểu quấn thắt eo tôn dáng, màu trơn dễ phối. Vải lụa mịn mát.', 'active', 'dam', 'store_003', 'vc-003', 4.9, b'0', 'admin', NULL, NULL, '2026-04-17 03:39:35.000000'),
(14, 'Giày Sneaker Nam Trắng Cổ Thấp', 850000, 650000, 80, 72, 8, 'Giày sneaker nam màu trắng cổ thấp basic, đế cao su bền, đi êm. Dễ phối với mọi outfit.', 'active', 'giay', 'store_004', NULL, 4.8, b'0', 'admin', NULL, NULL, '2026-04-17 03:39:35.000000'),
(15, 'Sandal Nữ Quai Chéo Thời Trang', 320000, 220000, 120, 112, 8, 'Sandal nữ quai chéo mảnh thời trang, đế nền 3cm thoải mái. Phù hợp đi chơi mùa hè.', 'active', 'giay', 'store_004', NULL, 4.5, b'0', 'admin', NULL, NULL, '2026-04-17 03:39:35.000000'),
(16, 'Túi Tote Canvas In Chữ Minimalist', 280000, 199000, 150, 138, 12, 'Túi tote vải canvas dày, in họa tiết chữ minimalist. Dùng đi học, đi chợ, đi làm tiện lợi.', 'active', 'tui', 'store_005', NULL, 4.6, b'0', 'admin', NULL, NULL, '2026-04-17 03:39:35.000000'),
(17, 'Balo Laptop 15 inch Unisex Chống Thấm', 780000, 590000, 80, 75, 5, 'Balo đựng laptop 15 inch, chất liệu chống thấm nước, nhiều ngăn tiện dụng. Thiết kế unisex hiện đại.', 'active', 'tui', 'store_005', NULL, 4.9, b'0', 'admin', NULL, NULL, '2026-04-17 03:39:35.000000'),
(18, 'Túi Đeo Chéo Nữ Da PU Mini', 450000, 320000, 100, 93, 7, 'Túi đeo chéo nữ da PU mềm mini xinh xắn, khóa kéo chắc chắn. Đựng vừa điện thoại và ví.', 'active', 'tui', 'store_005', NULL, 4.7, b'0', 'admin', NULL, NULL, '2026-04-17 03:39:35.000000'),
(19, 'Mũ Bucket Hat Unisex Phong Cách', 180000, 129000, 200, 188, 12, 'Mũ bucket hat unisex nhiều màu sắc trẻ trung, chất liệu vải dù thoáng.', 'active', 'phu_kien', 'store_006', NULL, 4.5, b'0', 'admin', NULL, NULL, '2026-04-17 03:39:35.000000'),
(20, 'Kính Mát Phi Công Vintage UV400', 350000, 249000, 100, 93, 7, 'Kính mát phi công gọng kim loại mỏng nhẹ, tròng UV400 chống nắng hiệu quả.', 'active', 'phu_kien', 'store_006', NULL, 4.6, b'0', 'admin', NULL, NULL, '2026-04-17 03:39:35.000000'),
(21, 'Thắt Lưng Da Bò Thật Nam Khóa Pin', 420000, 310000, 80, 76, 4, 'Thắt lưng da bò thật 100%, khóa pin mạ vàng sang trọng. Bền bỉ, không bong tróc.', 'active', 'phu_kien', 'store_006', NULL, 4.8, b'0', 'admin', NULL, NULL, '2026-04-17 03:39:35.000000');

-- --------------------------------------------------------

--
-- Table structure for table `product_image`
--

CREATE TABLE `product_image` (
  `id` varchar(50) NOT NULL,
  `url` tinytext DEFAULT NULL,
  `product_id` int(11) NOT NULL,
  `created_by` varchar(50) DEFAULT NULL,
  `created_at` datetime(6) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `product_image`
--

INSERT INTO `product_image` (`id`, `url`, `product_id`, `created_by`, `created_at`) VALUES
('img-001', 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&h=400&fit=crop', 1, 'admin', '2026-04-17 03:50:53.000000'),
('img-002', 'https://picsum.photos/seed/polo/400/400', 2, 'admin', '2026-04-17 03:50:53.000000'),
('img-003', 'https://images.unsplash.com/photo-1598554747436-c9293d6a588f?w=400&h=400&fit=crop', 3, 'admin', '2026-04-17 03:50:53.000000'),
('img-004', 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=400&h=400&fit=crop', 4, 'admin', '2026-04-17 03:50:53.000000'),
('img-005', 'https://picsum.photos/seed/hoodie/400/400', 5, 'admin', '2026-04-17 03:50:53.000000'),
('img-006', 'https://picsum.photos/seed/croptop/400/400', 6, 'admin', '2026-04-17 03:50:53.000000'),
('img-007', 'https://picsum.photos/seed/jeans/400/400', 7, 'admin', '2026-04-17 03:50:53.000000'),
('img-008', 'https://picsum.photos/seed/kaki/400/400', 8, 'admin', '2026-04-17 03:50:53.000000'),
('img-009', 'https://picsum.photos/seed/shorts/400/400', 9, 'admin', '2026-04-17 03:50:53.000000'),
('img-010', 'https://picsum.photos/seed/jogger/400/400', 10, 'admin', '2026-04-17 03:50:53.000000'),
('img-011', 'https://images.unsplash.com/photo-1572804013427-4d7ca7268217?w=400&h=400&fit=crop', 11, 'admin', '2026-04-17 03:50:53.000000'),
('img-012', 'https://picsum.photos/seed/vayxoe/400/400', 12, 'admin', '2026-04-17 03:50:53.000000'),
('img-013', 'https://images.unsplash.com/photo-1496747611176-843222e1e57c?w=400&h=400&fit=crop', 13, 'admin', '2026-04-17 03:50:53.000000'),
('img-014', 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&h=400&fit=crop', 14, 'admin', '2026-04-17 03:50:53.000000'),
('img-015', 'https://picsum.photos/seed/sandal/400/400', 15, 'admin', '2026-04-17 03:50:53.000000'),
('img-016', 'https://picsum.photos/seed/totebag/400/400', 16, 'admin', '2026-04-17 03:50:53.000000'),
('img-017', 'https://picsum.photos/seed/balo/400/400', 17, 'admin', '2026-04-17 03:50:53.000000'),
('img-018', 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=400&h=400&fit=crop', 18, 'admin', '2026-04-17 03:50:53.000000'),
('img-019', 'https://picsum.photos/seed/buckethat/400/400', 19, 'admin', '2026-04-17 03:50:53.000000'),
('img-020', 'https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=400&h=400&fit=crop', 20, 'admin', '2026-04-17 03:50:53.000000'),
('img-021', 'https://images.unsplash.com/photo-1624222247344-550fb60fdbc0?w=400&h=400&fit=crop', 21, 'admin', '2026-04-17 03:50:53.000000');

-- --------------------------------------------------------

--
-- Table structure for table `product_variant`
--

CREATE TABLE `product_variant` (
  `id` int(11) NOT NULL,
  `color` varchar(50) DEFAULT NULL,
  `size` varchar(50) DEFAULT NULL,
  `sku` varchar(100) DEFAULT NULL,
  `price_before` float DEFAULT NULL,
  `price_after` float DEFAULT NULL,
  `init_quantity` int(11) DEFAULT NULL,
  `current_quantity` int(11) DEFAULT NULL,
  `sold` int(11) DEFAULT NULL,
  `product_id` int(11) NOT NULL,
  `created_at` datetime(6) DEFAULT NULL,
  `updated_at` datetime(6) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `product_variant`
--

INSERT INTO `product_variant` (`id`, `color`, `size`, `sku`, `price_before`, `price_after`, `init_quantity`, `current_quantity`, `sold`, `product_id`, `created_at`, `updated_at`) VALUES
(1, 'Trắng', 'S', 'AT-001-S-TRG', 250000, 179000, 30, 28, 2, 1, '2026-04-17 03:39:35.000000', NULL),
(2, 'Trắng', 'M', 'AT-001-M-TRG', 250000, 179000, 50, 47, 3, 1, '2026-04-17 03:39:35.000000', NULL),
(3, 'Trắng', 'L', 'AT-001-L-TRG', 250000, 179000, 50, 46, 4, 1, '2026-04-17 03:39:35.000000', NULL),
(4, 'Đen', 'M', 'AT-001-M-DEN', 250000, 179000, 40, 37, 3, 1, '2026-04-17 03:39:35.000000', NULL),
(5, 'Đen', 'L', 'AT-001-L-DEN', 250000, 179000, 30, 27, 3, 1, '2026-04-17 03:39:35.000000', NULL),
(6, 'Navy', 'M', 'AP-002-M-NV', 450000, 320000, 40, 37, 3, 2, '2026-04-17 03:39:35.000000', NULL),
(7, 'Navy', 'L', 'AP-002-L-NV', 450000, 320000, 40, 36, 4, 2, '2026-04-17 03:39:35.000000', NULL),
(8, 'Trắng', 'M', 'AP-002-M-TRG', 450000, 320000, 35, 32, 3, 2, '2026-04-17 03:39:35.000000', NULL),
(9, 'Đỏ đô', 'L', 'AP-002-L-DD', 450000, 320000, 35, 33, 2, 2, '2026-04-17 03:39:35.000000', NULL),
(10, 'Xanh đậm', '30', 'QJ-007-30-XD', 550000, 389000, 30, 27, 3, 7, '2026-04-17 03:39:35.000000', NULL),
(11, 'Xanh đậm', '31', 'QJ-007-31-XD', 550000, 389000, 30, 26, 4, 7, '2026-04-17 03:39:35.000000', NULL),
(12, 'Xanh đậm', '32', 'QJ-007-32-XD', 550000, 389000, 30, 27, 3, 7, '2026-04-17 03:39:35.000000', NULL),
(13, 'Xanh nhạt', '32', 'QJ-007-32-XN', 550000, 389000, 30, 25, 5, 7, '2026-04-17 03:39:35.000000', NULL),
(14, 'Trắng', '40', 'GS-014-40-TRG', 850000, 650000, 20, 18, 2, 14, '2026-04-17 03:39:35.000000', NULL),
(15, 'Trắng', '41', 'GS-014-41-TRG', 850000, 650000, 20, 18, 2, 14, '2026-04-17 03:39:35.000000', NULL),
(16, 'Trắng', '42', 'GS-014-42-TRG', 850000, 650000, 20, 18, 2, 14, '2026-04-17 03:39:35.000000', NULL),
(17, 'Đen', '42', 'GS-014-42-DEN', 850000, 650000, 20, 18, 2, 14, '2026-04-17 03:39:35.000000', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `user_add_product_to_cart`
--

CREATE TABLE `user_add_product_to_cart` (
  `id` varchar(50) NOT NULL,
  `user_id` varchar(255) DEFAULT NULL,
  `product_id` text DEFAULT NULL,
  `quantity` int(11) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `user_add_product_to_cart`
--

INSERT INTO `user_add_product_to_cart` (`id`, `user_id`, `product_id`, `quantity`, `created_at`) VALUES
('cart-001', 'user_001', '1', 2, '2026-04-17 08:30:00'),
('cart-002', 'user_001', '7', 1, '2026-04-17 08:32:00'),
('cart-003', 'user_002', '11', 1, '2026-04-17 09:20:00'),
('cart-004', 'user_002', '14', 1, '2026-04-17 09:22:00'),
('cart-005', 'user_003', '17', 2, '2026-04-17 10:30:00'),
('cart-006', 'user_003', '18', 1, '2026-04-17 10:35:00');

-- --------------------------------------------------------

--
-- Table structure for table `user_view_product`
--

CREATE TABLE `user_view_product` (
  `id` varchar(50) NOT NULL,
  `user_id` varchar(255) DEFAULT NULL,
  `product_id` text DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `user_view_product`
--

INSERT INTO `user_view_product` (`id`, `user_id`, `product_id`, `created_at`) VALUES
('uvp-001', 'user_001', '1', '2026-04-17 08:00:00'),
('uvp-002', 'user_001', '4', '2026-04-17 08:05:00'),
('uvp-003', 'user_002', '7', '2026-04-17 09:00:00'),
('uvp-004', 'user_002', '11', '2026-04-17 09:10:00'),
('uvp-005', 'user_003', '14', '2026-04-17 10:00:00'),
('uvp-006', 'user_003', '17', '2026-04-17 10:15:00');

-- --------------------------------------------------------

--
-- Table structure for table `voucher`
--

CREATE TABLE `voucher` (
  `id` varchar(50) NOT NULL,
  `code` varchar(100) DEFAULT NULL,
  `title` varchar(255) DEFAULT NULL,
  `description` text DEFAULT NULL,
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
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `voucher`
--

INSERT INTO `voucher` (`id`, `code`, `title`, `description`, `init_quantity`, `current_quantity`, `status`, `type`, `store_id`, `percent`, `maximum`, `start_date`, `end_date`, `created_by`, `updated_by`, `update_at`, `created_at`) VALUES
('vc-001', 'SALE10', 'Giảm 10% toàn bộ đơn hàng', 'Áp dụng cho tất cả sản phẩm, không giới hạn danh mục', 100, 85, 1, 1, 'store_001', 10, 50000, '2026-04-01 00:00:00', '2026-04-30 23:59:59', 'admin', NULL, NULL, '2026-03-28 07:00:00'),
('vc-002', 'FREESHIP', 'Miễn phí vận chuyển', 'Miễn phí ship cho đơn từ 200k', 200, 150, 1, 2, 'store_002', 0, 30000, '2026-04-01 00:00:00', '2026-05-01 23:59:59', 'admin', NULL, NULL, '2026-03-28 07:00:00'),
('vc-003', 'SUMMER20', 'Ưu đãi mùa hè 20%', 'Giảm 20% cho danh mục đầm và váy', 50, 40, 1, 1, 'store_003', 20, 100000, '2026-04-15 00:00:00', '2026-06-15 23:59:59', 'admin', NULL, NULL, '2026-04-10 07:00:00');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `category`
--
ALTER TABLE `category`
  ADD PRIMARY KEY (`shortname`);

--
-- Indexes for table `product`
--
ALTER TABLE `product`
  ADD PRIMARY KEY (`id`),
  ADD KEY `FKqx9wikktsev17ctu0kcpkrafc` (`category`);

--
-- Indexes for table `product_image`
--
ALTER TABLE `product_image`
  ADD KEY `FK6oo0cvcdtb6qmwsga468uuukk` (`product_id`);

--
-- Indexes for table `product_variant`
--
ALTER TABLE `product_variant`
  ADD PRIMARY KEY (`id`),
  ADD KEY `FKgrbbs9t374m9gg43l6tq1xwdj` (`product_id`);

--
-- Indexes for table `voucher`
--
ALTER TABLE `voucher`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `product`
--
ALTER TABLE `product`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=22;

--
-- AUTO_INCREMENT for table `product_variant`
--
ALTER TABLE `product_variant`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=18;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `product`
--
ALTER TABLE `product`
  ADD CONSTRAINT `FKqx9wikktsev17ctu0kcpkrafc` FOREIGN KEY (`category`) REFERENCES `category` (`shortname`);

--
-- Constraints for table `product_image`
--
ALTER TABLE `product_image`
  ADD CONSTRAINT `FK6oo0cvcdtb6qmwsga468uuukk` FOREIGN KEY (`product_id`) REFERENCES `product` (`id`);

--
-- Constraints for table `product_variant`
--
ALTER TABLE `product_variant`
  ADD CONSTRAINT `FKgrbbs9t374m9gg43l6tq1xwdj` FOREIGN KEY (`product_id`) REFERENCES `product` (`id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
