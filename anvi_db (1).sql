-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Apr 12, 2026 at 05:30 PM
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
-- Database: `anvi_db`
--

-- --------------------------------------------------------

--
-- Table structure for table `account`
--

CREATE TABLE `account` (
  `username` varchar(100) NOT NULL,
  `created_at` datetime(6) DEFAULT NULL,
  `created_by` varchar(50) DEFAULT NULL,
  `password` varchar(255) NOT NULL,
  `role` varchar(50) DEFAULT NULL,
  `store_role_id` varchar(50) DEFAULT NULL,
  `update_at` datetime(6) DEFAULT NULL,
  `updated_by` varchar(50) DEFAULT NULL,
  `user_id` varchar(50) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `account`
--

INSERT INTO `account` (`username`, `created_at`, `created_by`, `password`, `role`, `store_role_id`, `update_at`, `updated_by`, `user_id`) VALUES
('kieu', '2026-04-10 10:22:03.000000', 'kieu', '$2a$10$XA47VAkfvxsDlg9fp3a9X.lcSx.SJQm9nGb/XCSL.UlBeIPu08Nqi', 'USER', '97c714a7-6bb6-4cda-9b24-848ff74dfc4b', '2026-04-10 10:22:03.000000', 'kieu', '99060c34-37f6-4eba-b2b3-c61158f037e1'),
('newuser123', '2026-04-08 17:29:43.000000', 'newuser123', '$2a$10$8PVFni/0PgQ5rLJeylMRyeEV2Tpyo1iuNFzRfmSo5Xk6.8y7PgSDW', 'USER', '3e688f3b-7afe-413b-ab73-982fa7c326f7', '2026-04-08 17:29:43.000000', 'newuser123', '55ecbc94-34dd-44d7-bf37-dc199f0eb0b2'),
('ngan', '2026-04-08 02:40:54.000000', 'ngan', '$2a$10$OTSPmjA2qNZo22j/EfN5HOWSnYluzRYkVumVah8GZqOsBtXBJX6te', 'USER', '5597d6ff-9007-4e88-ad5b-b480f2ae63cf', '2026-04-08 02:40:54.000000', 'ngan', '1884ea16-19b6-4a0b-82c1-8c744ef56b20'),
('test5', '2026-04-08 02:38:21.000000', 'test5', '$2a$10$04cSmv1wbcP/Ng/GM7I5NuvqciQ5jINECmiv.EhGBaCTmW/veXnDe', 'USER', '239aac33-88fe-4504-bdec-c7dbc713ae1d', '2026-04-08 02:38:21.000000', 'test5', '4d38a5fd-1ec2-4e16-ac15-dc5ea57067c1'),
('test6', '2026-04-08 02:38:21.000000', 'test6', '$2a$10$KXNP86uG.NA.tx9HDLvFmOGeeDCjXnTCkCtU3dyD9NERWj.ldsWsu', 'USER', '35039885-ac92-472e-b9a5-09694355a9c6', '2026-04-08 02:38:21.000000', 'test6', 'f43a06b2-c2c0-4004-b29e-4e891ffe0c3f'),
('testuser2', '2026-04-10 00:06:38.000000', 'testuser2', '$2a$10$oc.htkQFIrM4fB6X3Pqam.uCN.cIRA8tfSRwidjh0wmM0D/DC/pEG', 'USER', '217f80e7-409d-4fa2-8e79-d6b2f9af155a', '2026-04-10 00:06:38.000000', 'testuser2', 'a04c1544-3702-48d3-8c3d-1aa6878e0139'),
('thanhngan', '2026-04-10 10:42:57.000000', 'thanhngan', '$2a$10$Emp5P5MW1wtDDYXZ9VyZyeDLA/wG5jWqiNHOStSU9O.gWKOjIcJP6', 'USER', '35aba0ea-fd3d-4080-9db6-381b3d90d1f3', '2026-04-10 10:42:57.000000', 'thanhngan', '023dc255-bc27-4ed2-ae81-a69fccb724eb'),
('thungan', '2026-04-08 15:05:42.000000', 'thungan', '$2a$10$.sJQj2AtXbTsA36hK14Oeuc4frtJXVluuOGkaDVJDD4qYPrXWgN6K', 'USER', 'b921e27e-f878-4997-9fc2-073d26e110c4', '2026-04-08 15:05:42.000000', 'thungan', '4c0c8013-3d72-495d-a374-452312b236e6');

-- --------------------------------------------------------

--
-- Table structure for table `permission`
--

CREATE TABLE `permission` (
  `id` varchar(50) NOT NULL,
  `created_at` datetime(6) DEFAULT NULL,
  `created_by` varchar(50) DEFAULT NULL,
  `instance` varchar(50) DEFAULT NULL,
  `permission` varchar(10) DEFAULT NULL,
  `update_at` datetime(6) DEFAULT NULL,
  `updated_by` varchar(50) DEFAULT NULL,
  `user_id` varchar(50) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `permission`
--

INSERT INTO `permission` (`id`, `created_at`, `created_by`, `instance`, `permission`, `update_at`, `updated_by`, `user_id`) VALUES
('0b765b14-0f0b-4c2e-9781-4b4f8fd2d816', '2026-04-08 02:38:20.000000', 'test5', 'DEFAULT', 'READ', '2026-04-08 02:38:20.000000', 'test5', '4d38a5fd-1ec2-4e16-ac15-dc5ea57067c1'),
('2d2389d9-3974-448f-9e17-f8b299203f69', '2026-04-10 10:42:57.000000', 'thanhngan', 'DEFAULT', 'READ', '2026-04-10 10:42:57.000000', 'thanhngan', '023dc255-bc27-4ed2-ae81-a69fccb724eb'),
('5a4185d5-4956-4d65-a55a-e6b3e67c9904', '2026-04-08 17:29:43.000000', 'newuser123', 'DEFAULT', 'READ', '2026-04-08 17:29:43.000000', 'newuser123', '55ecbc94-34dd-44d7-bf37-dc199f0eb0b2'),
('5bf3ccdb-07f8-4456-8185-f2e4de8411ad', '2026-04-10 10:22:03.000000', 'kieu', 'DEFAULT', 'READ', '2026-04-10 10:22:03.000000', 'kieu', '99060c34-37f6-4eba-b2b3-c61158f037e1'),
('5d1e75b6-99fe-4148-ae96-f768f647f3ff', '2026-04-08 02:40:54.000000', 'ngan', 'DEFAULT', 'READ', '2026-04-08 02:40:54.000000', 'ngan', '1884ea16-19b6-4a0b-82c1-8c744ef56b20'),
('80fff7c0-2f6b-4f59-aab4-60c81c9946ae', '2026-04-08 15:05:41.000000', 'thungan', 'DEFAULT', 'READ', '2026-04-08 15:05:41.000000', 'thungan', '4c0c8013-3d72-495d-a374-452312b236e6'),
('a4606f95-55c1-44a1-83cd-4eb76c8cbc13', '2026-04-08 02:38:21.000000', 'test6', 'DEFAULT', 'READ', '2026-04-08 02:38:21.000000', 'test6', 'f43a06b2-c2c0-4004-b29e-4e891ffe0c3f'),
('e4e63331-54b1-4b60-906a-1ca6765c8bd2', '2026-04-10 00:06:38.000000', 'testuser2', 'DEFAULT', 'READ', '2026-04-10 00:06:38.000000', 'testuser2', 'a04c1544-3702-48d3-8c3d-1aa6878e0139');

-- --------------------------------------------------------

--
-- Table structure for table `storerole`
--

CREATE TABLE `storerole` (
  `id` varchar(50) NOT NULL,
  `created_at` datetime(6) DEFAULT NULL,
  `created_by` varchar(50) DEFAULT NULL,
  `role` varchar(20) DEFAULT NULL,
  `status` varchar(10) DEFAULT NULL,
  `store_role` varchar(50) DEFAULT NULL,
  `update_at` datetime(6) DEFAULT NULL,
  `updated_by` varchar(50) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `storerole`
--

INSERT INTO `storerole` (`id`, `created_at`, `created_by`, `role`, `status`, `store_role`, `update_at`, `updated_by`) VALUES
('217f80e7-409d-4fa2-8e79-d6b2f9af155a', '2026-04-10 00:06:38.000000', 'testuser2', 'USER', 'ACTIVE', 'DEFAULT', '2026-04-10 00:06:38.000000', 'testuser2'),
('239aac33-88fe-4504-bdec-c7dbc713ae1d', '2026-04-08 02:38:20.000000', 'test5', 'USER', 'ACTIVE', 'DEFAULT', '2026-04-08 02:38:20.000000', 'test5'),
('35039885-ac92-472e-b9a5-09694355a9c6', '2026-04-08 02:38:21.000000', 'test6', 'USER', 'ACTIVE', 'DEFAULT', '2026-04-08 02:38:21.000000', 'test6'),
('35aba0ea-fd3d-4080-9db6-381b3d90d1f3', '2026-04-10 10:42:57.000000', 'thanhngan', 'USER', 'ACTIVE', 'DEFAULT', '2026-04-10 10:42:57.000000', 'thanhngan'),
('3e688f3b-7afe-413b-ab73-982fa7c326f7', '2026-04-08 17:29:43.000000', 'newuser123', 'USER', 'ACTIVE', 'DEFAULT', '2026-04-08 17:29:43.000000', 'newuser123'),
('5597d6ff-9007-4e88-ad5b-b480f2ae63cf', '2026-04-08 02:40:54.000000', 'ngan', 'USER', 'ACTIVE', 'DEFAULT', '2026-04-08 02:40:54.000000', 'ngan'),
('97c714a7-6bb6-4cda-9b24-848ff74dfc4b', '2026-04-10 10:22:03.000000', 'kieu', 'USER', 'ACTIVE', 'DEFAULT', '2026-04-10 10:22:03.000000', 'kieu'),
('b921e27e-f878-4997-9fc2-073d26e110c4', '2026-04-08 15:05:41.000000', 'thungan', 'USER', 'ACTIVE', 'DEFAULT', '2026-04-08 15:05:41.000000', 'thungan');

-- --------------------------------------------------------

--
-- Table structure for table `user`
--

CREATE TABLE `user` (
  `id` varchar(50) NOT NULL,
  `address` varchar(255) DEFAULT NULL,
  `birthday` datetime(6) DEFAULT NULL,
  `created_at` datetime(6) DEFAULT NULL,
  `email` varchar(255) DEFAULT NULL,
  `full_name` varchar(255) DEFAULT NULL,
  `image` varchar(255) DEFAULT NULL,
  `permission` varchar(255) DEFAULT NULL,
  `rank_id` varchar(50) DEFAULT NULL,
  `role` varchar(255) DEFAULT NULL,
  `status` varchar(10) DEFAULT NULL,
  `update_at` datetime(6) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `user`
--

INSERT INTO `user` (`id`, `address`, `birthday`, `created_at`, `email`, `full_name`, `image`, `permission`, `rank_id`, `role`, `status`, `update_at`) VALUES
('023dc255-bc27-4ed2-ae81-a69fccb724eb', 'quảng ngãi', NULL, '2026-04-10 10:42:57.000000', 'thanhngan@gmail.com', 'Thanh Ngân', NULL, 'READ', NULL, 'USER', 'ACTIVE', '2026-04-10 10:42:57.000000'),
('1884ea16-19b6-4a0b-82c1-8c744ef56b20', 'đường linh trung', NULL, '2026-04-08 02:40:54.000000', '22130181@st.hcmuaf.edu.vn', 'thanhngan', NULL, 'READ', NULL, 'USER', 'ACTIVE', '2026-04-08 02:40:54.000000'),
('4c0c8013-3d72-495d-a374-452312b236e6', 'đường linh trung', NULL, '2026-04-08 15:05:41.000000', 'ngan@gmail.com', 'Ngan', NULL, 'READ', NULL, 'USER', 'ACTIVE', '2026-04-08 15:05:41.000000'),
('4d38a5fd-1ec2-4e16-ac15-dc5ea57067c1', NULL, NULL, '2026-04-08 02:38:20.000000', 'test5@example.com', 'Test User 5', NULL, 'READ', NULL, 'USER', 'ACTIVE', '2026-04-08 02:38:20.000000'),
('55ecbc94-34dd-44d7-bf37-dc199f0eb0b2', NULL, NULL, '2026-04-08 17:29:43.000000', 'newuser123@example.com', 'New User', NULL, 'READ', NULL, 'USER', 'ACTIVE', '2026-04-08 17:29:43.000000'),
('99060c34-37f6-4eba-b2b3-c61158f037e1', 'đường linh trung', NULL, '2026-04-10 10:22:03.000000', 'kieu@gmail.com', 'Kieu', NULL, 'READ', NULL, 'USER', 'ACTIVE', '2026-04-10 10:22:03.000000'),
('a04c1544-3702-48d3-8c3d-1aa6878e0139', NULL, NULL, '2026-04-10 00:06:38.000000', 'test2@example.com', 'Test User', NULL, 'READ', NULL, 'USER', 'ACTIVE', '2026-04-10 00:06:38.000000'),
('f43a06b2-c2c0-4004-b29e-4e891ffe0c3f', NULL, NULL, '2026-04-08 02:38:21.000000', 'test6@example.com', 'Test User 6', NULL, 'READ', NULL, 'USER', 'ACTIVE', '2026-04-08 02:38:21.000000');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `account`
--
ALTER TABLE `account`
  ADD PRIMARY KEY (`username`);

--
-- Indexes for table `permission`
--
ALTER TABLE `permission`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `storerole`
--
ALTER TABLE `storerole`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `user`
--
ALTER TABLE `user`
  ADD PRIMARY KEY (`id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
