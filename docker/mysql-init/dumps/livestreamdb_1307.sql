/*
 Navicat Premium Dump SQL

 Source Server         : KLTN
 Source Server Type    : MySQL
 Source Server Version : 100432 (10.4.32-MariaDB)
 Source Host           : localhost:3306
 Source Schema         : livestreamdb

 Target Server Type    : MySQL
 Target Server Version : 100432 (10.4.32-MariaDB)
 File Encoding         : 65001

 Date: 13/07/2026 18:25:21
*/

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- ----------------------------
-- Table structure for livestream_participants
-- ----------------------------
DROP TABLE IF EXISTS `livestream_participants`;
CREATE TABLE `livestream_participants`  (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `created_at` datetime(6) NOT NULL,
  `joined_at` datetime(6) NOT NULL,
  `left_at` datetime(6) NULL DEFAULT NULL,
  `role` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `room_id` bigint NOT NULL,
  `status` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `updated_at` datetime(6) NULL DEFAULT NULL,
  `user_id` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `username` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 18 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_general_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of livestream_participants
-- ----------------------------
INSERT INTO `livestream_participants` VALUES (1, '2026-06-09 21:43:29.000000', '2026-06-09 21:43:29.000000', '2026-06-09 21:46:07.000000', 'HOST', 1, 'LEFT', '2026-06-09 21:46:07.000000', '9ae5e6ec-3d7b-452b-ac1a-ea01c1d05b31', 'testuser');
INSERT INTO `livestream_participants` VALUES (2, '2026-06-09 21:44:06.000000', '2026-06-09 21:44:06.000000', '2026-06-09 21:46:07.000000', 'VIEWER', 1, 'LEFT', '2026-06-09 21:46:07.000000', '9806', 'viewer_9806');
INSERT INTO `livestream_participants` VALUES (3, '2026-06-09 21:44:54.000000', '2026-06-09 21:44:54.000000', '2026-06-09 21:46:07.000000', 'VIEWER', 1, 'LEFT', '2026-06-09 21:46:07.000000', '048ee526-036f-4cc2-a95c-4ac64f5c8204', 'thungan123');
INSERT INTO `livestream_participants` VALUES (4, '2026-06-11 18:11:56.000000', '2026-06-11 18:11:56.000000', NULL, 'HOST', 2, 'ACTIVE', '2026-06-11 18:11:56.000000', '9ae5e6ec-3d7b-452b-ac1a-ea01c1d05b31', 'testuser');
INSERT INTO `livestream_participants` VALUES (5, '2026-06-11 18:13:43.000000', '2026-06-11 18:13:43.000000', NULL, 'VIEWER', 2, 'ACTIVE', '2026-06-11 18:13:43.000000', '048ee526-036f-4cc2-a95c-4ac64f5c8204', 'thungan123');
INSERT INTO `livestream_participants` VALUES (6, '2026-06-25 15:32:57.000000', '2026-06-25 15:32:57.000000', '2026-06-25 18:12:23.000000', 'HOST', 3, 'LEFT', '2026-06-25 18:12:23.000000', '9ae5e6ec-3d7b-452b-ac1a-ea01c1d05b31', 'testuser');
INSERT INTO `livestream_participants` VALUES (7, '2026-06-25 18:13:08.000000', '2026-06-25 18:13:08.000000', '2026-06-25 18:13:29.000000', 'HOST', 4, 'LEFT', '2026-06-25 18:13:29.000000', '9ae5e6ec-3d7b-452b-ac1a-ea01c1d05b31', 'testuser');
INSERT INTO `livestream_participants` VALUES (8, '2026-06-25 18:19:36.000000', '2026-06-25 18:19:36.000000', '2026-06-25 18:19:40.000000', 'HOST', 5, 'LEFT', '2026-06-25 18:19:40.000000', '9ae5e6ec-3d7b-452b-ac1a-ea01c1d05b31', 'testuser');
INSERT INTO `livestream_participants` VALUES (9, '2026-07-12 17:39:24.000000', '2026-07-12 17:39:24.000000', '2026-07-12 17:39:55.000000', 'HOST', 6, 'LEFT', '2026-07-12 17:39:55.000000', '20d428c7-bc91-49de-b321-17d40dae8a68', 'tien');
INSERT INTO `livestream_participants` VALUES (10, '2026-07-12 17:40:04.000000', '2026-07-12 17:40:04.000000', NULL, 'HOST', 7, 'ACTIVE', '2026-07-12 17:40:04.000000', '20d428c7-bc91-49de-b321-17d40dae8a68', 'tien');
INSERT INTO `livestream_participants` VALUES (11, '2026-07-12 17:40:37.000000', '2026-07-12 17:40:37.000000', NULL, 'VIEWER', 7, 'ACTIVE', '2026-07-12 17:40:37.000000', '3184', 'viewer_3184');
INSERT INTO `livestream_participants` VALUES (12, '2026-07-12 20:33:49.000000', '2026-07-12 20:33:49.000000', NULL, 'HOST', 8, 'ACTIVE', '2026-07-12 20:33:49.000000', '9ae5e6ec-3d7b-452b-ac1a-ea01c1d05b31', 'testuser');
INSERT INTO `livestream_participants` VALUES (13, '2026-07-12 20:34:51.000000', '2026-07-12 20:34:51.000000', NULL, 'VIEWER', 8, 'ACTIVE', '2026-07-12 20:34:51.000000', '781', 'viewer_781');
INSERT INTO `livestream_participants` VALUES (14, '2026-07-12 23:11:41.000000', '2026-07-12 23:11:41.000000', NULL, 'VIEWER', 8, 'ACTIVE', '2026-07-12 23:11:41.000000', '6021', 'viewer_6021');
INSERT INTO `livestream_participants` VALUES (15, '2026-07-12 23:43:16.000000', '2026-07-12 23:43:16.000000', NULL, 'VIEWER', 8, 'ACTIVE', '2026-07-12 23:43:16.000000', '167', 'viewer_167');
INSERT INTO `livestream_participants` VALUES (16, '2026-07-12 23:45:59.000000', '2026-07-12 23:45:59.000000', NULL, 'VIEWER', 8, 'ACTIVE', '2026-07-12 23:45:59.000000', '20d428c7-bc91-49de-b321-17d40dae8a68', 'tien');
INSERT INTO `livestream_participants` VALUES (17, '2026-07-13 08:43:38.000000', '2026-07-13 08:43:38.000000', NULL, 'HOST', 9, 'ACTIVE', '2026-07-13 08:43:38.000000', '9ae5e6ec-3d7b-452b-ac1a-ea01c1d05b31', 'testuser');

-- ----------------------------
-- Table structure for livestream_rooms
-- ----------------------------
DROP TABLE IF EXISTS `livestream_rooms`;
CREATE TABLE `livestream_rooms`  (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `created_at` datetime(6) NOT NULL,
  `current_viewers` int NOT NULL,
  `description` text CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL,
  `ended_at` datetime(6) NULL DEFAULT NULL,
  `host_id` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `host_name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `max_viewers` int NOT NULL,
  `room_name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `started_at` datetime(6) NULL DEFAULT NULL,
  `status` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `thumbnail` text CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL,
  `title` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `updated_at` datetime(6) NULL DEFAULT NULL,
  `store_id` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL,
  `store_name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL,
  PRIMARY KEY (`id`) USING BTREE,
  UNIQUE INDEX `UK96x0w264mikyrm9c2tcvos8st`(`room_name` ASC) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 10 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_general_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of livestream_rooms
-- ----------------------------
INSERT INTO `livestream_rooms` VALUES (1, '2026-06-09 21:43:29.000000', 2, 'Mua 1 tặng 1', '2026-06-09 21:46:07.000000', '9ae5e6ec-3d7b-452b-ac1a-ea01c1d05b31', 'testuser', 1000, 'room_9ae5e6ec3d7b452bac1aea01c1d05b31_1781016209668', '2026-06-09 21:43:29.000000', 'ENDED', NULL, 'Livestream', '2026-06-09 21:46:07.000000', NULL, NULL);
INSERT INTO `livestream_rooms` VALUES (2, '2026-06-11 18:11:56.000000', 1, 'hellooo', NULL, '9ae5e6ec-3d7b-452b-ac1a-ea01c1d05b31', 'testuser', 1000, 'room_9ae5e6ec3d7b452bac1aea01c1d05b31_1781176316002', '2026-06-11 18:11:56.000000', 'ENDED', NULL, 'live cùng mình nhé ', '2026-06-11 18:13:43.000000', 'bd24206e-d42f-4736-9106-16dca8c687e9', 'Thu Ngân');
INSERT INTO `livestream_rooms` VALUES (3, '2026-06-25 15:32:57.000000', 0, 'abc', '2026-06-25 18:12:22.000000', '9ae5e6ec-3d7b-452b-ac1a-ea01c1d05b31', 'testuser', 1000, 'room_9ae5e6ec3d7b452bac1aea01c1d05b31_1782376377907', '2026-06-25 15:32:57.000000', 'ENDED', NULL, 'hi', '2026-06-25 18:12:23.000000', 'bd24206e-d42f-4736-9106-16dca8c687e9', 'Thu Ngân');
INSERT INTO `livestream_rooms` VALUES (4, '2026-06-25 18:13:08.000000', 0, 'ngan', '2026-06-25 18:13:29.000000', '9ae5e6ec-3d7b-452b-ac1a-ea01c1d05b31', 'testuser', 1000, 'room_9ae5e6ec3d7b452bac1aea01c1d05b31_1782385988090', '2026-06-25 18:13:08.000000', 'ENDED', NULL, 'ngan', '2026-06-25 18:13:29.000000', 'bd24206e-d42f-4736-9106-16dca8c687e9', 'Thu Ngân');
INSERT INTO `livestream_rooms` VALUES (5, '2026-06-25 18:19:36.000000', 0, 'aaa', '2026-06-25 18:19:40.000000', '9ae5e6ec-3d7b-452b-ac1a-ea01c1d05b31', 'testuser', 1000, 'room_9ae5e6ec3d7b452bac1aea01c1d05b31_1782386376039', '2026-06-25 18:19:36.000000', 'ENDED', NULL, 'aaa', '2026-06-25 18:19:40.000000', 'bd24206e-d42f-4736-9106-16dca8c687e9', 'Thu Ngân');
INSERT INTO `livestream_rooms` VALUES (6, '2026-07-12 17:39:23.000000', 0, '', '2026-07-12 17:39:54.000000', '20d428c7-bc91-49de-b321-17d40dae8a68', 'tien', 1000, 'room_20d428c7bc9149deb32117d40dae8a68_1783852763725', '2026-07-12 17:39:23.000000', 'ENDED', NULL, 'hiiiii', '2026-07-12 17:39:55.000000', '36c34cc4-3830-4729-bb41-dd3c57a884ee', 'tien');
INSERT INTO `livestream_rooms` VALUES (7, '2026-07-12 17:40:04.000000', 1, '', NULL, '20d428c7-bc91-49de-b321-17d40dae8a68', 'tien', 1000, 'room_20d428c7bc9149deb32117d40dae8a68_1783852804426', '2026-07-12 17:40:04.000000', 'ACTIVE', NULL, '11111', '2026-07-12 17:40:37.000000', '36c34cc4-3830-4729-bb41-dd3c57a884ee', 'tien');
INSERT INTO `livestream_rooms` VALUES (8, '2026-07-12 20:33:48.000000', 4, 'TEST THUI', NULL, '9ae5e6ec-3d7b-452b-ac1a-ea01c1d05b31', 'testuser', 1000, 'room_9ae5e6ec3d7b452bac1aea01c1d05b31_1783863228806', '2026-07-12 20:33:48.000000', 'ACTIVE', NULL, 'TEST', '2026-07-12 23:45:59.000000', 'bd24206e-d42f-4736-9106-16dca8c687e9', 'Thu Ngân');
INSERT INTO `livestream_rooms` VALUES (9, '2026-07-13 08:43:37.000000', 0, 'gugugugu', NULL, '9ae5e6ec-3d7b-452b-ac1a-ea01c1d05b31', 'testuser', 1000, 'room_9ae5e6ec3d7b452bac1aea01c1d05b31_1783907017960', '2026-07-13 08:43:37.000000', 'ACTIVE', NULL, 'hhhhh', '2026-07-13 08:43:37.000000', 'bd24206e-d42f-4736-9106-16dca8c687e9', 'Thu Ngân');

SET FOREIGN_KEY_CHECKS = 1;
