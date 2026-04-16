-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Apr 13, 2026 at 07:19 AM
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
-- Database: `livestreamdb`
--

-- --------------------------------------------------------

--
-- Table structure for table `livestream_participants`
--

CREATE TABLE `livestream_participants` (
  `created_at` datetime(6) NOT NULL,
  `id` bigint(20) NOT NULL,
  `joined_at` datetime(6) NOT NULL,
  `left_at` datetime(6) DEFAULT NULL,
  `room_id` bigint(20) NOT NULL,
  `updated_at` datetime(6) DEFAULT NULL,
  `user_id` bigint(20) NOT NULL,
  `role` varchar(255) NOT NULL,
  `status` varchar(255) NOT NULL,
  `username` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `livestream_participants`
--

INSERT INTO `livestream_participants` (`created_at`, `id`, `joined_at`, `left_at`, `room_id`, `updated_at`, `user_id`, `role`, `status`, `username`) VALUES
('2026-04-12 08:58:35.000000', 1, '2026-04-12 08:58:35.000000', NULL, 1, '2026-04-12 08:58:35.000000', 1, 'HOST', 'ACTIVE', 'host_user'),
('2026-04-12 09:12:02.000000', 2, '2026-04-12 09:12:02.000000', NULL, 2, '2026-04-12 09:12:02.000000', 1, 'HOST', 'ACTIVE', 'host_user'),
('2026-04-12 10:02:00.000000', 3, '2026-04-12 10:02:00.000000', '2026-04-12 10:02:25.000000', 3, '2026-04-12 10:02:25.000000', 1, 'HOST', 'LEFT', 'host_user'),
('2026-04-12 10:02:38.000000', 4, '2026-04-12 10:02:38.000000', NULL, 4, '2026-04-12 10:02:38.000000', 1, 'HOST', 'ACTIVE', 'host_user'),
('2026-04-12 10:35:51.000000', 5, '2026-04-12 10:35:51.000000', NULL, 5, '2026-04-12 10:35:51.000000', 1, 'HOST', 'ACTIVE', 'host_user'),
('2026-04-12 11:07:02.000000', 6, '2026-04-12 11:07:02.000000', NULL, 6, '2026-04-12 11:07:02.000000', 1, 'HOST', 'ACTIVE', 'host_user'),
('2026-04-12 11:20:37.000000', 7, '2026-04-12 11:20:37.000000', NULL, 7, '2026-04-12 11:20:37.000000', 1, 'HOST', 'ACTIVE', 'host_user'),
('2026-04-12 11:24:16.000000', 8, '2026-04-12 11:24:16.000000', NULL, 8, '2026-04-12 11:24:16.000000', 1, 'HOST', 'ACTIVE', 'host_user'),
('2026-04-12 11:24:47.000000', 9, '2026-04-12 11:24:47.000000', '2026-04-12 11:34:05.000000', 8, '2026-04-12 11:34:05.000000', 2, 'VIEWER', 'LEFT', 'viewer_2'),
('2026-04-12 11:25:08.000000', 10, '2026-04-12 11:25:08.000000', NULL, 7, '2026-04-12 11:25:08.000000', 2, 'VIEWER', 'ACTIVE', 'viewer_2'),
('2026-04-12 11:33:30.000000', 11, '2026-04-12 11:33:30.000000', '2026-04-12 11:33:43.000000', 9, '2026-04-12 11:33:43.000000', 1, 'HOST', 'LEFT', 'host_user'),
('2026-04-12 11:33:56.000000', 12, '2026-04-12 11:33:56.000000', NULL, 8, '2026-04-12 11:33:56.000000', 1860, 'VIEWER', 'ACTIVE', 'viewer_1860'),
('2026-04-12 11:34:07.000000', 13, '2026-04-12 11:34:07.000000', NULL, 8, '2026-04-12 11:34:07.000000', 2399, 'VIEWER', 'ACTIVE', 'viewer_2399'),
('2026-04-12 11:34:43.000000', 14, '2026-04-12 11:34:43.000000', '2026-04-12 11:36:24.000000', 10, '2026-04-12 11:36:24.000000', 1, 'HOST', 'LEFT', 'host_user'),
('2026-04-12 11:35:18.000000', 15, '2026-04-12 11:35:18.000000', '2026-04-12 11:36:24.000000', 10, '2026-04-12 11:36:24.000000', 3233, 'VIEWER', 'LEFT', 'viewer_3233');

-- --------------------------------------------------------

--
-- Table structure for table `livestream_rooms`
--

CREATE TABLE `livestream_rooms` (
  `current_viewers` int(11) NOT NULL,
  `max_viewers` int(11) NOT NULL,
  `created_at` datetime(6) NOT NULL,
  `ended_at` datetime(6) DEFAULT NULL,
  `host_id` bigint(20) NOT NULL,
  `id` bigint(20) NOT NULL,
  `started_at` datetime(6) DEFAULT NULL,
  `updated_at` datetime(6) DEFAULT NULL,
  `description` text DEFAULT NULL,
  `host_name` varchar(255) NOT NULL,
  `room_name` varchar(255) NOT NULL,
  `status` varchar(255) NOT NULL,
  `thumbnail` text DEFAULT NULL,
  `title` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `livestream_rooms`
--

INSERT INTO `livestream_rooms` (`current_viewers`, `max_viewers`, `created_at`, `ended_at`, `host_id`, `id`, `started_at`, `updated_at`, `description`, `host_name`, `room_name`, `status`, `thumbnail`, `title`) VALUES
(0, 1000, '2026-04-12 08:58:35.000000', NULL, 1, 1, '2026-04-12 08:58:35.000000', '2026-04-12 08:58:35.000000', 'zfgzdgzs', 'host_user', 'room_1_1775984315767', 'ACTIVE', NULL, 'zxfzxfg'),
(0, 1000, '2026-04-12 09:12:02.000000', NULL, 1, 2, '2026-04-12 09:12:02.000000', '2026-04-12 09:12:02.000000', 'ÁDádA', 'host_user', 'room_1_1775985122205', 'ACTIVE', NULL, 'àdsasfd'),
(0, 1000, '2026-04-12 10:02:00.000000', '2026-04-12 10:02:25.000000', 1, 3, '2026-04-12 10:02:00.000000', '2026-04-12 10:02:25.000000', 'sdfsdfdsf', 'host_user', 'room_1_1775988120650', 'ENDED', NULL, 'sdfsdfs'),
(0, 1000, '2026-04-12 10:02:38.000000', NULL, 1, 4, '2026-04-12 10:02:38.000000', '2026-04-12 10:02:38.000000', 'ádasdsa', 'host_user', 'room_1_1775988158143', 'ACTIVE', NULL, 'ádasdasd'),
(0, 1000, '2026-04-12 10:35:51.000000', NULL, 1, 5, '2026-04-12 10:35:51.000000', '2026-04-12 10:35:51.000000', 'asdfdsaf', 'host_user', 'room_1_1775990151853', 'ACTIVE', NULL, 'dasdfdsa'),
(0, 1000, '2026-04-12 11:07:02.000000', NULL, 1, 6, '2026-04-12 11:07:02.000000', '2026-04-12 11:07:02.000000', 'bans len', 'host_user', 'room_1_1775992022553', 'ACTIVE', NULL, 'thanhngan'),
(1, 1000, '2026-04-12 11:20:36.000000', NULL, 1, 7, '2026-04-12 11:20:36.000000', '2026-04-12 11:25:08.000000', 'bán', 'host_user', 'room_1_1775992836951', 'ACTIVE', NULL, 'bán'),
(2, 1000, '2026-04-12 11:24:16.000000', NULL, 1, 8, '2026-04-12 11:24:16.000000', '2026-04-12 11:34:07.000000', 'bán quần\n', 'host_user', 'room_1_1775993056655', 'ACTIVE', NULL, 'bán quần'),
(0, 1000, '2026-04-12 11:33:30.000000', '2026-04-12 11:33:43.000000', 1, 9, '2026-04-12 11:33:30.000000', '2026-04-12 11:33:43.000000', 'bán củ cải', 'host_user', 'room_1_1775993610173', 'ENDED', NULL, 'bán củ cải'),
(1, 1000, '2026-04-12 11:34:43.000000', '2026-04-12 11:36:24.000000', 1, 10, '2026-04-12 11:34:43.000000', '2026-04-12 11:36:24.000000', 'Nhàn đáng iu', 'host_user', 'room_1_1775993683941', 'ENDED', NULL, 'bán Nhàn');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `livestream_participants`
--
ALTER TABLE `livestream_participants`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `livestream_rooms`
--
ALTER TABLE `livestream_rooms`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `UK96x0w264mikyrm9c2tcvos8st` (`room_name`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `livestream_participants`
--
ALTER TABLE `livestream_participants`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=16;

--
-- AUTO_INCREMENT for table `livestream_rooms`
--
ALTER TABLE `livestream_rooms`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
