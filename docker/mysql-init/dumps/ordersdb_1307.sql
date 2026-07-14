/*
 Navicat Premium Dump SQL

 Source Server         : KLTN
 Source Server Type    : MySQL
 Source Server Version : 100432 (10.4.32-MariaDB)
 Source Host           : localhost:3306
 Source Schema         : ordersdb

 Target Server Type    : MySQL
 Target Server Version : 100432 (10.4.32-MariaDB)
 File Encoding         : 65001

 Date: 13/07/2026 18:25:43
*/

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- ----------------------------
-- Table structure for deliveryinformation
-- ----------------------------
DROP TABLE IF EXISTS `deliveryinformation`;
CREATE TABLE `deliveryinformation`  (
  `id` int NOT NULL AUTO_INCREMENT,
  `full_name` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL,
  `phone` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL,
  `address` text CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL,
  `is_primary` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT 'false',
  `user_id` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `recipient_name` varchar(200) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL,
  `province` varchar(200) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL,
  `district` varchar(200) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL,
  `ward` varchar(200) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL,
  `address_detail` varchar(500) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL,
  `is_default` tinyint(1) NULL DEFAULT 0,
  PRIMARY KEY (`id`) USING BTREE,
  INDEX `idx_delivery_user`(`user_id` ASC) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 111 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_general_ci COMMENT = 'Địa chỉ giao hàng của user' ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of deliveryinformation
-- ----------------------------
INSERT INTO `deliveryinformation` VALUES (1, 'Nguyß╗àn V─ân A', '0901234567', '123 ─Éã░ß╗Øng ABC, Q1, TP.HCM', 'false', '1', '2026-05-01 19:42:44', NULL, NULL, NULL, NULL, NULL, 0);
INSERT INTO `deliveryinformation` VALUES (2, NULL, '0944358453', NULL, 'false', 'eb7d2c41-3f5a-4b82-a1d9-7c3e8f910b2d', '2026-05-11 10:00:47', 'thanhngan', 'tphcm', 'quận thủ đức', 'linh trung', '21 Linh trung', 0);
INSERT INTO `deliveryinformation` VALUES (3, NULL, '0948358453', NULL, 'false', 'anonymousUser', '2026-05-12 12:09:34', 'thanhngan', 'tphcm', 'quận thủ đức', 'linh trung', '21 Linh trung', 0);
INSERT INTO `deliveryinformation` VALUES (4, NULL, '0948358453', NULL, 'false', 'anonymousUser', '2026-05-12 12:25:27', 'thanhngan', 'tphcm', 'quận thủ đức', 'linh trung', '21 Linh trung', 0);
INSERT INTO `deliveryinformation` VALUES (5, NULL, '0948358453', NULL, 'false', 'anonymousUser', '2026-05-12 12:26:01', 'thanhngan', 'tphcm', 'quận thủ đức', 'linh trung', '21 Linh trung', 0);
INSERT INTO `deliveryinformation` VALUES (6, NULL, '0948358453', NULL, 'false', 'anonymousUser', '2026-05-12 12:29:00', 'thanhngan', 'tphcm', 'quận thủ đức', 'linh trung', '21 Linh trung', 0);
INSERT INTO `deliveryinformation` VALUES (7, NULL, '0948358453', NULL, 'false', 'anonymousUser', '2026-05-12 12:29:02', 'thanhngan', 'tphcm', 'quận thủ đức', 'linh trung', '21 Linh trung', 0);
INSERT INTO `deliveryinformation` VALUES (8, NULL, '0948358453', NULL, 'false', 'anonymousUser', '2026-05-12 12:52:21', 'thanhngan', 'tphcm', 'quận thủ đức', 'linh trung', '21 Linh trung', 0);
INSERT INTO `deliveryinformation` VALUES (9, NULL, '0944358453', NULL, 'false', 'anonymousUser', '2026-05-12 13:10:50', 'Ngân Trần', 'sg', 'thuduc', 'lĩnhuan', 'linhtrung', 0);
INSERT INTO `deliveryinformation` VALUES (10, NULL, '0944358453', NULL, 'false', 'anonymousUser', '2026-05-12 13:15:47', 'Ngân Trần', 'sg', 'thuduc', 'lĩnhuan', 'linhtrung', 0);
INSERT INTO `deliveryinformation` VALUES (11, NULL, '0944358453', NULL, 'false', 'anonymousUser', '2026-05-12 13:18:49', 'Ngân Trần', 'sg', 'thuduc', 'lĩnhuan', 'linhtrung', 0);
INSERT INTO `deliveryinformation` VALUES (12, NULL, '0944358453', NULL, 'false', 'anonymousUser', '2026-05-12 13:19:27', 'Ngân Trần', 'sg', 'thuduc', 'lĩnhuan', 'linhtrung', 0);
INSERT INTO `deliveryinformation` VALUES (13, NULL, '0944358453', NULL, 'false', 'anonymousUser', '2026-05-12 13:21:32', 'Ngân Trần', 'sg', 'thuduc', 'lĩnhuan', 'linhtrung', 0);
INSERT INTO `deliveryinformation` VALUES (14, NULL, '0944358453', NULL, 'false', 'anonymousUser', '2026-05-12 13:25:17', 'Ngân Trần', 'sg', 'thuduc', 'lĩnhuan', 'linhtrung', 0);
INSERT INTO `deliveryinformation` VALUES (15, NULL, '0944358453', NULL, 'false', 'anonymousUser', '2026-05-12 13:26:07', 'Ngân Trần', 'sg', 'thuduc', 'lĩnhuan', 'linhtrung', 0);
INSERT INTO `deliveryinformation` VALUES (16, NULL, '0944358453', NULL, 'false', 'anonymousUser', '2026-05-12 14:02:57', 'Ngân Trần', 'sg', 'thuduc', 'lĩnhuan', 'linhtrung', 0);
INSERT INTO `deliveryinformation` VALUES (17, NULL, '0948358453', NULL, 'false', 'anonymousUser', '2026-05-12 14:07:54', 'thanhngan', 'tphcm', 'quận thủ đức', 'linh trung', '21 Linh trung', 0);
INSERT INTO `deliveryinformation` VALUES (18, NULL, '0948358453', NULL, 'false', 'anonymousUser', '2026-05-12 14:20:23', 'thanhngan', 'tphcm', 'quận thủ đức', 'linh trung', '21 Linh trung', 0);
INSERT INTO `deliveryinformation` VALUES (19, NULL, '0948358453', NULL, 'false', 'anonymousUser', '2026-05-12 14:40:47', 'thanhngan', 'tphcm', 'quận thủ đức', 'linh trung', '21 Linh trung', 0);
INSERT INTO `deliveryinformation` VALUES (20, NULL, '0948358453', NULL, 'false', 'anonymousUser', '2026-05-12 14:40:54', 'thanhngan', 'tphcm', 'quận thủ đức', 'linh trung', '21 Linh trung', 0);
INSERT INTO `deliveryinformation` VALUES (21, NULL, '0948358453', NULL, 'false', 'anonymousUser', '2026-05-12 14:40:55', 'thanhngan', 'tphcm', 'quận thủ đức', 'linh trung', '21 Linh trung', 0);
INSERT INTO `deliveryinformation` VALUES (22, NULL, '0948358453', NULL, 'false', 'eb7d2c41-3f5a-4b82-a1d9-7c3e8f910b2d', '2026-05-12 15:12:56', 'thanhngan', 'tphcm', 'quận thủ đức', 'linh trung', '21 Linh trung', 0);
INSERT INTO `deliveryinformation` VALUES (23, NULL, '0948358453', NULL, 'false', 'eb7d2c41-3f5a-4b82-a1d9-7c3e8f910b2d', '2026-05-12 15:16:56', 'thanhngan', 'tphcm', 'quận thủ đức', 'linh trung', '21 Linh trung', 0);
INSERT INTO `deliveryinformation` VALUES (24, NULL, '0948358453', NULL, 'false', 'eb7d2c41-3f5a-4b82-a1d9-7c3e8f910b2d', '2026-05-12 15:28:10', 'thanhngan', 'tphcm', 'quận thủ đức', 'linh trung', '21 Linh trung', 0);
INSERT INTO `deliveryinformation` VALUES (25, NULL, '0948358453', NULL, 'false', '882b4b5a-3e56-4208-986c-98bc2186ab3b', '2026-05-12 23:14:08', 'ThanhNgan', 'tphcm', 'quận thủ đức', 'linh trung', '21 Linh trung', 0);
INSERT INTO `deliveryinformation` VALUES (26, NULL, '0948358453', NULL, 'false', '882b4b5a-3e56-4208-986c-98bc2186ab3b', '2026-05-12 23:14:29', 'ThanhNgan', 'tphcm', 'quận thủ đức', 'linh trung', '21 Linh trung', 0);
INSERT INTO `deliveryinformation` VALUES (27, NULL, '0948358453', NULL, 'false', '882b4b5a-3e56-4208-986c-98bc2186ab3b', '2026-05-12 23:21:45', 'ThanhNgan', 'tphcm', 'quận thủ đức', 'linh trung', '21 Linh trung', 0);
INSERT INTO `deliveryinformation` VALUES (28, NULL, '0948358453', NULL, 'false', '882b4b5a-3e56-4208-986c-98bc2186ab3b', '2026-05-13 00:00:59', 'ThanhNgan', 'tphcm', 'quận thủ đức', 'linh trung', '21 Linh trung', 0);
INSERT INTO `deliveryinformation` VALUES (29, NULL, '0948358453', NULL, 'false', '882b4b5a-3e56-4208-986c-98bc2186ab3b', '2026-05-13 00:15:16', 'ThanhNgan', 'tphcm', 'quận thủ đức', 'linh trung', '21 Linh trung', 0);
INSERT INTO `deliveryinformation` VALUES (30, NULL, '0948358453', NULL, 'false', '882b4b5a-3e56-4208-986c-98bc2186ab3b', '2026-05-13 11:32:14', 'ThanhNgan', 'Thủ Đức', 'quận thủ đức', 'vạn thành', '21 hoàng diệu 2', 0);
INSERT INTO `deliveryinformation` VALUES (31, NULL, '0862162323', NULL, 'false', '9ae5e6ec-3d7b-452b-ac1a-ea01c1d05b31', '2026-05-14 12:48:45', 'Trần Ngọc An Nhiên', 'Hồ Chí Minh', 'Quan 1', 'Thu Duc', '123 Nguyen Hue', 0);
INSERT INTO `deliveryinformation` VALUES (32, NULL, '0862162323', NULL, 'false', '9ae5e6ec-3d7b-452b-ac1a-ea01c1d05b31', '2026-05-15 08:28:08', 'Trần Ngọc An Nhiên', 'Hồ Chí Minh', 'Quan 1', 'Thu Duc', '123 Nguyen Hue', 0);
INSERT INTO `deliveryinformation` VALUES (33, NULL, '0862162323', NULL, 'false', '9ae5e6ec-3d7b-452b-ac1a-ea01c1d05b31', '2026-05-20 10:49:14', 'Trần Ngọc An Nhiên', 'Hồ Chí Minh', 'Quan 1', 'Thu Duc', '123 Nguyen Hue', 0);
INSERT INTO `deliveryinformation` VALUES (34, NULL, '0862162323', NULL, 'false', '9ae5e6ec-3d7b-452b-ac1a-ea01c1d05b31', '2026-05-20 11:17:01', 'Trần Ngọc An Nhiên', 'Hồ Chí Minh', 'Quan 1', 'Thu Duc', '123 Nguyen Hue', 0);
INSERT INTO `deliveryinformation` VALUES (35, NULL, '0862162323', NULL, 'false', '9ae5e6ec-3d7b-452b-ac1a-ea01c1d05b31', '2026-05-20 11:23:29', 'Trần Ngọc An Nhiên', 'Hồ Chí Minh', 'Quan 1', 'Thu Duc', '123 Nguyen Hue', 0);
INSERT INTO `deliveryinformation` VALUES (36, NULL, '0862162323', NULL, 'false', '9ae5e6ec-3d7b-452b-ac1a-ea01c1d05b31', '2026-05-20 15:23:45', 'Trần Ngọc An Nhiên', 'Hồ Chí Minh', 'Quan 1', 'Thu Duc', '123 Nguyen Hue', 0);
INSERT INTO `deliveryinformation` VALUES (37, NULL, '0862162323', NULL, 'false', '9ae5e6ec-3d7b-452b-ac1a-ea01c1d05b31', '2026-05-20 15:49:56', 'Trần Ngọc An Nhiên', 'Hồ Chí Minh', 'Quan 1', 'Thu Duc', '123 Nguyen Hue', 0);
INSERT INTO `deliveryinformation` VALUES (38, NULL, '0862162323', NULL, 'false', '9ae5e6ec-3d7b-452b-ac1a-ea01c1d05b31', '2026-05-20 16:20:17', 'Trần Ngọc An Nhiên', 'Hồ Chí Minh', 'Quan 1', 'Thu Duc', '123 Nguyen Hue', 0);
INSERT INTO `deliveryinformation` VALUES (39, NULL, '0862162323', NULL, 'false', '9ae5e6ec-3d7b-452b-ac1a-ea01c1d05b31', '2026-05-20 16:57:52', 'Trần Ngọc An Nhiên', 'Hồ Chí Minh', 'Quan 1', 'Thu Duc', '123 Nguyen Hue', 0);
INSERT INTO `deliveryinformation` VALUES (40, NULL, '0862162323', NULL, 'false', '9ae5e6ec-3d7b-452b-ac1a-ea01c1d05b31', '2026-05-20 17:44:47', 'Trần Ngọc An Nhiên', 'Hồ Chí Minh', 'Quan 1', 'Thu Duc', '123 Nguyen Hue', 0);
INSERT INTO `deliveryinformation` VALUES (41, NULL, '0862162323', NULL, 'false', '9ae5e6ec-3d7b-452b-ac1a-ea01c1d05b31', '2026-05-20 17:51:59', 'Trần Ngọc An Nhiên', 'Hồ Chí Minh', 'Quan 1', 'Thu Duc', '123 Nguyen Hue', 0);
INSERT INTO `deliveryinformation` VALUES (42, NULL, '0862162324', NULL, 'false', 'c41636a7-61fe-4f6f-9456-ae1d99550945', '2026-05-27 17:52:49', 'Võ Thu', 'Hồ Chí Minh', 'Quan 1', 'Thu Duc', '123 Nguyen Hue', 0);
INSERT INTO `deliveryinformation` VALUES (43, NULL, '123456789', NULL, 'false', 'c41636a7-61fe-4f6f-9456-ae1d99550945', '2026-06-04 15:08:22', 'Võ Thu', 'Hồ Chí Minh', 'THủ Đức', 'Thủ Đức', '123 Nguyen Hue', 0);
INSERT INTO `deliveryinformation` VALUES (44, NULL, '0987654321', NULL, 'false', '048ee526-036f-4cc2-a95c-4ac64f5c8204', '2026-06-08 17:35:50', 'Trần Thị Thu Ngân', 'Hồ Chí Minh', 'THủ Đức', 'Thủ Đức', '123 Nguyen Hue', 0);
INSERT INTO `deliveryinformation` VALUES (45, NULL, '0862162321', NULL, 'false', '048ee526-036f-4cc2-a95c-4ac64f5c8204', '2026-06-08 18:14:35', 'Trần Thị Thu Ngân', 'Hồ Chí Minh', 'THủ Đức', 'Thu Duc', '123 Nguyen Hue', 0);
INSERT INTO `deliveryinformation` VALUES (46, NULL, '123456789', NULL, 'false', '048ee526-036f-4cc2-a95c-4ac64f5c8204', '2026-06-08 18:17:37', 'Trần Thị Thu Ngân', 'Hồ Chí Minh', 'THủ Đức', 'Thu Duc', '123 Nguyen Hue', 0);
INSERT INTO `deliveryinformation` VALUES (47, NULL, '0987654321', NULL, 'false', '9ae5e6ec-3d7b-452b-ac1a-ea01c1d05b31', '2026-06-09 22:38:32', 'Trần Ngọc An Nhiên', 'Hồ Chí Minh', 'THủ Đức', 'Thủ Đức', '123 Nguyen Hue', 0);
INSERT INTO `deliveryinformation` VALUES (48, NULL, '0862162324', NULL, 'false', '048ee526-036f-4cc2-a95c-4ac64f5c8204', '2026-06-10 17:28:26', 'Trần Thị Thu Ngân', 'Hồ Chí Minh', 'Quan 1', 'Thủ Đức', '123 Nguyen Hue', 0);
INSERT INTO `deliveryinformation` VALUES (49, NULL, '0862162324', NULL, 'false', '048ee526-036f-4cc2-a95c-4ac64f5c8204', '2026-06-10 21:58:00', 'Trần Thị Thu Ngân', 'Hồ Chí Minh', 'Quan 1', 'Thủ Đức', '123 Nguyen Hue', 0);
INSERT INTO `deliveryinformation` VALUES (50, NULL, '123456789', NULL, 'false', '048ee526-036f-4cc2-a95c-4ac64f5c8204', '2026-06-11 12:16:21', 'Trần Thị Thu Ngân', 'Hồ Chí Minh', 'Quan 1', 'Thu Duc', '123 đường 17', 0);
INSERT INTO `deliveryinformation` VALUES (51, NULL, '123456789', NULL, 'false', '048ee526-036f-4cc2-a95c-4ac64f5c8204', '2026-06-11 12:29:43', 'Trần Thị Thu Ngân', 'Hồ Chí Minh', 'Quan 1', 'Thủ Đức', '123 Nguyen Hue', 0);
INSERT INTO `deliveryinformation` VALUES (52, NULL, '0987654321', NULL, 'false', '048ee526-036f-4cc2-a95c-4ac64f5c8204', '2026-06-11 12:43:54', 'Trần Thị Thu Ngân', 'Hồ Chí Minh', 'Quan 1', 'Thủ Đức', '123 Nguyen Hue', 0);
INSERT INTO `deliveryinformation` VALUES (53, NULL, '123456789', NULL, 'false', '048ee526-036f-4cc2-a95c-4ac64f5c8204', '2026-06-11 12:52:32', 'Trần Thị Thu Ngân', 'Hồ Chí Minh', 'Quan 1', 'Thủ Đức', '123 Nguyen Hue', 0);
INSERT INTO `deliveryinformation` VALUES (54, NULL, '123456789', NULL, 'false', '048ee526-036f-4cc2-a95c-4ac64f5c8204', '2026-06-11 13:52:08', 'Trần Thị Thu Ngân', 'Hồ Chí Minh', 'Quan 1', 'Thủ Đức', '123 đường 17', 0);
INSERT INTO `deliveryinformation` VALUES (55, NULL, '123456789', NULL, 'false', '048ee526-036f-4cc2-a95c-4ac64f5c8204', '2026-06-11 15:13:42', 'Trần Thị Thu Ngân', 'Hồ Chí Minh', 'Quan 1', 'Thủ Đức', '123 đường 17', 0);
INSERT INTO `deliveryinformation` VALUES (56, NULL, '0987654321', NULL, 'false', '048ee526-036f-4cc2-a95c-4ac64f5c8204', '2026-06-11 15:21:08', 'Trần Thị Thu Ngân', 'Hồ Chí Minh', 'Quan 1', 'Thủ Đức', '123 đường 17', 0);
INSERT INTO `deliveryinformation` VALUES (57, NULL, '0987654321', NULL, 'false', '048ee526-036f-4cc2-a95c-4ac64f5c8204', '2026-06-11 16:39:23', 'Trần Thị Thu Ngân', 'Hồ Chí Minh', 'THủ Đức', 'Thu Duc', '123 Nguyen Hue', 0);
INSERT INTO `deliveryinformation` VALUES (58, NULL, '123456789', NULL, 'false', '45841b96-6a49-4879-b4ca-13d1cb80b4a2', '2026-06-11 16:40:44', 'Ngân Trần Nguyễn Thu', 'Hồ Chí Minh', 'THủ Đức', 'Thu Duc', '123 Nguyen Hue', 0);
INSERT INTO `deliveryinformation` VALUES (59, NULL, '123456789', NULL, 'false', '45841b96-6a49-4879-b4ca-13d1cb80b4a2', '2026-06-11 16:46:45', 'Ngân Trần Nguyễn Thu', 'Hồ Chí Minh', 'Quan 1', 'Thu Duc', '123 Nguyen Hue', 0);
INSERT INTO `deliveryinformation` VALUES (60, NULL, '0987654321', NULL, 'false', '45841b96-6a49-4879-b4ca-13d1cb80b4a2', '2026-06-11 16:57:46', 'Ngân Trần Nguyễn Thu', 'Hồ Chí Minh', 'Quan 1', 'Thủ Đức', '123 đường 17', 0);
INSERT INTO `deliveryinformation` VALUES (61, NULL, '123456789', NULL, 'false', '05f9e130-8712-484c-971e-0670a837f6ca', '2026-06-11 18:21:52', 'A', 'Hồ Chí Minh', 'Quan 1', 'Thủ Đức', '123 đường 17', 0);
INSERT INTO `deliveryinformation` VALUES (62, NULL, '0987654321', NULL, 'false', '048ee526-036f-4cc2-a95c-4ac64f5c8204', '2026-06-12 14:43:32', 'Trần Thị Thu Ngân', 'Hồ Chí Minh', 'Quan 1', 'Thủ Đức', '123 Nguyen Hue', 0);
INSERT INTO `deliveryinformation` VALUES (63, NULL, '0862162324', NULL, 'false', '20d428c7-bc91-49de-b321-17d40dae8a68', '2026-06-15 17:10:46', 'Vu Tien', 'Hồ Chí Minh', 'Quan 1', 'Thủ Đức', '123 đường 17', 0);
INSERT INTO `deliveryinformation` VALUES (64, NULL, '0862162324', NULL, 'false', '20d428c7-bc91-49de-b321-17d40dae8a68', '2026-06-15 17:34:29', 'Vu Tien', 'Hồ Chí Minh', 'Quan 1', 'Thủ Đức', '123 đường 17', 0);
INSERT INTO `deliveryinformation` VALUES (65, NULL, '0862162324', NULL, 'false', '20d428c7-bc91-49de-b321-17d40dae8a68', '2026-06-15 18:27:44', 'Vu Tien', 'Hồ Chí Minh', 'Quan 1', 'Thủ Đức', '123 đường 17', 0);
INSERT INTO `deliveryinformation` VALUES (66, NULL, '0862162324', NULL, 'false', '20d428c7-bc91-49de-b321-17d40dae8a68', '2026-06-15 18:35:54', 'Vu Tien', 'Hồ Chí Minh', 'Quan 1', 'Thủ Đức', '123 đường 17', 0);
INSERT INTO `deliveryinformation` VALUES (67, NULL, '0862162324', NULL, 'false', '20d428c7-bc91-49de-b321-17d40dae8a68', '2026-06-15 18:41:33', 'Vu Tien', 'Hồ Chí Minh', 'Quan 1', 'Thủ Đức', '123 đường 17', 0);
INSERT INTO `deliveryinformation` VALUES (68, NULL, '0862162324', NULL, 'false', '20d428c7-bc91-49de-b321-17d40dae8a68', '2026-06-15 18:47:22', 'Vu Tien', 'Hồ Chí Minh', 'Quan 1', 'Thủ Đức', '123 đường 17', 0);
INSERT INTO `deliveryinformation` VALUES (69, NULL, '0862162324', NULL, 'false', '20d428c7-bc91-49de-b321-17d40dae8a68', '2026-06-16 16:00:06', 'Vu Tien', 'Hồ Chí Minh', 'Quan 1', 'Thủ Đức', '123 đường 17', 0);
INSERT INTO `deliveryinformation` VALUES (70, NULL, '0862162324', NULL, 'false', '20d428c7-bc91-49de-b321-17d40dae8a68', '2026-06-16 16:06:05', 'Vu Tien', 'Hồ Chí Minh', 'Quan 1', 'Thủ Đức', '123 đường 17', 0);
INSERT INTO `deliveryinformation` VALUES (71, NULL, '0862162324', NULL, 'false', '20d428c7-bc91-49de-b321-17d40dae8a68', '2026-06-16 16:19:17', 'Vu Tien', 'Hồ Chí Minh', 'Quan 1', 'Thủ Đức', '123 đường 17', 0);
INSERT INTO `deliveryinformation` VALUES (72, NULL, '0862162324', NULL, 'false', '20d428c7-bc91-49de-b321-17d40dae8a68', '2026-06-16 16:27:47', 'Vu Tien', 'Hồ Chí Minh', 'Quan 1', 'Thủ Đức', '123 đường 17', 0);
INSERT INTO `deliveryinformation` VALUES (73, NULL, '0862162324', NULL, 'false', '20d428c7-bc91-49de-b321-17d40dae8a68', '2026-06-16 16:32:32', 'Vu Tien', 'Hồ Chí Minh', 'Quan 1', 'Thủ Đức', '123 đường 17', 0);
INSERT INTO `deliveryinformation` VALUES (74, NULL, '0862162324', NULL, 'false', '20d428c7-bc91-49de-b321-17d40dae8a68', '2026-06-16 16:42:20', 'Vu Tien', 'Hồ Chí Minh', 'Quan 1', 'Thủ Đức', '123 đường 17', 0);
INSERT INTO `deliveryinformation` VALUES (75, NULL, '0862162324', NULL, 'false', '20d428c7-bc91-49de-b321-17d40dae8a68', '2026-06-16 16:47:10', 'Vu Tien', 'Hồ Chí Minh', 'Quan 1', 'Thủ Đức', '123 đường 17', 0);
INSERT INTO `deliveryinformation` VALUES (76, NULL, '0862162324', NULL, 'false', '20d428c7-bc91-49de-b321-17d40dae8a68', '2026-06-16 17:01:20', 'Vu Tien', 'Hồ Chí Minh', 'Quan 1', 'Thủ Đức', '123 đường 17', 0);
INSERT INTO `deliveryinformation` VALUES (77, NULL, '0862162324', NULL, 'false', '20d428c7-bc91-49de-b321-17d40dae8a68', '2026-06-16 17:08:33', 'Vu Tien', 'Hồ Chí Minh', 'Quan 1', 'Thủ Đức', '123 đường 17', 0);
INSERT INTO `deliveryinformation` VALUES (78, NULL, '0862162324', NULL, 'false', '20d428c7-bc91-49de-b321-17d40dae8a68', '2026-06-16 20:13:27', 'Vu Tien', 'Hồ Chí Minh', 'Quan 1', 'Thủ Đức', '123 đường 17', 0);
INSERT INTO `deliveryinformation` VALUES (79, NULL, '0862162324', NULL, 'false', 'c41636a7-61fe-4f6f-9456-ae1d99550945', '2026-06-16 20:21:08', 'Võ Thu', 'Hồ Chí Minh', 'Quan 1', 'Thủ Đức', '123 đường 17', 0);
INSERT INTO `deliveryinformation` VALUES (80, NULL, '0862162324', NULL, 'false', 'c41636a7-61fe-4f6f-9456-ae1d99550945', '2026-06-16 20:39:06', 'Võ Thu', 'Hồ Chí Minh', 'Quan 1', 'Thủ Đức', '123 đường 17', 0);
INSERT INTO `deliveryinformation` VALUES (81, NULL, '0862162324', NULL, 'false', 'c41636a7-61fe-4f6f-9456-ae1d99550945', '2026-06-16 20:39:32', 'Võ Thu', 'Hồ Chí Minh', 'Quan 1', 'Thủ Đức', '123 đường 17', 0);
INSERT INTO `deliveryinformation` VALUES (82, NULL, '0862162324', NULL, 'false', '20d428c7-bc91-49de-b321-17d40dae8a68', '2026-06-16 21:37:38', 'Vu Tien', 'Hồ Chí Minh', 'Quan 1', 'Thủ Đức', '123 đường 17', 0);
INSERT INTO `deliveryinformation` VALUES (83, NULL, '0862162324', NULL, 'false', '20d428c7-bc91-49de-b321-17d40dae8a68', '2026-06-16 21:43:27', 'Vu Tien', 'Hồ Chí Minh', 'Quan 1', 'Thủ Đức', '123 đường 17', 0);
INSERT INTO `deliveryinformation` VALUES (84, NULL, '0862162324', NULL, 'false', '20d428c7-bc91-49de-b321-17d40dae8a68', '2026-06-16 21:56:18', 'Vu Tien', 'Hồ Chí Minh', 'Quan 1', 'Thủ Đức', '123 đường 17', 0);
INSERT INTO `deliveryinformation` VALUES (85, NULL, '0862162324', NULL, 'false', '20d428c7-bc91-49de-b321-17d40dae8a68', '2026-06-16 22:11:22', 'Vu Tien', 'Hồ Chí Minh', 'Quan 1', 'Thủ Đức', '123 đường 17', 0);
INSERT INTO `deliveryinformation` VALUES (86, NULL, '0862162324', NULL, 'false', '20d428c7-bc91-49de-b321-17d40dae8a68', '2026-06-16 22:33:06', 'Vu Tien', 'Hồ Chí Minh', 'Quan 1', 'Thủ Đức', '123 đường 17', 0);
INSERT INTO `deliveryinformation` VALUES (87, NULL, '0862162324', NULL, 'false', '20d428c7-bc91-49de-b321-17d40dae8a68', '2026-06-16 22:40:51', 'Vu Tien', 'Hồ Chí Minh', 'Quan 1', 'Thủ Đức', '123 đường 17', 0);
INSERT INTO `deliveryinformation` VALUES (88, NULL, '0862162324', NULL, 'false', '20d428c7-bc91-49de-b321-17d40dae8a68', '2026-06-17 21:09:10', 'Vu Tien', 'Hồ Chí Minh', 'Quan 1', 'Thủ Đức', '123 đường 17', 0);
INSERT INTO `deliveryinformation` VALUES (89, NULL, '0862162324', NULL, 'false', '20d428c7-bc91-49de-b321-17d40dae8a68', '2026-06-18 14:43:49', 'Vu Tien', 'Hồ Chí Minh', 'Quan 1', 'Thủ Đức', '123 đường 17', 0);
INSERT INTO `deliveryinformation` VALUES (90, NULL, '0862162324', NULL, 'false', '20d428c7-bc91-49de-b321-17d40dae8a68', '2026-06-19 00:19:22', 'Vu Tien', 'Hồ Chí Minh', 'Quan 1', 'Thủ Đức', '123 đường 17', 0);
INSERT INTO `deliveryinformation` VALUES (91, NULL, '0862162324', NULL, 'false', '20d428c7-bc91-49de-b321-17d40dae8a68', '2026-06-19 00:27:57', 'Vu Tien', 'Hồ Chí Minh', 'Quan 1', 'Thủ Đức', '123 đường 17', 0);
INSERT INTO `deliveryinformation` VALUES (92, NULL, '0862162324', NULL, 'false', '20d428c7-bc91-49de-b321-17d40dae8a68', '2026-06-19 00:36:57', 'Vu Tien', 'Hồ Chí Minh', 'Quan 1', 'Thủ Đức', '123 đường 17', 0);
INSERT INTO `deliveryinformation` VALUES (93, NULL, '0862162324', NULL, 'false', '20d428c7-bc91-49de-b321-17d40dae8a68', '2026-06-19 09:53:53', 'Vu Tien', 'Hồ Chí Minh', 'Quan 1', 'Thủ Đức', '123 đường 17', 0);
INSERT INTO `deliveryinformation` VALUES (94, NULL, '0862162324', NULL, 'false', '20d428c7-bc91-49de-b321-17d40dae8a68', '2026-06-24 20:43:10', 'Vu Tien', 'Hồ Chí Minh', 'Quan 1', 'Thủ Đức', '123 Nguyen Hue', 0);
INSERT INTO `deliveryinformation` VALUES (95, NULL, '0862162324', NULL, 'false', '20d428c7-bc91-49de-b321-17d40dae8a68', '2026-06-24 20:53:33', 'Vu Tien', 'Hồ Chí Minh', 'Quan 1', 'Thủ Đức', '123 đường 17', 0);
INSERT INTO `deliveryinformation` VALUES (96, NULL, '0862162324', NULL, 'false', '20d428c7-bc91-49de-b321-17d40dae8a68', '2026-06-24 21:04:04', 'Vu Tien', 'Hồ Chí Minh', 'THủ Đức', 'Linh Xuân', '111 An Bình', 0);
INSERT INTO `deliveryinformation` VALUES (97, NULL, '123456789', NULL, 'false', '20d428c7-bc91-49de-b321-17d40dae8a68', '2026-06-24 21:07:54', 'Vu Tien', 'Hồ Chí Minh', 'THủ Đức', 'Thu Duc', '123 đường 17', 0);
INSERT INTO `deliveryinformation` VALUES (98, NULL, '0862162324', NULL, 'false', '20d428c7-bc91-49de-b321-17d40dae8a68', '2026-06-24 21:14:06', 'Vu Tien', 'Hồ Chí Minh', 'Quan 1', 'Thu Duc', '123 đường 17', 0);
INSERT INTO `deliveryinformation` VALUES (99, NULL, '0862162324', NULL, 'false', '20d428c7-bc91-49de-b321-17d40dae8a68', '2026-06-24 21:32:58', 'Vu Tien', 'Hồ Chí Minh', 'Quan 1', 'Thủ Đức', '123 Nguyen Hue', 0);
INSERT INTO `deliveryinformation` VALUES (100, NULL, '0862162324', NULL, 'false', '20d428c7-bc91-49de-b321-17d40dae8a68', '2026-06-24 21:38:09', 'Vu Tien', 'Hồ Chí Minh', 'Quan 1', 'Thủ Đức', '123 Nguyen Hue', 0);
INSERT INTO `deliveryinformation` VALUES (101, NULL, '0862162324', NULL, 'false', '9ae5e6ec-3d7b-452b-ac1a-ea01c1d05b31', '2026-06-24 22:00:04', 'Trần Ngọc An Nhiên', 'Hồ Chí Minh', 'Quan 1', 'Thủ Đức', '123 Nguyen Hue', 0);
INSERT INTO `deliveryinformation` VALUES (102, NULL, '0862162324', NULL, 'false', '9ae5e6ec-3d7b-452b-ac1a-ea01c1d05b31', '2026-06-25 15:38:37', 'Trần Ngọc An Nhiên', 'Hồ Chí Minh', 'Quan 1', 'Thủ Đức', '123 Nguyen Hue', 0);
INSERT INTO `deliveryinformation` VALUES (103, NULL, '0862162324', NULL, 'false', '9ae5e6ec-3d7b-452b-ac1a-ea01c1d05b31', '2026-06-25 15:44:53', 'Trần Ngọc An Nhiên', 'Hồ Chí Minh', 'Quan 1', 'Thủ Đức', '123 Nguyen Hue', 0);
INSERT INTO `deliveryinformation` VALUES (104, NULL, '0862162324', NULL, 'false', '20d428c7-bc91-49de-b321-17d40dae8a68', '2026-07-09 16:16:09', 'Vu Tien', 'Hồ Chí Minh', 'Thủ Đức', 'Linh Chiểu', 'đường 17', 0);
INSERT INTO `deliveryinformation` VALUES (105, NULL, '0862162324', NULL, 'false', 'c41636a7-61fe-4f6f-9456-ae1d99550945', '2026-07-11 11:45:14', 'Võ Thu', 'Hồ Chí Minh', 'Thủ Đức', 'Linh Chiểu', 'đường 17', 0);
INSERT INTO `deliveryinformation` VALUES (106, NULL, '0987654321', NULL, 'false', '35ab910f-0158-4869-8d2d-d07a2e627991', '2026-07-11 14:49:49', 'Pika', 'Hồ Chí Minh', 'Thủ Đức', 'Linh Chiểu', 'đường 17', 0);
INSERT INTO `deliveryinformation` VALUES (107, NULL, '0987654321', NULL, 'false', '35ab910f-0158-4869-8d2d-d07a2e627991', '2026-07-11 14:50:32', 'Pika', 'Hồ Chí Minh', 'Thủ Đức', 'Linh Chiểu', 'đường 17', 0);
INSERT INTO `deliveryinformation` VALUES (108, NULL, '0987654321', NULL, 'false', '35ab910f-0158-4869-8d2d-d07a2e627991', '2026-07-11 14:51:04', 'Pika', 'Hồ Chí Minh', 'Thủ Đức', 'Linh Chiểu', 'đường 17', 0);
INSERT INTO `deliveryinformation` VALUES (109, NULL, '0987654321', NULL, 'false', '35ab910f-0158-4869-8d2d-d07a2e627991', '2026-07-11 14:52:27', 'Pika', 'Hồ Chí Minh', 'Thủ Đức', 'Linh Chiểu', 'đường 17', 0);
INSERT INTO `deliveryinformation` VALUES (110, NULL, '0862162324', NULL, 'false', '20d428c7-bc91-49de-b321-17d40dae8a68', '2026-07-12 23:46:18', 'Vu Tien', 'Hồ Chí Minh', 'Thủ Đức', 'Linh Chiểu', '123 đường 17', 0);

-- ----------------------------
-- Table structure for order
-- ----------------------------
DROP TABLE IF EXISTS `order`;
CREATE TABLE `order`  (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_id` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `store_id` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `total` float NOT NULL DEFAULT 0,
  `discount` float NOT NULL DEFAULT 0,
  `pay` float NOT NULL DEFAULT 0,
  `voucher_id` int NULL DEFAULT NULL,
  `delivery_information_id` int NOT NULL,
  `status` char(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL DEFAULT 'pending' COMMENT 'pending | confirmed | shipping | done | cancelled',
  `update_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE CURRENT_TIMESTAMP,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `payment_method` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL,
  `payment_status` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL,
  `shop_discount` float NOT NULL,
  `shop_voucher_id` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL,
  `livestream_room_id` bigint NULL DEFAULT NULL,
  `shipping_fee` float NOT NULL,
  PRIMARY KEY (`id`) USING BTREE,
  INDEX `idx_order_user`(`user_id` ASC) USING BTREE,
  INDEX `idx_order_store`(`store_id` ASC) USING BTREE,
  INDEX `idx_order_status`(`status` ASC) USING BTREE,
  INDEX `fk_order_voucher`(`voucher_id` ASC) USING BTREE,
  INDEX `fk_order_delivery`(`delivery_information_id` ASC) USING BTREE,
  CONSTRAINT `fk_order_delivery` FOREIGN KEY (`delivery_information_id`) REFERENCES `deliveryinformation` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT `fk_order_voucher` FOREIGN KEY (`voucher_id`) REFERENCES `voucher` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE = InnoDB AUTO_INCREMENT = 111 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_general_ci COMMENT = 'Bảng trung tâm lưu thông tin đơn hàng' ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of order
-- ----------------------------
INSERT INTO `order` VALUES (1, '1', '1', 500000, 0, 500000, NULL, 1, 'done', '2026-05-01 19:53:00', '2026-05-01 19:53:00', NULL, NULL, 0, NULL, NULL, 0);
INSERT INTO `order` VALUES (2, 'eb7d2c41-3f5a-4b82-a1d9-7c3e8f910b2d', 'store_001', 179000, 0, 179000, NULL, 2, 'pending', '2026-05-11 10:00:47', '2026-05-11 10:00:47', 'COD', 'pending', 0, NULL, NULL, 0);
INSERT INTO `order` VALUES (3, 'anonymousUser', 'store_001', 179000, 0, 179000, NULL, 3, 'pending', '2026-05-12 12:09:34', '2026-05-12 12:09:34', 'COD', 'pending', 0, NULL, NULL, 0);
INSERT INTO `order` VALUES (4, 'anonymousUser', 'store_001', 179000, 0, 179000, NULL, 4, 'pending', '2026-05-12 12:25:27', '2026-05-12 12:25:27', 'VNPAY', 'pending', 0, NULL, NULL, 0);
INSERT INTO `order` VALUES (5, 'anonymousUser', 'store_001', 179000, 0, 179000, NULL, 5, 'pending', '2026-05-12 12:26:01', '2026-05-12 12:26:01', 'VNPAY', 'pending', 0, NULL, NULL, 0);
INSERT INTO `order` VALUES (6, 'anonymousUser', 'store_001', 179000, 0, 179000, NULL, 6, 'pending', '2026-05-12 12:29:00', '2026-05-12 12:29:00', 'VNPAY', 'pending', 0, NULL, NULL, 0);
INSERT INTO `order` VALUES (7, 'anonymousUser', 'store_001', 179000, 0, 179000, NULL, 7, 'pending', '2026-05-12 12:29:02', '2026-05-12 12:29:02', 'VNPAY', 'pending', 0, NULL, NULL, 0);
INSERT INTO `order` VALUES (8, 'anonymousUser', 'store_001', 179000, 0, 179000, NULL, 8, 'pending', '2026-05-12 12:52:21', '2026-05-12 12:52:21', 'VNPAY', 'pending', 0, NULL, NULL, 0);
INSERT INTO `order` VALUES (9, 'anonymousUser', 'store_001', 179000, 0, 179000, NULL, 9, 'pending', '2026-05-12 13:10:50', '2026-05-12 13:10:50', 'VNPAY', 'pending', 0, NULL, NULL, 0);
INSERT INTO `order` VALUES (10, 'anonymousUser', 'store_001', 320000, 0, 320000, NULL, 10, 'pending', '2026-05-12 13:15:47', '2026-05-12 13:15:47', 'VNPAY', 'pending', 0, NULL, NULL, 0);
INSERT INTO `order` VALUES (11, 'anonymousUser', 'store_001', 320000, 0, 320000, NULL, 11, 'pending', '2026-05-12 13:18:49', '2026-05-12 13:18:49', 'VNPAY', 'pending', 0, NULL, NULL, 0);
INSERT INTO `order` VALUES (12, 'anonymousUser', 'store_002', 329000, 0, 329000, NULL, 12, 'pending', '2026-05-12 13:19:27', '2026-05-12 13:19:27', 'VNPAY', 'pending', 0, NULL, NULL, 0);
INSERT INTO `order` VALUES (13, 'anonymousUser', 'store_001', 289000, 0, 289000, NULL, 13, 'pending', '2026-05-12 13:21:32', '2026-05-12 13:21:32', 'VNPAY', 'pending', 0, NULL, NULL, 0);
INSERT INTO `order` VALUES (14, 'anonymousUser', 'store_001', 289000, 0, 289000, NULL, 14, 'pending', '2026-05-12 13:25:17', '2026-05-12 13:25:17', 'VNPAY', 'pending', 0, NULL, NULL, 0);
INSERT INTO `order` VALUES (15, 'anonymousUser', 'store_001', 289000, 0, 289000, NULL, 15, 'pending', '2026-05-12 13:26:07', '2026-05-12 13:26:07', 'VNPAY', 'pending', 0, NULL, NULL, 0);
INSERT INTO `order` VALUES (16, 'anonymousUser', 'store_001', 289000, 0, 289000, NULL, 16, 'pending', '2026-05-12 14:02:57', '2026-05-12 14:02:57', 'VNPAY', 'pending', 0, NULL, NULL, 0);
INSERT INTO `order` VALUES (17, 'anonymousUser', 'store_001', 179000, 0, 179000, NULL, 17, 'pending', '2026-05-12 14:07:54', '2026-05-12 14:07:54', 'VNPAY', 'pending', 0, NULL, NULL, 0);
INSERT INTO `order` VALUES (18, 'anonymousUser', 'store_001', 320000, 0, 320000, NULL, 18, 'pending', '2026-05-12 14:20:23', '2026-05-12 14:20:23', 'VNPAY', 'pending', 0, NULL, NULL, 0);
INSERT INTO `order` VALUES (19, 'anonymousUser', 'store_001', 320000, 0, 320000, NULL, 19, 'pending', '2026-05-12 14:40:47', '2026-05-12 14:40:47', 'VNPAY', 'pending', 0, NULL, NULL, 0);
INSERT INTO `order` VALUES (20, 'anonymousUser', 'store_001', 320000, 0, 320000, NULL, 20, 'pending', '2026-05-12 14:40:54', '2026-05-12 14:40:54', 'VNPAY', 'pending', 0, NULL, NULL, 0);
INSERT INTO `order` VALUES (21, 'anonymousUser', 'store_001', 320000, 0, 320000, NULL, 21, 'pending', '2026-05-12 14:40:55', '2026-05-12 14:40:55', 'VNPAY', 'pending', 0, NULL, NULL, 0);
INSERT INTO `order` VALUES (22, 'eb7d2c41-3f5a-4b82-a1d9-7c3e8f910b2d', 'store_001', 179000, 0, 179000, NULL, 22, 'pending', '2026-05-12 15:12:56', '2026-05-12 15:12:56', 'VNPAY_WALLET', 'pending', 0, NULL, NULL, 0);
INSERT INTO `order` VALUES (23, 'eb7d2c41-3f5a-4b82-a1d9-7c3e8f910b2d', 'store_001', 320000, 0, 320000, NULL, 23, 'pending', '2026-05-12 15:16:56', '2026-05-12 15:16:56', 'VNPAY_WALLET', 'pending', 0, NULL, NULL, 0);
INSERT INTO `order` VALUES (24, 'eb7d2c41-3f5a-4b82-a1d9-7c3e8f910b2d', 'store_001', 179000, 0, 179000, NULL, 24, 'pending', '2026-05-12 15:28:10', '2026-05-12 15:28:10', 'VNPAY_WALLET', 'pending', 0, NULL, NULL, 0);
INSERT INTO `order` VALUES (25, '882b4b5a-3e56-4208-986c-98bc2186ab3b', 'store_001', 179000, 0, 179000, NULL, 25, 'pending', '2026-05-12 23:14:08', '2026-05-12 23:14:08', 'COD', 'pending', 0, NULL, NULL, 0);
INSERT INTO `order` VALUES (26, '882b4b5a-3e56-4208-986c-98bc2186ab3b', 'store_001', 179000, 0, 179000, NULL, 26, 'pending', '2026-05-12 23:14:29', '2026-05-12 23:14:29', 'VNPAY', 'pending', 0, NULL, NULL, 0);
INSERT INTO `order` VALUES (27, '882b4b5a-3e56-4208-986c-98bc2186ab3b', 'store_001', 320000, 0, 320000, NULL, 27, 'pending', '2026-05-12 23:21:45', '2026-05-12 23:21:45', 'VNPAY', 'pending', 0, NULL, NULL, 0);
INSERT INTO `order` VALUES (28, '882b4b5a-3e56-4208-986c-98bc2186ab3b', 'store_001', 320000, 0, 320000, NULL, 28, 'pending', '2026-05-13 00:00:59', '2026-05-13 00:00:59', 'VNPAY', 'pending', 0, NULL, NULL, 0);
INSERT INTO `order` VALUES (29, '882b4b5a-3e56-4208-986c-98bc2186ab3b', 'store_001', 320000, 0, 320000, NULL, 29, 'pending', '2026-05-13 00:15:16', '2026-05-13 00:15:16', 'VNPAY', 'pending', 0, NULL, NULL, 0);
INSERT INTO `order` VALUES (30, '882b4b5a-3e56-4208-986c-98bc2186ab3b', 'store_001', 320000, 0, 320000, NULL, 30, 'pending', '2026-05-13 11:32:14', '2026-05-13 11:32:14', 'COD', 'pending', 0, NULL, NULL, 0);
INSERT INTO `order` VALUES (31, '9ae5e6ec-3d7b-452b-ac1a-ea01c1d05b31', 'store_001', 179000, 0, 179000, NULL, 31, 'cancelled', '2026-05-15 08:42:23', '2026-05-14 12:48:45', 'VNPAY', 'pending', 0, NULL, NULL, 0);
INSERT INTO `order` VALUES (32, '9ae5e6ec-3d7b-452b-ac1a-ea01c1d05b31', 'store_001', 289000, 0, 289000, NULL, 32, 'pending', '2026-06-11 14:19:47', '2026-05-15 08:28:08', 'COD', 'pending', 0, NULL, NULL, 0);
INSERT INTO `order` VALUES (33, '9ae5e6ec-3d7b-452b-ac1a-ea01c1d05b31', 'store_002', 129000, 0, 129000, NULL, 33, 'pending', '2026-06-11 14:19:48', '2026-05-20 10:49:14', 'COD', 'pending', 0, NULL, NULL, 0);
INSERT INTO `order` VALUES (34, '9ae5e6ec-3d7b-452b-ac1a-ea01c1d05b31', 'store_001', 499000, 0, 499000, NULL, 34, 'pending', '2026-06-11 14:19:49', '2026-05-20 11:17:01', 'COD', 'pending', 0, NULL, NULL, 0);
INSERT INTO `order` VALUES (35, '9ae5e6ec-3d7b-452b-ac1a-ea01c1d05b31', 'store_003', 420000, 0, 420000, NULL, 35, 'pending', '2026-06-11 14:19:50', '2026-05-20 11:23:29', 'COD', 'pending', 0, NULL, NULL, 0);
INSERT INTO `order` VALUES (36, '9ae5e6ec-3d7b-452b-ac1a-ea01c1d05b31', 'store_005', 199000, 0, 199000, NULL, 36, 'pending', '2026-06-11 14:19:51', '2026-05-20 15:23:45', 'COD', 'pending', 0, NULL, NULL, 0);
INSERT INTO `order` VALUES (37, '9ae5e6ec-3d7b-452b-ac1a-ea01c1d05b31', 'store_005', 199000, 0, 199000, NULL, 37, 'pending', '2026-06-11 14:19:52', '2026-05-20 15:49:56', 'COD', 'pending', 0, NULL, NULL, 0);
INSERT INTO `order` VALUES (38, '9ae5e6ec-3d7b-452b-ac1a-ea01c1d05b31', 'store_006', 129000, 0, 129000, NULL, 38, 'pending', '2026-06-11 14:19:52', '2026-05-20 16:20:17', 'COD', 'pending', 0, NULL, NULL, 0);
INSERT INTO `order` VALUES (39, '9ae5e6ec-3d7b-452b-ac1a-ea01c1d05b31', 'store_003', 490000, 0, 490000, NULL, 39, 'pending', '2026-06-11 14:19:53', '2026-05-20 16:57:52', 'COD', 'pending', 0, NULL, NULL, 0);
INSERT INTO `order` VALUES (40, '9ae5e6ec-3d7b-452b-ac1a-ea01c1d05b31', 'store_001', 179000, 0, 179000, NULL, 40, 'pending', '2026-06-11 14:19:55', '2026-05-20 17:44:47', 'COD', 'pending', 0, NULL, NULL, 0);
INSERT INTO `order` VALUES (41, '9ae5e6ec-3d7b-452b-ac1a-ea01c1d05b31', 'store_001', 320000, 0, 320000, NULL, 41, 'pending', '2026-06-11 14:19:56', '2026-05-20 17:51:59', 'COD', 'pending', 0, NULL, NULL, 0);
INSERT INTO `order` VALUES (42, 'c41636a7-61fe-4f6f-9456-ae1d99550945', 'bd24206e-d42f-4736-9106-16dca8c687e9', 605500, 0, 605500, NULL, 42, 'cancelled', '2026-06-16 16:28:39', '2026-05-27 17:52:49', 'COD', 'pending', 0, NULL, NULL, 0);
INSERT INTO `order` VALUES (43, 'c41636a7-61fe-4f6f-9456-ae1d99550945', 'bd24206e-d42f-4736-9106-16dca8c687e9', 123000, 0, 123000, NULL, 43, 'completed', '2026-07-11 11:48:56', '2026-06-04 15:08:22', 'COD', 'paid', 0, NULL, NULL, 0);
INSERT INTO `order` VALUES (44, '048ee526-036f-4cc2-a95c-4ac64f5c8204', 'bd24206e-d42f-4736-9106-16dca8c687e9', 3936250, 20000, 3916250, NULL, 44, 'cancelled', '2026-06-23 17:35:55', '2026-06-08 17:35:50', 'COD', 'pending', 20000, 'b4cfb49a-49cb-46bc-bfc0-d76853c69b08', NULL, 0);
INSERT INTO `order` VALUES (45, '048ee526-036f-4cc2-a95c-4ac64f5c8204', 'bd24206e-d42f-4736-9106-16dca8c687e9', 1117000, 0, 1117000, NULL, 45, 'pending', '2026-06-11 14:20:02', '2026-06-08 18:14:35', 'VNPAY', 'pending', 0, NULL, NULL, 0);
INSERT INTO `order` VALUES (46, '048ee526-036f-4cc2-a95c-4ac64f5c8204', 'bd24206e-d42f-4736-9106-16dca8c687e9', 888750, 0, 888750, NULL, 46, 'pending', '2026-06-11 14:20:01', '2026-06-08 18:17:37', 'COD', 'pending', 0, NULL, NULL, 0);
INSERT INTO `order` VALUES (47, '9ae5e6ec-3d7b-452b-ac1a-ea01c1d05b31', 'bd24206e-d42f-4736-9106-16dca8c687e9', 123000, 0, 123000, NULL, 47, 'pending', '2026-06-11 14:20:01', '2026-06-09 22:38:32', 'COD', 'pending', 0, NULL, NULL, 0);
INSERT INTO `order` VALUES (48, '048ee526-036f-4cc2-a95c-4ac64f5c8204', 'bd24206e-d42f-4736-9106-16dca8c687e9', 768500, 20000, 748500, NULL, 48, 'pending', '2026-06-11 14:20:03', '2026-06-10 17:28:27', 'COD', 'pending', 20000, 'c2415bd2-9eaa-4e1f-8ff5-ee1ca51a589a', NULL, 0);
INSERT INTO `order` VALUES (49, '048ee526-036f-4cc2-a95c-4ac64f5c8204', 'bd24206e-d42f-4736-9106-16dca8c687e9', 604750, 0, 604750, NULL, 49, 'pending', '2026-06-11 14:20:06', '2026-06-10 21:58:00', 'COD', 'pending', 0, NULL, NULL, 0);
INSERT INTO `order` VALUES (50, '048ee526-036f-4cc2-a95c-4ac64f5c8204', 'bd24206e-d42f-4736-9106-16dca8c687e9', 888750, 0, 888750, NULL, 50, 'pending', '2026-06-11 14:20:05', '2026-06-11 12:16:21', 'COD', 'pending', 0, NULL, NULL, 0);
INSERT INTO `order` VALUES (51, '048ee526-036f-4cc2-a95c-4ac64f5c8204', 'bd24206e-d42f-4736-9106-16dca8c687e9', 1275500, 0, 1275500, NULL, 51, 'pending', '2026-06-11 14:20:04', '2026-06-11 12:29:43', 'COD', 'pending', 0, NULL, NULL, 0);
INSERT INTO `order` VALUES (52, '048ee526-036f-4cc2-a95c-4ac64f5c8204', 'bd24206e-d42f-4736-9106-16dca8c687e9', 255750, 0, 255750, NULL, 52, 'pending', '2026-06-11 14:20:08', '2026-06-11 12:43:54', 'COD', 'pending', 0, NULL, NULL, 0);
INSERT INTO `order` VALUES (53, '048ee526-036f-4cc2-a95c-4ac64f5c8204', 'bd24206e-d42f-4736-9106-16dca8c687e9', 5023750, 0, 5023750, NULL, 53, 'pending', '2026-06-11 14:20:08', '2026-06-11 12:52:32', 'COD', 'pending', 0, NULL, NULL, 0);
INSERT INTO `order` VALUES (54, '048ee526-036f-4cc2-a95c-4ac64f5c8204', 'bd24206e-d42f-4736-9106-16dca8c687e9', 120000, 0, 120000, NULL, 54, 'pending', '2026-06-11 14:20:07', '2026-06-11 13:52:08', 'COD', 'pending', 0, NULL, NULL, 0);
INSERT INTO `order` VALUES (55, '048ee526-036f-4cc2-a95c-4ac64f5c8204', 'bd24206e-d42f-4736-9106-16dca8c687e9', 100000, 0, 100000, NULL, 55, 'completed', '2026-06-11 15:16:59', '2026-06-11 15:13:42', 'COD', 'paid', 0, NULL, NULL, 0);
INSERT INTO `order` VALUES (56, '048ee526-036f-4cc2-a95c-4ac64f5c8204', 'bd24206e-d42f-4736-9106-16dca8c687e9', 690250, 0, 690250, NULL, 56, 'completed', '2026-06-11 15:24:29', '2026-06-11 15:21:08', 'COD', 'paid', 0, NULL, NULL, 0);
INSERT INTO `order` VALUES (57, '048ee526-036f-4cc2-a95c-4ac64f5c8204', 'bd24206e-d42f-4736-9106-16dca8c687e9', 120000, 20000, 100000, NULL, 57, 'pending', '2026-06-11 16:39:23', '2026-06-11 16:39:23', 'VNPAY', 'pending', 20000, 'c2415bd2-9eaa-4e1f-8ff5-ee1ca51a589a', NULL, 0);
INSERT INTO `order` VALUES (58, '45841b96-6a49-4879-b4ca-13d1cb80b4a2', 'bd24206e-d42f-4736-9106-16dca8c687e9', 123000, 20000, 103000, NULL, 58, 'completed', '2026-06-12 15:12:07', '2026-06-11 16:40:44', 'VNPAY', 'paid', 20000, 'b4cfb49a-49cb-46bc-bfc0-d76853c69b08', NULL, 0);
INSERT INTO `order` VALUES (59, '45841b96-6a49-4879-b4ca-13d1cb80b4a2', 'bd24206e-d42f-4736-9106-16dca8c687e9', 123000, 20000, 103000, NULL, 59, 'completed', '2026-06-11 16:52:21', '2026-06-11 16:46:45', 'VNPAY', 'paid', 20000, 'c2415bd2-9eaa-4e1f-8ff5-ee1ca51a589a', NULL, 0);
INSERT INTO `order` VALUES (60, '45841b96-6a49-4879-b4ca-13d1cb80b4a2', 'bd24206e-d42f-4736-9106-16dca8c687e9', 1275500, 30000, 1245500, NULL, 60, 'confirmed', '2026-06-11 16:58:15', '2026-06-11 16:57:46', 'VNPAY', 'paid', 30000, 'ec6c3258-f0b7-4b85-ab18-442722cd6ebe', NULL, 0);
INSERT INTO `order` VALUES (61, '05f9e130-8712-484c-971e-0670a837f6ca', 'bd24206e-d42f-4736-9106-16dca8c687e9', 100000, 20000, 80000, NULL, 61, 'completed', '2026-06-12 14:59:07', '2026-06-11 18:21:52', 'VNPAY', 'paid', 20000, 'b4cfb49a-49cb-46bc-bfc0-d76853c69b08', NULL, 0);
INSERT INTO `order` VALUES (62, '048ee526-036f-4cc2-a95c-4ac64f5c8204', 'bd24206e-d42f-4736-9106-16dca8c687e9', 3936250, 20000, 3916250, NULL, 62, 'pending', '2026-06-12 14:43:32', '2026-06-12 14:43:32', 'COD', 'pending', 20000, 'b4cfb49a-49cb-46bc-bfc0-d76853c69b08', NULL, 0);
INSERT INTO `order` VALUES (63, '20d428c7-bc91-49de-b321-17d40dae8a68', 'bd24206e-d42f-4736-9106-16dca8c687e9', 888750, 0, 888750, NULL, 63, 'refunded', '2026-06-19 00:17:08', '2026-06-15 17:10:46', 'COD', 'paid', 0, NULL, NULL, 0);
INSERT INTO `order` VALUES (64, '20d428c7-bc91-49de-b321-17d40dae8a68', 'bd24206e-d42f-4736-9106-16dca8c687e9', 1297000, 0, 1297000, NULL, 64, 'completed', '2026-07-11 12:44:38', '2026-06-15 17:34:29', 'COD', 'paid', 0, NULL, NULL, 0);
INSERT INTO `order` VALUES (65, '20d428c7-bc91-49de-b321-17d40dae8a68', 'bd24206e-d42f-4736-9106-16dca8c687e9', 1222220, 0, 1222220, NULL, 65, 'refunded', '2026-07-11 12:39:49', '2026-06-15 18:27:44', 'COD', 'paid', 0, NULL, NULL, 0);
INSERT INTO `order` VALUES (66, '20d428c7-bc91-49de-b321-17d40dae8a68', 'bd24206e-d42f-4736-9106-16dca8c687e9', 3936250, 0, 3936250, NULL, 66, 'completed', '2026-06-15 18:38:50', '2026-06-15 18:35:54', 'COD', 'paid', 0, NULL, NULL, 0);
INSERT INTO `order` VALUES (67, '20d428c7-bc91-49de-b321-17d40dae8a68', 'bd24206e-d42f-4736-9106-16dca8c687e9', 7424000, 0, 7424000, NULL, 67, 'completed', '2026-06-15 18:44:17', '2026-06-15 18:41:33', 'COD', 'paid', 0, NULL, NULL, 0);
INSERT INTO `order` VALUES (68, '20d428c7-bc91-49de-b321-17d40dae8a68', 'bd24206e-d42f-4736-9106-16dca8c687e9', 100000, 0, 100000, NULL, 68, 'completed', '2026-06-15 18:50:05', '2026-06-15 18:47:22', 'COD', 'paid', 0, NULL, NULL, 0);
INSERT INTO `order` VALUES (69, '20d428c7-bc91-49de-b321-17d40dae8a68', 'bd24206e-d42f-4736-9106-16dca8c687e9', 120000, 0, 120000, NULL, 69, 'completed', '2026-06-16 16:04:02', '2026-06-16 16:00:06', 'COD', 'paid', 0, NULL, NULL, 0);
INSERT INTO `order` VALUES (70, '20d428c7-bc91-49de-b321-17d40dae8a68', 'bd24206e-d42f-4736-9106-16dca8c687e9', 123000, 0, 123000, NULL, 70, 'completed', '2026-07-11 12:44:44', '2026-06-16 16:06:05', 'COD', 'paid', 0, NULL, NULL, 0);
INSERT INTO `order` VALUES (71, '20d428c7-bc91-49de-b321-17d40dae8a68', 'bd24206e-d42f-4736-9106-16dca8c687e9', 876500, 0, 876500, NULL, 71, 'completed', '2026-06-16 16:22:00', '2026-06-16 16:19:17', 'COD', 'paid', 0, NULL, NULL, 0);
INSERT INTO `order` VALUES (72, '20d428c7-bc91-49de-b321-17d40dae8a68', 'bd24206e-d42f-4736-9106-16dca8c687e9', 604750, 20000, 584750, NULL, 72, 'completed', '2026-06-16 16:30:52', '2026-06-16 16:27:47', 'COD', 'paid', 20000, 'c2415bd2-9eaa-4e1f-8ff5-ee1ca51a589a', NULL, 0);
INSERT INTO `order` VALUES (73, '20d428c7-bc91-49de-b321-17d40dae8a68', 'bd24206e-d42f-4736-9106-16dca8c687e9', 571500, 0, 571500, NULL, 73, 'completed', '2026-06-16 16:35:22', '2026-06-16 16:32:32', 'COD', 'paid', 0, NULL, NULL, 0);
INSERT INTO `order` VALUES (74, '20d428c7-bc91-49de-b321-17d40dae8a68', 'bd24206e-d42f-4736-9106-16dca8c687e9', 3936250, 0, 3936250, NULL, 74, 'completed', '2026-06-16 16:45:16', '2026-06-16 16:42:20', 'COD', 'paid', 0, NULL, NULL, 0);
INSERT INTO `order` VALUES (75, '20d428c7-bc91-49de-b321-17d40dae8a68', 'bd24206e-d42f-4736-9106-16dca8c687e9', 888750, 0, 888750, NULL, 75, 'completed', '2026-06-16 16:50:17', '2026-06-16 16:47:10', 'COD', 'paid', 0, NULL, NULL, 0);
INSERT INTO `order` VALUES (76, '20d428c7-bc91-49de-b321-17d40dae8a68', 'bd24206e-d42f-4736-9106-16dca8c687e9', 1222220, 0, 1222220, NULL, 76, 'completed', '2026-06-16 17:05:11', '2026-06-16 17:01:20', 'COD', 'paid', 0, NULL, NULL, 0);
INSERT INTO `order` VALUES (77, '20d428c7-bc91-49de-b321-17d40dae8a68', 'bd24206e-d42f-4736-9106-16dca8c687e9', 1297000, 0, 1297000, NULL, 77, 'completed', '2026-06-16 17:11:19', '2026-06-16 17:08:33', 'COD', 'paid', 0, NULL, NULL, 0);
INSERT INTO `order` VALUES (78, '20d428c7-bc91-49de-b321-17d40dae8a68', 'bd24206e-d42f-4736-9106-16dca8c687e9', 1368000, 0, 1368000, NULL, 78, 'completed', '2026-06-16 20:16:30', '2026-06-16 20:13:27', 'COD', 'paid', 0, NULL, NULL, 0);
INSERT INTO `order` VALUES (79, 'c41636a7-61fe-4f6f-9456-ae1d99550945', 'bd24206e-d42f-4736-9106-16dca8c687e9', 1222220, 0, 1222220, NULL, 79, 'completed', '2026-06-16 20:23:31', '2026-06-16 20:21:08', 'COD', 'paid', 0, NULL, NULL, 0);
INSERT INTO `order` VALUES (80, 'c41636a7-61fe-4f6f-9456-ae1d99550945', 'bd24206e-d42f-4736-9106-16dca8c687e9', 3936250, 0, 3936250, NULL, 80, 'completed', '2026-06-16 20:42:01', '2026-06-16 20:39:06', 'COD', 'paid', 0, NULL, NULL, 0);
INSERT INTO `order` VALUES (81, 'c41636a7-61fe-4f6f-9456-ae1d99550945', 'bd24206e-d42f-4736-9106-16dca8c687e9', 1297000, 0, 1297000, NULL, 81, 'completed', '2026-06-16 20:42:31', '2026-06-16 20:39:32', 'COD', 'paid', 0, NULL, NULL, 0);
INSERT INTO `order` VALUES (82, '20d428c7-bc91-49de-b321-17d40dae8a68', 'bd24206e-d42f-4736-9106-16dca8c687e9', 1275500, 0, 1275500, NULL, 82, 'completed', '2026-06-16 21:40:38', '2026-06-16 21:37:38', 'COD', 'paid', 0, NULL, NULL, 0);
INSERT INTO `order` VALUES (83, '20d428c7-bc91-49de-b321-17d40dae8a68', 'bd24206e-d42f-4736-9106-16dca8c687e9', 1275500, 0, 1275500, NULL, 83, 'completed', '2026-06-16 21:46:38', '2026-06-16 21:43:27', 'COD', 'paid', 0, NULL, NULL, 0);
INSERT INTO `order` VALUES (84, '20d428c7-bc91-49de-b321-17d40dae8a68', 'bd24206e-d42f-4736-9106-16dca8c687e9', 120000, 0, 120000, NULL, 84, 'completed', '2026-06-16 21:59:09', '2026-06-16 21:56:18', 'COD', 'paid', 0, NULL, NULL, 0);
INSERT INTO `order` VALUES (85, '20d428c7-bc91-49de-b321-17d40dae8a68', 'bd24206e-d42f-4736-9106-16dca8c687e9', 3936250, 0, 3936250, NULL, 85, 'completed', '2026-06-16 22:14:18', '2026-06-16 22:11:22', 'COD', 'paid', 0, NULL, NULL, 0);
INSERT INTO `order` VALUES (86, '20d428c7-bc91-49de-b321-17d40dae8a68', 'bd24206e-d42f-4736-9106-16dca8c687e9', 120000, 0, 120000, NULL, 86, 'completed', '2026-06-16 22:35:49', '2026-06-16 22:33:06', 'COD', 'paid', 0, NULL, NULL, 0);
INSERT INTO `order` VALUES (87, '20d428c7-bc91-49de-b321-17d40dae8a68', 'bd24206e-d42f-4736-9106-16dca8c687e9', 100000, 0, 100000, NULL, 87, 'completed', '2026-06-19 00:18:06', '2026-06-16 22:40:51', 'COD', 'paid', 0, NULL, NULL, 0);
INSERT INTO `order` VALUES (88, '20d428c7-bc91-49de-b321-17d40dae8a68', 'bd24206e-d42f-4736-9106-16dca8c687e9', 100000, 0, 100000, NULL, 88, 'completed', '2026-06-17 21:16:46', '2026-06-17 21:09:10', 'COD', 'paid', 0, NULL, NULL, 0);
INSERT INTO `order` VALUES (89, '20d428c7-bc91-49de-b321-17d40dae8a68', 'bd24206e-d42f-4736-9106-16dca8c687e9', 1222220, 611110000, 0, NULL, 89, 'completed', '2026-06-19 00:21:47', '2026-06-18 14:43:49', 'COD', 'paid', 611110000, '6c31fc6d-e9a8-416e-80d4-5c8a99ed6864', NULL, 0);
INSERT INTO `order` VALUES (90, '20d428c7-bc91-49de-b321-17d40dae8a68', 'bd24206e-d42f-4736-9106-16dca8c687e9', 100000, 0, 100000, NULL, 90, 'refunded', '2026-06-19 00:23:12', '2026-06-19 00:19:22', 'COD', 'paid', 0, NULL, NULL, 0);
INSERT INTO `order` VALUES (91, '20d428c7-bc91-49de-b321-17d40dae8a68', 'bd24206e-d42f-4736-9106-16dca8c687e9', 120000, 0, 120000, NULL, 91, 'refunded', '2026-06-19 00:32:17', '2026-06-19 00:27:57', 'COD', 'paid', 0, NULL, NULL, 0);
INSERT INTO `order` VALUES (92, '20d428c7-bc91-49de-b321-17d40dae8a68', 'bd24206e-d42f-4736-9106-16dca8c687e9', 123000, 0, 123000, NULL, 92, 'refunded', '2026-06-19 00:41:09', '2026-06-19 00:36:57', 'COD', 'paid', 0, NULL, NULL, 0);
INSERT INTO `order` VALUES (93, '20d428c7-bc91-49de-b321-17d40dae8a68', 'bd24206e-d42f-4736-9106-16dca8c687e9', 1222220, 0, 1222220, NULL, 93, 'refunded', '2026-06-19 10:09:21', '2026-06-19 09:53:53', 'COD', 'paid', 0, NULL, NULL, 0);
INSERT INTO `order` VALUES (94, '20d428c7-bc91-49de-b321-17d40dae8a68', 'bd24206e-d42f-4736-9106-16dca8c687e9', 122000, 0, 122000, NULL, 94, 'completed', '2026-06-24 20:45:36', '2026-06-24 20:43:10', 'COD', 'paid', 0, NULL, NULL, 0);
INSERT INTO `order` VALUES (95, '20d428c7-bc91-49de-b321-17d40dae8a68', 'bd24206e-d42f-4736-9106-16dca8c687e9', 100000, 0, 100000, NULL, 95, 'completed', '2026-06-24 20:57:05', '2026-06-24 20:53:33', 'COD', 'paid', 0, NULL, NULL, 0);
INSERT INTO `order` VALUES (96, '20d428c7-bc91-49de-b321-17d40dae8a68', 'bd24206e-d42f-4736-9106-16dca8c687e9', 122000, 0, 122000, NULL, 96, 'cancelled', '2026-07-09 16:30:47', '2026-06-24 21:04:05', 'COD', 'pending', 0, NULL, NULL, 0);
INSERT INTO `order` VALUES (97, '20d428c7-bc91-49de-b321-17d40dae8a68', 'bd24206e-d42f-4736-9106-16dca8c687e9', 1232, 0, 1232, NULL, 97, 'cancelled', '2026-07-09 16:30:56', '2026-06-24 21:07:54', 'COD', 'pending', 0, NULL, NULL, 0);
INSERT INTO `order` VALUES (98, '20d428c7-bc91-49de-b321-17d40dae8a68', 'bd24206e-d42f-4736-9106-16dca8c687e9', 1232, 0, 1232, NULL, 98, 'complaint_rejected', '2026-07-11 14:17:06', '2026-06-24 21:14:06', 'COD', 'paid', 0, NULL, NULL, 0);
INSERT INTO `order` VALUES (99, '20d428c7-bc91-49de-b321-17d40dae8a68', '7578ede4-cd3f-4976-8712-3cb87cfc0a21', 500000, 10000, 490000, NULL, 99, 'cancelled', '2026-06-24 21:50:03', '2026-06-24 21:32:58', 'COD', 'pending', 10000, '938a021f-a05b-478d-9c16-d3c69ade6fa2', NULL, 0);
INSERT INTO `order` VALUES (100, '20d428c7-bc91-49de-b321-17d40dae8a68', '7578ede4-cd3f-4976-8712-3cb87cfc0a21', 500000, 10000, 490000, NULL, 100, 'completed', '2026-06-24 22:34:44', '2026-06-24 21:38:09', 'COD', 'paid', 10000, '938a021f-a05b-478d-9c16-d3c69ade6fa2', NULL, 0);
INSERT INTO `order` VALUES (101, '9ae5e6ec-3d7b-452b-ac1a-ea01c1d05b31', '7578ede4-cd3f-4976-8712-3cb87cfc0a21', 529000, 0, 529000, NULL, 101, 'refunded', '2026-06-24 22:40:14', '2026-06-24 22:00:04', 'COD', 'paid', 0, NULL, NULL, 0);
INSERT INTO `order` VALUES (102, '9ae5e6ec-3d7b-452b-ac1a-ea01c1d05b31', 'bd24206e-d42f-4736-9106-16dca8c687e9', 425000, 0, 425000, NULL, 102, 'pending', '2026-06-25 15:38:38', '2026-06-25 15:38:38', 'COD', 'pending', 0, NULL, 3, 0);
INSERT INTO `order` VALUES (103, '9ae5e6ec-3d7b-452b-ac1a-ea01c1d05b31', 'bd24206e-d42f-4736-9106-16dca8c687e9', 1222220, 200000, 1022220, NULL, 103, 'pending', '2026-06-25 15:44:53', '2026-06-25 15:44:53', 'COD', 'pending', 200000, '5d4d6e30-10ce-43eb-99b6-15caa5bb9dec', NULL, 0);
INSERT INTO `order` VALUES (104, '20d428c7-bc91-49de-b321-17d40dae8a68', 'bd24206e-d42f-4736-9106-16dca8c687e9', 1000000, 0, 1028100, NULL, 104, 'complaint_rejected', '2026-07-11 12:59:04', '2026-07-09 16:16:09', 'COD', 'paid', 0, NULL, NULL, 28100);
INSERT INTO `order` VALUES (105, 'c41636a7-61fe-4f6f-9456-ae1d99550945', 'bd24206e-d42f-4736-9106-16dca8c687e9', 1607750, 0, 1638890, NULL, 105, 'completed', '2026-07-11 11:48:56', '2026-07-11 11:45:15', 'COD', 'paid', 0, NULL, NULL, 31139);
INSERT INTO `order` VALUES (106, '35ab910f-0158-4869-8d2d-d07a2e627991', 'bd24206e-d42f-4736-9106-16dca8c687e9', 1000000, 0, 1028100, NULL, 106, 'completed', '2026-07-13 18:14:38', '2026-07-11 14:49:49', 'COD', 'paid', 0, NULL, NULL, 28100);
INSERT INTO `order` VALUES (107, '35ab910f-0158-4869-8d2d-d07a2e627991', 'bd24206e-d42f-4736-9106-16dca8c687e9', 8000000, 0, 8063100, NULL, 107, 'completed', '2026-07-13 18:14:38', '2026-07-11 14:50:33', 'COD', 'paid', 0, NULL, NULL, 63100);
INSERT INTO `order` VALUES (108, '35ab910f-0158-4869-8d2d-d07a2e627991', 'bd24206e-d42f-4736-9106-16dca8c687e9', 2000000, 0, 2033100, NULL, 108, 'completed', '2026-07-13 18:14:08', '2026-07-11 14:51:04', 'COD', 'paid', 0, NULL, NULL, 33100);
INSERT INTO `order` VALUES (109, '35ab910f-0158-4869-8d2d-d07a2e627991', 'bd24206e-d42f-4736-9106-16dca8c687e9', 2452, 0, 25552, NULL, 109, 'completed', '2026-07-13 18:14:08', '2026-07-11 14:52:27', 'COD', 'paid', 0, NULL, NULL, 23100);
INSERT INTO `order` VALUES (110, '20d428c7-bc91-49de-b321-17d40dae8a68', 'bd24206e-d42f-4736-9106-16dca8c687e9', 1268250, 0, 1297690, NULL, 110, 'completed', '2026-07-13 18:14:08', '2026-07-12 23:46:20', 'COD', 'paid', 0, NULL, 8, 29441);

-- ----------------------------
-- Table structure for order_complaint
-- ----------------------------
DROP TABLE IF EXISTS `order_complaint`;
CREATE TABLE `order_complaint`  (
  `id` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `admin_notes` text CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL,
  `buyer_id` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `created_at` datetime(6) NULL DEFAULT NULL,
  `description` text CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL,
  `order_id` int NOT NULL,
  `reason` enum('DAMAGED_ITEM','NOT_RECEIVED','OTHER','QUALITY_ISSUE','WRONG_ITEM') CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `resolved_at` datetime(6) NULL DEFAULT NULL,
  `resolved_by` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL,
  `shop_id` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `status` enum('APPROVED','PENDING','REJECTED') CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL,
  `update_at` datetime(6) NULL DEFAULT NULL,
  `shop_reply` text CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL,
  `is_shop_fault` bit(1) NULL DEFAULT NULL,
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB CHARACTER SET = utf8mb4 COLLATE = utf8mb4_general_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of order_complaint
-- ----------------------------
INSERT INTO `order_complaint` VALUES ('0cb6ef1a-5231-41a2-a472-b9e9ace1abb0', 'ok', '20d428c7-bc91-49de-b321-17d40dae8a68', '2026-06-19 00:22:38.000000', 'chưa có nhận hàng', 90, 'NOT_RECEIVED', '2026-06-19 00:23:12.000000', 'a064d764-f66a-41cc-9351-87249e97b105', 'bd24206e-d42f-4736-9106-16dca8c687e9', 'APPROVED', '2026-06-19 00:23:12.000000', NULL, NULL);
INSERT INTO `order_complaint` VALUES ('18549163-663b-436a-a090-97d0b169042c', 'chấp nhận', '20d428c7-bc91-49de-b321-17d40dae8a68', '2026-06-19 00:40:32.000000', 'không tốt', 92, 'DAMAGED_ITEM', '2026-06-19 00:41:09.000000', 'a064d764-f66a-41cc-9351-87249e97b105', 'bd24206e-d42f-4736-9106-16dca8c687e9', 'APPROVED', '2026-06-19 00:41:09.000000', NULL, NULL);
INSERT INTO `order_complaint` VALUES ('3c93d303-9a38-4b70-9b2b-d31357ff01a9', 'xạo', '20d428c7-bc91-49de-b321-17d40dae8a68', '2026-06-19 00:17:54.000000', 'aaaa', 87, 'NOT_RECEIVED', '2026-06-19 00:18:06.000000', 'a064d764-f66a-41cc-9351-87249e97b105', 'bd24206e-d42f-4736-9106-16dca8c687e9', 'REJECTED', '2026-06-19 00:18:06.000000', NULL, NULL);
INSERT INTO `order_complaint` VALUES ('4c8d62c0-a0ee-40e7-8ce8-22adbd8ff33a', 'qưert', '20d428c7-bc91-49de-b321-17d40dae8a68', '2026-07-11 12:18:15.000000', 'sdfg', 70, 'DAMAGED_ITEM', '2026-07-11 12:44:44.000000', 'a064d764-f66a-41cc-9351-87249e97b105', 'bd24206e-d42f-4736-9106-16dca8c687e9', 'REJECTED', '2026-07-11 12:44:44.000000', NULL, NULL);
INSERT INTO `order_complaint` VALUES ('4f80fefc-ac15-44b3-a898-ff25383192b6', 'áds', '20d428c7-bc91-49de-b321-17d40dae8a68', '2026-07-11 12:47:18.000000', 'sd', 104, 'DAMAGED_ITEM', '2026-07-11 12:47:35.000000', 'a064d764-f66a-41cc-9351-87249e97b105', 'bd24206e-d42f-4736-9106-16dca8c687e9', 'REJECTED', '2026-07-11 12:47:35.000000', NULL, NULL);
INSERT INTO `order_complaint` VALUES ('66d7572b-30d8-479d-b2e6-7cead6a3cfbb', 'oke', '20d428c7-bc91-49de-b321-17d40dae8a68', '2026-07-11 12:38:41.000000', 'kém chất lượng', 65, 'QUALITY_ISSUE', '2026-07-11 12:39:49.000000', 'a064d764-f66a-41cc-9351-87249e97b105', 'bd24206e-d42f-4736-9106-16dca8c687e9', 'APPROVED', '2026-07-11 12:39:49.000000', NULL, NULL);
INSERT INTO `order_complaint` VALUES ('7b18614c-1e7d-4024-ac7c-08d47c1fe920', 'shop đúng', '20d428c7-bc91-49de-b321-17d40dae8a68', '2026-07-11 13:21:07.000000', 'sai sản phẩm', 98, 'WRONG_ITEM', '2026-07-11 14:17:06.000000', 'a064d764-f66a-41cc-9351-87249e97b105', 'bd24206e-d42f-4736-9106-16dca8c687e9', 'REJECTED', '2026-07-11 14:17:06.000000', 'đóng gói đúng rồi', NULL);
INSERT INTO `order_complaint` VALUES ('7b52f09b-ec9f-49bf-82b2-498824259fbb', 'sai lệch thông tin', '20d428c7-bc91-49de-b321-17d40dae8a68', '2026-06-18 23:44:08.000000', 'sai hàng', 63, 'WRONG_ITEM', '2026-06-19 00:05:01.000000', 'a064d764-f66a-41cc-9351-87249e97b105', 'bd24206e-d42f-4736-9106-16dca8c687e9', 'REJECTED', '2026-06-19 00:05:01.000000', NULL, NULL);
INSERT INTO `order_complaint` VALUES ('7e80eeaa-060f-41bc-bdb7-45313bfd0ff8', 'xạo', '20d428c7-bc91-49de-b321-17d40dae8a68', '2026-06-24 22:16:23.000000', 'Gửi nhầm sản phẩm', 100, 'WRONG_ITEM', '2026-06-24 22:34:44.000000', 'a064d764-f66a-41cc-9351-87249e97b105', '7578ede4-cd3f-4976-8712-3cb87cfc0a21', 'REJECTED', '2026-06-24 22:34:44.000000', NULL, NULL);
INSERT INTO `order_complaint` VALUES ('a63952de-d699-40c9-9bf9-2f228cc1dcf2', 'oke', '20d428c7-bc91-49de-b321-17d40dae8a68', '2026-06-19 00:31:15.000000', 'rách hết rồi', 91, 'DAMAGED_ITEM', '2026-06-19 00:32:17.000000', 'a064d764-f66a-41cc-9351-87249e97b105', 'bd24206e-d42f-4736-9106-16dca8c687e9', 'APPROVED', '2026-06-19 00:32:17.000000', NULL, NULL);
INSERT INTO `order_complaint` VALUES ('b1d0f752-e34b-4130-83d2-78a5345bd6f1', '2ws', '20d428c7-bc91-49de-b321-17d40dae8a68', '2026-07-11 12:58:57.000000', 'âf', 104, 'WRONG_ITEM', '2026-07-11 12:59:04.000000', 'a064d764-f66a-41cc-9351-87249e97b105', 'bd24206e-d42f-4736-9106-16dca8c687e9', 'REJECTED', '2026-07-11 12:59:04.000000', NULL, NULL);
INSERT INTO `order_complaint` VALUES ('c49f29cb-46c6-4176-b684-6853f2c7593b', 'oke chấp nhận', '20d428c7-bc91-49de-b321-17d40dae8a68', '2026-06-19 00:16:18.000000', 'abcxyz', 63, 'WRONG_ITEM', '2026-06-19 00:17:08.000000', 'a064d764-f66a-41cc-9351-87249e97b105', 'bd24206e-d42f-4736-9106-16dca8c687e9', 'APPROVED', '2026-06-19 00:17:08.000000', NULL, NULL);
INSERT INTO `order_complaint` VALUES ('cd27d017-c01e-49fb-b5a8-55b09e45e1d5', 'ko', '20d428c7-bc91-49de-b321-17d40dae8a68', '2026-06-19 10:05:48.000000', 'aaa', 93, 'WRONG_ITEM', '2026-06-19 10:09:21.000000', 'a064d764-f66a-41cc-9351-87249e97b105', 'bd24206e-d42f-4736-9106-16dca8c687e9', 'APPROVED', '2026-06-19 10:09:21.000000', NULL, NULL);
INSERT INTO `order_complaint` VALUES ('d4376d78-430b-4557-8cad-218cd3eaaef9', 'oke', '9ae5e6ec-3d7b-452b-ac1a-ea01c1d05b31', '2026-06-24 22:39:25.000000', 'hỏng rồi', 101, 'DAMAGED_ITEM', '2026-06-24 22:40:14.000000', 'a064d764-f66a-41cc-9351-87249e97b105', '7578ede4-cd3f-4976-8712-3cb87cfc0a21', 'APPROVED', '2026-06-24 22:40:14.000000', NULL, NULL);
INSERT INTO `order_complaint` VALUES ('e027079f-6404-4032-be05-fb6a0d99eab9', 'àdfs', '20d428c7-bc91-49de-b321-17d40dae8a68', '2026-07-11 12:46:01.000000', 'ko có', 104, 'NOT_RECEIVED', '2026-07-11 12:46:40.000000', 'a064d764-f66a-41cc-9351-87249e97b105', 'bd24206e-d42f-4736-9106-16dca8c687e9', 'REJECTED', '2026-07-11 12:46:40.000000', NULL, NULL);
INSERT INTO `order_complaint` VALUES ('e97e03c1-9855-4d11-849e-207e306ee4f7', 'lỗi vận chuyển', '20d428c7-bc91-49de-b321-17d40dae8a68', '2026-06-18 23:43:39.000000', 'sai hàng', 70, 'WRONG_ITEM', '2026-06-19 00:06:13.000000', 'a064d764-f66a-41cc-9351-87249e97b105', 'bd24206e-d42f-4736-9106-16dca8c687e9', 'APPROVED', '2026-06-19 00:06:13.000000', NULL, NULL);
INSERT INTO `order_complaint` VALUES ('eabe79b3-2a2a-4a32-913e-5e196ac68936', 'sdf', '20d428c7-bc91-49de-b321-17d40dae8a68', '2026-07-11 12:43:00.000000', 'chưa nhận được hàng', 64, 'NOT_RECEIVED', '2026-07-11 12:44:38.000000', 'a064d764-f66a-41cc-9351-87249e97b105', 'bd24206e-d42f-4736-9106-16dca8c687e9', 'REJECTED', '2026-07-11 12:44:38.000000', NULL, NULL);

-- ----------------------------
-- Table structure for order_complaint_image
-- ----------------------------
DROP TABLE IF EXISTS `order_complaint_image`;
CREATE TABLE `order_complaint_image`  (
  `complaint_id` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `image_url` text CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL,
  INDEX `FKssys1j0e7cv6j18g6t7963j46`(`complaint_id` ASC) USING BTREE,
  CONSTRAINT `FKssys1j0e7cv6j18g6t7963j46` FOREIGN KEY (`complaint_id`) REFERENCES `order_complaint` (`id`) ON DELETE RESTRICT ON UPDATE RESTRICT
) ENGINE = InnoDB CHARACTER SET = utf8mb4 COLLATE = utf8mb4_general_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of order_complaint_image
-- ----------------------------
INSERT INTO `order_complaint_image` VALUES ('66d7572b-30d8-479d-b2e6-7cead6a3cfbb', 'https://res.cloudinary.com/dqghfi8be/image/upload/v1783748305/pevufn0ydlfvuakoihtq.avif');
INSERT INTO `order_complaint_image` VALUES ('e027079f-6404-4032-be05-fb6a0d99eab9', 'https://res.cloudinary.com/dqghfi8be/video/upload/v1783748746/qrst7wmavewrqfsrfwvy.mp4');
INSERT INTO `order_complaint_image` VALUES ('4f80fefc-ac15-44b3-a898-ff25383192b6', 'https://res.cloudinary.com/dqghfi8be/image/upload/v1783748834/t5szuo9e3qut8r3aokwh.avif');
INSERT INTO `order_complaint_image` VALUES ('7b18614c-1e7d-4024-ac7c-08d47c1fe920', 'https://res.cloudinary.com/dqghfi8be/image/upload/v1783750862/bzefprcnl8wcdmvbdgfp.avif');

-- ----------------------------
-- Table structure for order_complaint_shop_image
-- ----------------------------
DROP TABLE IF EXISTS `order_complaint_shop_image`;
CREATE TABLE `order_complaint_shop_image`  (
  `complaint_id` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `image_url` text CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL,
  INDEX `FKnfx5nhl6ds11tav6a514j4vbp`(`complaint_id` ASC) USING BTREE,
  CONSTRAINT `FKnfx5nhl6ds11tav6a514j4vbp` FOREIGN KEY (`complaint_id`) REFERENCES `order_complaint` (`id`) ON DELETE RESTRICT ON UPDATE RESTRICT
) ENGINE = InnoDB CHARACTER SET = utf8mb4 COLLATE = utf8mb4_general_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of order_complaint_shop_image
-- ----------------------------
INSERT INTO `order_complaint_shop_image` VALUES ('7b18614c-1e7d-4024-ac7c-08d47c1fe920', 'https://res.cloudinary.com/dqghfi8be/image/upload/v1783751177/gn44wigj61kwndrvysfi.png');

-- ----------------------------
-- Table structure for orderflow
-- ----------------------------
DROP TABLE IF EXISTS `orderflow`;
CREATE TABLE `orderflow`  (
  `id` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `status` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL,
  `note` text CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL,
  `order_id` int NOT NULL,
  `created_by` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`) USING BTREE,
  INDEX `idx_orderflow_order`(`order_id` ASC) USING BTREE,
  CONSTRAINT `fk_orderflow_order` FOREIGN KEY (`order_id`) REFERENCES `order` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE = InnoDB CHARACTER SET = utf8mb4 COLLATE = utf8mb4_general_ci COMMENT = 'Lịch sử trạng thái đơn hàng' ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of orderflow
-- ----------------------------
INSERT INTO `orderflow` VALUES ('00e17f0f-0661-4067-895a-6faff21c492e', 'confirmed', '', 100, '7578ede4-cd3f-4976-8712-3cb87cfc0a21', '2026-06-24 21:51:28');
INSERT INTO `orderflow` VALUES ('025a1e7d-ba70-4bec-ac2e-3a25d94dbb0f', 'completed', 'Tự động hoàn tất đơn hàng', 91, 'system', '2026-06-19 00:30:51');
INSERT INTO `orderflow` VALUES ('0358b601-d78d-41f3-96d6-e267aa8b3555', 'confirmed', '', 43, 'bd24206e-d42f-4736-9106-16dca8c687e9', '2026-06-23 17:35:53');
INSERT INTO `orderflow` VALUES ('04e9f3bd-20e9-460e-97a2-c197ff25ba8f', 'delivered', 'Tự động xác nhận giao hàng thành công', 109, 'system', '2026-07-13 18:12:37');
INSERT INTO `orderflow` VALUES ('062c3b00-c93c-4b8d-a00b-6cdf94b7be50', 'completed', 'Tự động hoàn tất đơn hàng', 47, 'system', '2026-06-09 22:41:29');
INSERT INTO `orderflow` VALUES ('065dcf6d-6d3d-41a4-92d6-8e17375e849b', 'shipping', '', 81, 'bd24206e-d42f-4736-9106-16dca8c687e9', '2026-06-16 20:39:42');
INSERT INTO `orderflow` VALUES ('0754c066-2954-4a10-8c93-6be01621b204', 'delivered', 'Tự động xác nhận giao hàng thành công', 64, 'system', '2026-06-15 17:35:57');
INSERT INTO `orderflow` VALUES ('082416f0-2ad6-4ece-848c-66e92589c3ae', 'shipping', '', 90, 'bd24206e-d42f-4736-9106-16dca8c687e9', '2026-06-19 00:19:31');
INSERT INTO `orderflow` VALUES ('085bf445-57f5-45be-949f-5d85f9c1f513', 'delivered', 'Tự động xác nhận giao hàng thành công', 108, 'system', '2026-07-13 18:12:37');
INSERT INTO `orderflow` VALUES ('086bc852-6755-451c-a723-1fcf41c6f44c', 'shipping', '', 65, 'bd24206e-d42f-4736-9106-16dca8c687e9', '2026-06-15 18:27:53');
INSERT INTO `orderflow` VALUES ('08da3171-0412-4b03-a700-6de36cb1eae3', 'confirmed', '', 106, 'bd24206e-d42f-4736-9106-16dca8c687e9', '2026-07-13 18:11:37');
INSERT INTO `orderflow` VALUES ('09943be3-d1ee-49d3-8c65-c4fe4a1cbbd8', 'shipping', '', 67, 'bd24206e-d42f-4736-9106-16dca8c687e9', '2026-06-15 18:41:44');
INSERT INTO `orderflow` VALUES ('0a2c9765-4be8-4b3f-8a82-74ce81a54840', 'confirmed', '', 63, 'bd24206e-d42f-4736-9106-16dca8c687e9', '2026-06-15 17:28:22');
INSERT INTO `orderflow` VALUES ('0bc52f0b-d520-4ed9-87de-45fa691ae1df', 'shipping', '', 63, 'bd24206e-d42f-4736-9106-16dca8c687e9', '2026-06-15 17:28:25');
INSERT INTO `orderflow` VALUES ('0d0f2bc8-b35c-4b2b-a7d5-76332ac034aa', 'shipping', '', 98, 'bd24206e-d42f-4736-9106-16dca8c687e9', '2026-07-11 11:46:02');
INSERT INTO `orderflow` VALUES ('0ec2d3b7-1486-4ad4-9db0-049c2ce1d09d', 'completed', 'Tự động hoàn tất đơn hàng', 94, 'system', '2026-06-24 20:45:36');
INSERT INTO `orderflow` VALUES ('10b1f390-591f-426d-9ad9-d3409bf2c295', 'completed', 'Tự động hoàn tất đơn hàng', 101, 'system', '2026-06-24 22:39:13');
INSERT INTO `orderflow` VALUES ('110399cf-bcd0-4edd-b3aa-6dfd29a2efa2', 'confirmed', '', 79, 'bd24206e-d42f-4736-9106-16dca8c687e9', '2026-06-16 20:21:21');
INSERT INTO `orderflow` VALUES ('11fe2b1d-f703-43eb-91c7-b6b61dbf3e36', 'shipping', '', 91, 'bd24206e-d42f-4736-9106-16dca8c687e9', '2026-06-19 00:28:07');
INSERT INTO `orderflow` VALUES ('125336aa-50ba-40a0-82da-0d089e6e8523', 'shipping', '', 85, 'bd24206e-d42f-4736-9106-16dca8c687e9', '2026-06-16 22:11:32');
INSERT INTO `orderflow` VALUES ('127e1376-0d25-4b7d-96f6-18c6ad539b3d', 'confirmed', '', 110, 'bd24206e-d42f-4736-9106-16dca8c687e9', '2026-07-13 18:11:24');
INSERT INTO `orderflow` VALUES ('1403fcdc-e095-4e02-b8d1-4e13b43ff20f', 'delivered', 'Tự động xác nhận giao hàng thành công', 110, 'system', '2026-07-13 18:12:37');
INSERT INTO `orderflow` VALUES ('143f47ec-c8c5-4970-a6fb-53cb0220b928', 'delivered', 'Tự động xác nhận giao hàng thành công', 72, 'system', '2026-06-16 16:29:22');
INSERT INTO `orderflow` VALUES ('1659e069-8910-46ee-bdab-92b059d882a5', 'delivered', 'Tự động xác nhận giao hàng thành công', 53, 'system', '2026-06-11 12:54:01');
INSERT INTO `orderflow` VALUES ('165e2e4c-be88-4e9c-8163-e11b099d5865', 'delivered', 'Tự động xác nhận giao hàng thành công', 93, 'system', '2026-06-19 10:03:45');
INSERT INTO `orderflow` VALUES ('1708c391-303c-4bd1-9509-b4e879738537', 'delivered', 'Tự động xác nhận giao hàng thành công', 84, 'system', '2026-06-16 21:57:39');
INSERT INTO `orderflow` VALUES ('17717ae8-c3c9-45cb-af46-834958f2a059', 'completed', 'Tự động hoàn tất đơn hàng', 37, 'system', '2026-06-08 17:01:30');
INSERT INTO `orderflow` VALUES ('17fb5c4f-9534-4b95-b50b-9a674deef237', 'delivered', 'Tự động xác nhận giao hàng thành công', 95, 'system', '2026-06-24 20:55:35');
INSERT INTO `orderflow` VALUES ('185061a6-d2dc-48fc-8d08-8ea4c6877ae9', 'confirmed', '', 75, 'bd24206e-d42f-4736-9106-16dca8c687e9', '2026-06-16 16:47:18');
INSERT INTO `orderflow` VALUES ('18612113-e0df-46ec-b4b7-b795fdc052b1', 'delivered', 'Tự động xác nhận giao hàng thành công', 89, 'system', '2026-06-19 00:20:17');
INSERT INTO `orderflow` VALUES ('18f3a312-8cac-4182-ba69-0ec36bc86e4b', 'confirmed', '', 66, 'bd24206e-d42f-4736-9106-16dca8c687e9', '2026-06-15 18:36:08');
INSERT INTO `orderflow` VALUES ('19cb1e80-8d86-487e-b5be-00e2bd9b3109', 'delivered', 'Tự động xác nhận giao hàng thành công', 70, 'system', '2026-06-16 16:07:32');
INSERT INTO `orderflow` VALUES ('1bc61e83-47a1-4d56-9e73-a7990561a3ba', 'shipping', '', 100, '7578ede4-cd3f-4976-8712-3cb87cfc0a21', '2026-06-24 21:51:30');
INSERT INTO `orderflow` VALUES ('1cc0e2ee-5b98-4d4c-a7d2-325f02cd655a', 'completed', 'Tự động hoàn tất đơn hàng', 68, 'system', '2026-06-15 18:50:05');
INSERT INTO `orderflow` VALUES ('1dcd3c97-8cc3-4eea-8a16-7947fbfc67f0', 'confirmed', '', 109, 'bd24206e-d42f-4736-9106-16dca8c687e9', '2026-07-13 18:11:26');
INSERT INTO `orderflow` VALUES ('2416f8ba-57f4-47e6-827b-96df0d1acd28', 'delivered', 'Tự động xác nhận giao hàng thành công', 87, 'system', '2026-06-16 22:42:09');
INSERT INTO `orderflow` VALUES ('241d3c69-4d92-4094-b525-ec77bb67d529', 'confirmed', '', 92, 'bd24206e-d42f-4736-9106-16dca8c687e9', '2026-06-19 00:37:06');
INSERT INTO `orderflow` VALUES ('25af81f9-bf26-4b63-a680-529b83ddb254', 'delivered', 'Tự động xác nhận giao hàng thành công', 50, 'system', '2026-06-11 12:18:29');
INSERT INTO `orderflow` VALUES ('25ffce22-9fec-49a9-b913-0c525791e98a', 'confirmed', '', 90, 'bd24206e-d42f-4736-9106-16dca8c687e9', '2026-06-19 00:19:29');
INSERT INTO `orderflow` VALUES ('263e49fa-94ef-4eaf-b6f6-fd3fabaf72eb', 'confirmed', '', 93, 'bd24206e-d42f-4736-9106-16dca8c687e9', '2026-06-19 10:02:20');
INSERT INTO `orderflow` VALUES ('278bd5e0-041d-4f1a-8336-91b767b08a46', 'completed', 'Tự động hoàn tất đơn hàng', 84, 'system', '2026-06-16 21:59:09');
INSERT INTO `orderflow` VALUES ('27d6f450-88f2-4fc8-acea-862e3abb448b', 'confirmed', '', 65, 'bd24206e-d42f-4736-9106-16dca8c687e9', '2026-06-15 18:27:51');
INSERT INTO `orderflow` VALUES ('2a2f80d9-08c9-45ec-9cad-a62d7b4eded9', 'completed', 'Tự động hoàn tất đơn hàng', 43, 'system', '2026-07-11 11:48:56');
INSERT INTO `orderflow` VALUES ('2a863d9b-e1e2-4e98-8dee-3fc1f2019712', 'completed', 'Tự động hoàn tất đơn hàng', 54, 'system', '2026-06-11 13:54:52');
INSERT INTO `orderflow` VALUES ('2dfebd82-386b-4ed4-9b5f-b61e599ec67d', 'delivered', 'Tự động xác nhận giao hàng thành công', 63, 'system', '2026-06-15 17:29:38');
INSERT INTO `orderflow` VALUES ('2f06ce09-e050-4d06-a04e-3496e716259b', 'delivered', 'Tự động xác nhận giao hàng thành công', 86, 'system', '2026-06-16 22:34:19');
INSERT INTO `orderflow` VALUES ('300caf4f-f695-40da-9879-336f509da57c', 'completed', 'Tự động hoàn tất đơn hàng', 34, 'system', '2026-06-08 17:01:30');
INSERT INTO `orderflow` VALUES ('333199a4-c49a-423b-bb0e-3710ca3c5562', 'completed', 'Tự động hoàn tất đơn hàng', 82, 'system', '2026-06-16 21:40:38');
INSERT INTO `orderflow` VALUES ('33cb7646-2bbf-4a5e-9694-073b3bdc8013', 'shipping', '', 61, 'bd24206e-d42f-4736-9106-16dca8c687e9', '2026-06-12 14:56:26');
INSERT INTO `orderflow` VALUES ('35f80230-053f-4958-b26c-d4acbfa45f27', 'delivered', 'Tự động xác nhận giao hàng thành công', 68, 'system', '2026-06-15 18:48:35');
INSERT INTO `orderflow` VALUES ('36e91dcc-1282-4477-ab41-0b0d0bdcc176', 'shipping', '', 106, 'bd24206e-d42f-4736-9106-16dca8c687e9', '2026-07-13 18:11:40');
INSERT INTO `orderflow` VALUES ('3850ed71-d616-4f58-bd50-20cd2bc2dde0', 'completed', 'Tự động hoàn tất đơn hàng', 110, 'system', '2026-07-13 18:14:08');
INSERT INTO `orderflow` VALUES ('3d9e340c-2a22-4361-91c3-28009da088be', 'confirmed', '', 105, 'bd24206e-d42f-4736-9106-16dca8c687e9', '2026-07-11 11:45:43');
INSERT INTO `orderflow` VALUES ('3ed5efda-5778-44c5-b4b0-8e42ff71b352', 'completed', 'Tự động hoàn tất đơn hàng', 48, 'system', '2026-06-10 17:31:59');
INSERT INTO `orderflow` VALUES ('40ad03de-7f95-41fd-8aff-1f308f097556', 'delivered', 'Tự động xác nhận giao hàng thành công', 105, 'system', '2026-07-11 11:47:26');
INSERT INTO `orderflow` VALUES ('40cfa136-2828-4181-97de-3594c7c92b46', 'shipping', '', 54, 'bd24206e-d42f-4736-9106-16dca8c687e9', '2026-06-11 13:52:28');
INSERT INTO `orderflow` VALUES ('40d33da9-4f8d-4ab5-aad3-8b5afa73f898', 'shipping', '', 43, 'bd24206e-d42f-4736-9106-16dca8c687e9', '2026-06-04 15:18:36');
INSERT INTO `orderflow` VALUES ('43321f12-6d5c-4222-b372-06aa7ae2ea28', 'delivered', 'Tự động xác nhận giao hàng thành công', 66, 'system', '2026-06-15 18:37:20');
INSERT INTO `orderflow` VALUES ('436e09c9-010e-4452-aef8-081c8bd8ad7c', 'shipping', '', 68, 'bd24206e-d42f-4736-9106-16dca8c687e9', '2026-06-15 18:47:31');
INSERT INTO `orderflow` VALUES ('4425c891-e8cb-4dd0-bed7-6e8d8d9ad4a5', 'delivered', 'Tự động xác nhận giao hàng thành công', 76, 'system', '2026-06-16 17:03:41');
INSERT INTO `orderflow` VALUES ('453c2fae-8b8f-48ce-a1f8-c6a02840b133', 'shipping', '', 48, 'bd24206e-d42f-4736-9106-16dca8c687e9', '2026-06-10 17:28:59');
INSERT INTO `orderflow` VALUES ('45802a2b-28fb-4b12-aab9-ab51f11fde84', 'completed', 'Tự động hoàn tất đơn hàng', 38, 'system', '2026-06-08 17:01:30');
INSERT INTO `orderflow` VALUES ('45b8e987-f21c-4b05-a0a0-37ec55eeab92', 'shipping', '', 47, 'bd24206e-d42f-4736-9106-16dca8c687e9', '2026-06-09 22:38:44');
INSERT INTO `orderflow` VALUES ('48904a29-6fb5-486b-89fb-9d1d33fcdd0e', 'confirmed', '', 54, 'bd24206e-d42f-4736-9106-16dca8c687e9', '2026-06-11 13:52:26');
INSERT INTO `orderflow` VALUES ('49e1d1d8-c248-4bcd-8f0e-1c0ebae22c7c', 'shipping', '', 107, 'bd24206e-d42f-4736-9106-16dca8c687e9', '2026-07-13 18:11:38');
INSERT INTO `orderflow` VALUES ('4acc5b00-841a-4940-85d5-6fab70c88335', 'confirmed', '', 73, 'bd24206e-d42f-4736-9106-16dca8c687e9', '2026-06-16 16:32:41');
INSERT INTO `orderflow` VALUES ('4d25ebca-7816-454f-a606-c35c967bbae8', 'delivered', 'Tự động xác nhận giao hàng thành công', 55, 'system', '2026-06-11 15:15:28');
INSERT INTO `orderflow` VALUES ('4deb401e-6115-449d-8293-d498d0ad362d', 'confirmed', '', 95, 'bd24206e-d42f-4736-9106-16dca8c687e9', '2026-06-24 20:54:15');
INSERT INTO `orderflow` VALUES ('4f344aa9-4e96-4643-8000-ec4c9b8efd33', 'shipping', '', 74, 'bd24206e-d42f-4736-9106-16dca8c687e9', '2026-06-16 16:42:29');
INSERT INTO `orderflow` VALUES ('4f44f1e1-314a-4236-a96d-fad40d057604', 'shipping', '', 104, 'bd24206e-d42f-4736-9106-16dca8c687e9', '2026-07-09 16:16:40');
INSERT INTO `orderflow` VALUES ('4f9bc4d7-a2b5-4014-9469-cc02e9d24351', 'shipping', '', 64, 'bd24206e-d42f-4736-9106-16dca8c687e9', '2026-06-15 17:34:42');
INSERT INTO `orderflow` VALUES ('5131f25e-748b-4034-bfdb-a229941aa263', 'completed', 'Tự động hoàn tất đơn hàng', 58, 'system', '2026-06-12 15:12:07');
INSERT INTO `orderflow` VALUES ('513d3991-3bf3-4c3b-9a66-590509be98ba', 'delivered', 'Tự động xác nhận giao hàng thành công', 54, 'system', '2026-06-11 13:53:51');
INSERT INTO `orderflow` VALUES ('517aa346-736e-446c-acd8-ecd6ec2058e6', 'delivered', 'Tự động xác nhận giao hàng thành công', 58, 'system', '2026-06-12 15:10:37');
INSERT INTO `orderflow` VALUES ('537f7d36-8505-480f-9aa2-5ed489a34f95', 'confirmed', '', 53, 'bd24206e-d42f-4736-9106-16dca8c687e9', '2026-06-11 12:52:40');
INSERT INTO `orderflow` VALUES ('5384f848-ee9c-4030-99bf-1da36f68e13e', 'delivered', 'Tự động xác nhận giao hàng thành công', 49, 'system', '2026-06-10 21:59:57');
INSERT INTO `orderflow` VALUES ('541fd686-3bb1-45c9-9bda-51c38c4ff012', 'shipping', '', 87, 'bd24206e-d42f-4736-9106-16dca8c687e9', '2026-06-16 22:41:06');
INSERT INTO `orderflow` VALUES ('549db8af-dae0-4d09-a4be-94749a8e29bf', 'shipping', '', 53, 'bd24206e-d42f-4736-9106-16dca8c687e9', '2026-06-11 12:52:42');
INSERT INTO `orderflow` VALUES ('562f0c38-5c84-4803-9106-61c942959609', 'completed', 'Tự động hoàn tất đơn hàng', 74, 'system', '2026-06-16 16:45:16');
INSERT INTO `orderflow` VALUES ('572350f1-1243-4347-9151-a1ce7c1be11e', 'confirmed', '', 81, 'bd24206e-d42f-4736-9106-16dca8c687e9', '2026-06-16 20:39:40');
INSERT INTO `orderflow` VALUES ('57ae6f6b-f73f-4579-b375-7468fd55a4bd', 'confirmed', '', 52, 'bd24206e-d42f-4736-9106-16dca8c687e9', '2026-06-11 12:44:56');
INSERT INTO `orderflow` VALUES ('57e60b7a-8387-4950-b1a5-5d6a266178d1', 'confirmed', '', 74, 'bd24206e-d42f-4736-9106-16dca8c687e9', '2026-06-16 16:42:27');
INSERT INTO `orderflow` VALUES ('583163d3-912f-4e68-a2db-d0ab7d6ca6cb', 'completed', 'Tự động hoàn tất đơn hàng', 73, 'system', '2026-06-16 16:35:22');
INSERT INTO `orderflow` VALUES ('5b03bb34-86c6-4d6f-add3-ee9d159a480e', 'shipping', '', 43, 'bd24206e-d42f-4736-9106-16dca8c687e9', '2026-07-11 11:46:00');
INSERT INTO `orderflow` VALUES ('5b74ca36-d4a3-4194-9101-86261f78dbd6', 'cancelled', '', 99, '7578ede4-cd3f-4976-8712-3cb87cfc0a21', '2026-06-24 21:50:03');
INSERT INTO `orderflow` VALUES ('5bd9e0c0-c05b-45b2-89de-31ece3ba3d72', 'completed', 'Tự động hoàn tất đơn hàng', 89, 'system', '2026-06-19 00:21:47');
INSERT INTO `orderflow` VALUES ('5f11baff-b236-4e1f-88a1-5619b65d39ab', 'delivered', 'Tự động xác nhận giao hàng thành công', 61, 'system', '2026-06-12 14:57:37');
INSERT INTO `orderflow` VALUES ('5f31e24a-f96c-42fe-9ad1-69390eef9fd2', 'completed', 'Tự động hoàn tất đơn hàng', 61, 'system', '2026-06-12 14:59:07');
INSERT INTO `orderflow` VALUES ('62767ee6-b35e-4db5-b297-375f9f9cce4b', 'completed', 'Tự động hoàn tất đơn hàng', 39, 'system', '2026-06-08 17:01:30');
INSERT INTO `orderflow` VALUES ('62ba2e8a-eb3a-4f40-b20e-bf0208fd64ac', 'shipping', '', 75, 'bd24206e-d42f-4736-9106-16dca8c687e9', '2026-06-16 16:47:19');
INSERT INTO `orderflow` VALUES ('63514053-5834-485f-b253-dd2e00064cb1', 'completed', 'Tự động hoàn tất đơn hàng', 66, 'system', '2026-06-15 18:38:50');
INSERT INTO `orderflow` VALUES ('65723eb8-9761-4bb6-b03b-5f1195d25c36', 'delivered', 'Tự động xác nhận giao hàng thành công', 101, 'system', '2026-06-24 22:37:43');
INSERT INTO `orderflow` VALUES ('65fce879-e559-497a-a0ab-cb00f0685d47', 'completed', 'Tự động hoàn tất đơn hàng', 41, 'system', '2026-06-08 17:01:30');
INSERT INTO `orderflow` VALUES ('669e90ab-43a2-4bfc-b3ae-43bdadc9805c', 'shipping', '', 92, 'bd24206e-d42f-4736-9106-16dca8c687e9', '2026-06-19 00:37:08');
INSERT INTO `orderflow` VALUES ('6934a9fa-db6e-45a7-81d0-ab77a0d32e01', 'delivered', 'Tự động xác nhận giao hàng thành công', 90, 'system', '2026-06-19 00:20:47');
INSERT INTO `orderflow` VALUES ('696f7130-e0b4-4084-b645-db2ecb27a0c7', 'delivered', 'Tự động xác nhận giao hàng thành công', 59, 'system', '2026-06-11 16:50:51');
INSERT INTO `orderflow` VALUES ('69b5f412-2734-42c2-abe4-7c5cbc420c52', 'shipping', '', 71, 'bd24206e-d42f-4736-9106-16dca8c687e9', '2026-06-16 16:19:25');
INSERT INTO `orderflow` VALUES ('6aac07b0-19bd-414c-ade2-fd1304d18d99', 'completed', 'Tự động hoàn tất đơn hàng', 64, 'system', '2026-06-15 17:37:27');
INSERT INTO `orderflow` VALUES ('6b980eee-85df-4fae-a1b3-6f7ad1c0c94b', 'confirmed', '', 48, 'bd24206e-d42f-4736-9106-16dca8c687e9', '2026-06-10 17:28:57');
INSERT INTO `orderflow` VALUES ('6c4d1916-b031-4e9c-97a7-55f0bb101693', 'confirmed', '', 98, 'bd24206e-d42f-4736-9106-16dca8c687e9', '2026-07-11 11:45:53');
INSERT INTO `orderflow` VALUES ('6cc6de23-aea6-4e49-8fd4-fcf94b7acc2f', 'confirmed', '', 87, 'bd24206e-d42f-4736-9106-16dca8c687e9', '2026-06-16 22:41:02');
INSERT INTO `orderflow` VALUES ('6e619a15-9147-4c1b-91a2-8b8ed1fbe957', 'delivered', 'Tự động xác nhận giao hàng thành công', 104, 'system', '2026-07-09 16:17:50');
INSERT INTO `orderflow` VALUES ('6ebc40e0-3922-4b24-b46f-a846c48dfcf8', 'delivered', 'Tự động xác nhận giao hàng thành công', 91, 'system', '2026-06-19 00:29:21');
INSERT INTO `orderflow` VALUES ('6ffa7af7-7b1e-4d53-b679-2a023e12aab6', 'completed', 'Tự động hoàn tất đơn hàng', 104, 'system', '2026-07-09 16:19:20');
INSERT INTO `orderflow` VALUES ('70ddcdce-2730-443a-bd74-db757cb7db23', 'confirmed', '', 84, 'bd24206e-d42f-4736-9106-16dca8c687e9', '2026-06-16 21:56:30');
INSERT INTO `orderflow` VALUES ('71194cce-bec7-4889-93de-6d93711981d2', 'shipping', '', 88, 'bd24206e-d42f-4736-9106-16dca8c687e9', '2026-06-17 21:14:33');
INSERT INTO `orderflow` VALUES ('7124cdc9-9a5e-4aca-b6d9-a097b0e70f8b', 'shipping', '', 78, 'bd24206e-d42f-4736-9106-16dca8c687e9', '2026-06-16 20:13:42');
INSERT INTO `orderflow` VALUES ('727220ca-4efe-44dc-8ccd-2516bee99d5b', 'completed', 'Tự động hoàn tất đơn hàng', 81, 'system', '2026-06-16 20:42:31');
INSERT INTO `orderflow` VALUES ('736da80a-77d0-43da-9fea-0275259d8dc1', 'completed', 'Tự động hoàn tất đơn hàng', 36, 'system', '2026-06-08 17:01:30');
INSERT INTO `orderflow` VALUES ('74e86e05-1e77-4888-ad66-7b38ea41d76a', 'shipping', '', 93, 'bd24206e-d42f-4736-9106-16dca8c687e9', '2026-06-19 10:02:25');
INSERT INTO `orderflow` VALUES ('75978ebe-9f66-44f2-b6da-8ea82506d995', 'delivered', 'Tự động xác nhận giao hàng thành công', 100, 'system', '2026-06-24 21:52:49');
INSERT INTO `orderflow` VALUES ('75a75f49-bc4b-4c57-9e06-0c446d509c91', 'shipping', '', 95, 'bd24206e-d42f-4736-9106-16dca8c687e9', '2026-06-24 20:54:17');
INSERT INTO `orderflow` VALUES ('76cea076-7aef-41bc-a4dd-e5fcbc7ac1ec', 'delivered', 'Tự động xác nhận giao hàng thành công', 71, 'system', '2026-06-16 16:20:30');
INSERT INTO `orderflow` VALUES ('770920e5-de9e-43c8-a983-922ef0591e30', 'completed', 'Tự động hoàn tất đơn hàng', 65, 'system', '2026-06-15 18:30:43');
INSERT INTO `orderflow` VALUES ('776fd044-ec15-45aa-b636-690b9a4c897f', 'delivered', 'Tự động xác nhận giao hàng thành công', 83, 'system', '2026-06-16 21:45:08');
INSERT INTO `orderflow` VALUES ('78ad7462-0f4d-4331-aae3-dfb42552f833', 'delivered', 'Tự động xác nhận giao hàng thành công', 82, 'system', '2026-06-16 21:39:08');
INSERT INTO `orderflow` VALUES ('78e1ed6e-bc52-490a-80b1-968380bb28c9', 'delivered', 'Tự động xác nhận giao hàng thành công', 69, 'system', '2026-06-16 16:02:32');
INSERT INTO `orderflow` VALUES ('7986bf65-af81-45f4-a1fc-9d188b9c8b01', 'completed', 'Tự động hoàn tất đơn hàng', 55, 'system', '2026-06-11 15:16:59');
INSERT INTO `orderflow` VALUES ('79a6514f-9cf4-4cd6-b4b8-063f2529fa20', 'shipping', '', 101, '7578ede4-cd3f-4976-8712-3cb87cfc0a21', '2026-06-24 22:36:32');
INSERT INTO `orderflow` VALUES ('7a720398-8a82-4653-896f-f5116855d803', 'delivered', 'Tự động xác nhận giao hàng thành công', 98, 'system', '2026-07-11 11:47:26');
INSERT INTO `orderflow` VALUES ('7bc1c7ad-9b5c-471a-8031-e1157024b2a1', 'confirmed', '', 44, 'bd24206e-d42f-4736-9106-16dca8c687e9', '2026-06-08 17:39:15');
INSERT INTO `orderflow` VALUES ('7ce8a938-43c7-4b43-8f10-a3f2906da0b5', 'completed', 'Tự động hoàn tất đơn hàng', 33, 'system', '2026-06-08 17:01:30');
INSERT INTO `orderflow` VALUES ('7d7fe433-1f20-4dd1-8d4c-6124bc2930f1', 'shipping', '', 58, 'bd24206e-d42f-4736-9106-16dca8c687e9', '2026-06-12 15:09:14');
INSERT INTO `orderflow` VALUES ('7e075c73-476d-4ead-9cb6-776e3d722420', 'shipping', '', 50, 'bd24206e-d42f-4736-9106-16dca8c687e9', '2026-06-11 12:17:19');
INSERT INTO `orderflow` VALUES ('802059d9-c168-4f80-9b1f-3b7023fc6fb8', 'confirmed', '', 89, 'bd24206e-d42f-4736-9106-16dca8c687e9', '2026-06-19 00:18:50');
INSERT INTO `orderflow` VALUES ('80f4b067-4fa4-4724-abf0-b8dbb20aa5d8', 'confirmed', '', 76, 'bd24206e-d42f-4736-9106-16dca8c687e9', '2026-06-16 17:01:37');
INSERT INTO `orderflow` VALUES ('8196884b-4679-4286-a002-b524042f6a7d', 'completed', 'Tự động hoàn tất đơn hàng', 32, 'system', '2026-06-08 17:01:30');
INSERT INTO `orderflow` VALUES ('821b30f5-ac89-48de-ac16-fcab8f0c39ed', 'completed', 'Tự động hoàn tất đơn hàng', 51, 'system', '2026-06-11 12:32:30');
INSERT INTO `orderflow` VALUES ('8422e7d2-c199-4cad-87d8-d136712e3516', 'completed', 'Tự động hoàn tất đơn hàng', 56, 'system', '2026-06-11 15:24:29');
INSERT INTO `orderflow` VALUES ('8542c86a-5e76-4eb5-86ed-a654dfdf91fd', 'confirmed', '', 101, '7578ede4-cd3f-4976-8712-3cb87cfc0a21', '2026-06-24 22:36:29');
INSERT INTO `orderflow` VALUES ('8a7969b0-83a8-45f3-99d8-6d11bc3cf642', 'confirmed', '', 68, 'bd24206e-d42f-4736-9106-16dca8c687e9', '2026-06-15 18:47:30');
INSERT INTO `orderflow` VALUES ('8c08bdbb-d761-496f-8ac0-9535ebd75065', 'confirmed', '', 107, 'bd24206e-d42f-4736-9106-16dca8c687e9', '2026-07-13 18:11:35');
INSERT INTO `orderflow` VALUES ('8c0cc678-c4cc-4bdd-ae35-c39b15ca1c70', 'cancelled', 'không còn hàng', 42, 'bd24206e-d42f-4736-9106-16dca8c687e9', '2026-06-16 16:28:39');
INSERT INTO `orderflow` VALUES ('8d316da4-26c5-48a3-afd4-9f8dd94e095b', 'completed', 'Tự động hoàn tất đơn hàng', 75, 'system', '2026-06-16 16:50:17');
INSERT INTO `orderflow` VALUES ('8ec67d41-0c06-4099-90e5-03e488e34806', 'completed', 'Tự động hoàn tất đơn hàng', 87, 'system', '2026-06-16 22:43:39');
INSERT INTO `orderflow` VALUES ('8fca333b-f113-40f6-a70e-1f0c07b69646', 'delivered', 'Tự động xác nhận giao hàng thành công', 47, 'system', '2026-06-09 22:39:59');
INSERT INTO `orderflow` VALUES ('941824e1-c70d-4b48-b24b-c9d01104ef62', 'confirmed', '', 78, 'bd24206e-d42f-4736-9106-16dca8c687e9', '2026-06-16 20:13:40');
INSERT INTO `orderflow` VALUES ('968ec852-4685-430b-9ed2-88d27b68fcf1', 'confirmed', '', 46, 'bd24206e-d42f-4736-9106-16dca8c687e9', '2026-06-08 18:18:11');
INSERT INTO `orderflow` VALUES ('96ea4bd0-3480-471f-b82f-b198b9a478cb', 'delivered', 'Tự động xác nhận giao hàng thành công', 43, 'system', '2026-07-11 11:47:26');
INSERT INTO `orderflow` VALUES ('986fcdd5-7c45-402e-b5b0-069dba7cbe64', 'confirmed', '', 77, 'bd24206e-d42f-4736-9106-16dca8c687e9', '2026-06-16 17:08:37');
INSERT INTO `orderflow` VALUES ('99aaf72c-67ae-466c-ad05-d773f8495408', 'shipping', '', 109, 'bd24206e-d42f-4736-9106-16dca8c687e9', '2026-07-13 18:11:29');
INSERT INTO `orderflow` VALUES ('9a26308f-bc79-4f78-a4bc-4ce3526eabb9', 'completed', 'Tự động hoàn tất đơn hàng', 83, 'system', '2026-06-16 21:46:38');
INSERT INTO `orderflow` VALUES ('9b481bce-6db3-42d2-8a46-d0ab8e5fa99e', 'shipping', '', 46, 'bd24206e-d42f-4736-9106-16dca8c687e9', '2026-06-08 18:18:22');
INSERT INTO `orderflow` VALUES ('9bcd9d93-556e-43a9-a647-1e6dd2a139b2', 'delivered', 'Tự động xác nhận giao hàng thành công', 81, 'system', '2026-06-16 20:41:01');
INSERT INTO `orderflow` VALUES ('9c129979-f564-4329-bc87-005f3d5456ec', 'confirmed', '', 80, 'bd24206e-d42f-4736-9106-16dca8c687e9', '2026-06-16 20:39:18');
INSERT INTO `orderflow` VALUES ('9c4914b8-003c-413f-a6d7-ab477f6a0467', 'delivered', 'Tự động xác nhận giao hàng thành công', 107, 'system', '2026-07-13 18:13:07');
INSERT INTO `orderflow` VALUES ('9d5bca1e-aa78-4386-8923-6a8792139d99', 'completed', 'Tự động hoàn tất đơn hàng', 72, 'system', '2026-06-16 16:30:52');
INSERT INTO `orderflow` VALUES ('9ec02aa3-cdf2-468e-8e4b-19ed8f5c2b2e', 'confirmed', '', 71, 'bd24206e-d42f-4736-9106-16dca8c687e9', '2026-06-16 16:19:23');
INSERT INTO `orderflow` VALUES ('9ee742f9-bf50-458c-9f0a-714c431d266a', 'confirmed', '', 67, 'bd24206e-d42f-4736-9106-16dca8c687e9', '2026-06-15 18:41:41');
INSERT INTO `orderflow` VALUES ('9f5dbbc7-a2b8-4eac-9bc6-aff4e30e6352', 'confirmed', '', 64, 'bd24206e-d42f-4736-9106-16dca8c687e9', '2026-06-15 17:34:41');
INSERT INTO `orderflow` VALUES ('9f978590-15af-4c4e-8136-70473257e29d', 'confirmed', '', 85, 'bd24206e-d42f-4736-9106-16dca8c687e9', '2026-06-16 22:11:30');
INSERT INTO `orderflow` VALUES ('9fa29857-d5da-4992-af1c-35e6e1311047', 'delivered', 'Tự động xác nhận giao hàng thành công', 77, 'system', '2026-06-16 17:09:49');
INSERT INTO `orderflow` VALUES ('9fecd60a-225d-4f31-80ed-02feca3ad0a9', 'shipping', '', 51, 'bd24206e-d42f-4736-9106-16dca8c687e9', '2026-06-11 12:29:53');
INSERT INTO `orderflow` VALUES ('a0b5e818-e835-406b-9872-f121139eeb6f', 'completed', 'Tự động hoàn tất đơn hàng', 77, 'system', '2026-06-16 17:11:19');
INSERT INTO `orderflow` VALUES ('a596cb33-2b43-4ece-b545-9932704ee99c', 'completed', 'Tự động hoàn tất đơn hàng', 80, 'system', '2026-06-16 20:42:01');
INSERT INTO `orderflow` VALUES ('a629bd88-66fe-44eb-8bc4-bb77ba581f90', 'delivered', 'Tự động xác nhận giao hàng thành công', 46, 'system', '2026-06-08 18:19:37');
INSERT INTO `orderflow` VALUES ('a73723ff-ac48-4fde-91ea-44b004147b60', 'confirmed', '', 56, 'bd24206e-d42f-4736-9106-16dca8c687e9', '2026-06-11 15:21:28');
INSERT INTO `orderflow` VALUES ('a877b34d-ea6b-4cf9-ac5c-1f1b9e091a62', 'completed', 'Tự động hoàn tất đơn hàng', 53, 'system', '2026-06-11 12:55:31');
INSERT INTO `orderflow` VALUES ('a97cad10-c123-4e13-8de2-c0d66a3c1290', 'shipping', '', 105, 'bd24206e-d42f-4736-9106-16dca8c687e9', '2026-07-11 11:46:04');
INSERT INTO `orderflow` VALUES ('aa98ffa1-1add-4167-a715-ae44e15dba9c', 'shipping', '', 55, 'bd24206e-d42f-4736-9106-16dca8c687e9', '2026-06-11 15:14:11');
INSERT INTO `orderflow` VALUES ('ac3f7694-1656-472a-b4e9-afd955636a8b', 'completed', 'Tự động hoàn tất đơn hàng', 70, 'system', '2026-06-16 16:09:02');
INSERT INTO `orderflow` VALUES ('ae2b7417-1f10-4ed9-bdb9-dca100c5ce9f', 'completed', 'Tự động hoàn tất đơn hàng', 79, 'system', '2026-06-16 20:23:31');
INSERT INTO `orderflow` VALUES ('af207707-0928-48a3-98fd-de3eda7bb80a', 'shipping', '', 45, 'bd24206e-d42f-4736-9106-16dca8c687e9', '2026-06-08 18:22:11');
INSERT INTO `orderflow` VALUES ('aff1583a-3dcd-4898-9035-33111d658bce', 'shipping', '', 44, 'bd24206e-d42f-4736-9106-16dca8c687e9', '2026-06-08 17:40:59');
INSERT INTO `orderflow` VALUES ('b1c529b4-2f9a-4c82-ba2c-1518ac30e742', 'delivered', 'Tự động xác nhận giao hàng thành công', 74, 'system', '2026-06-16 16:43:46');
INSERT INTO `orderflow` VALUES ('b2c17b8d-3d88-42c0-b500-cb91d3cee21f', 'delivered', 'Tự động xác nhận giao hàng thành công', 94, 'system', '2026-06-24 20:44:35');
INSERT INTO `orderflow` VALUES ('b36d06f7-46bc-4e08-b507-e45a8882b067', 'confirmed', '', 94, 'bd24206e-d42f-4736-9106-16dca8c687e9', '2026-06-24 20:43:23');
INSERT INTO `orderflow` VALUES ('b39d0244-0144-4bb1-bf55-bfc80969a387', 'shipping', '', 72, 'bd24206e-d42f-4736-9106-16dca8c687e9', '2026-06-16 16:28:00');
INSERT INTO `orderflow` VALUES ('b3af98c4-ec51-44d1-a643-b302ecce0cdf', 'completed', 'Tự động hoàn tất đơn hàng', 42, 'system', '2026-06-08 17:01:30');
INSERT INTO `orderflow` VALUES ('b54732be-d30a-4241-a4c7-9c8812af250e', 'shipping', '', 76, 'bd24206e-d42f-4736-9106-16dca8c687e9', '2026-06-16 17:02:14');
INSERT INTO `orderflow` VALUES ('b5a0d752-7702-44d7-ac0e-caa8bc7e1542', 'confirmed', '', 43, 'bd24206e-d42f-4736-9106-16dca8c687e9', '2026-06-04 15:17:34');
INSERT INTO `orderflow` VALUES ('b5bd8aea-7fb2-4c21-8315-b8db207e5fca', 'shipping', '', 69, 'bd24206e-d42f-4736-9106-16dca8c687e9', '2026-06-16 16:01:13');
INSERT INTO `orderflow` VALUES ('b65aba62-9879-4a0a-8953-75946b1b876e', 'shipping', '', 94, 'bd24206e-d42f-4736-9106-16dca8c687e9', '2026-06-24 20:43:26');
INSERT INTO `orderflow` VALUES ('b7429c81-f9c7-4e38-9355-e26d22960eec', 'completed', 'Tự động hoàn tất đơn hàng', 107, 'system', '2026-07-13 18:14:38');
INSERT INTO `orderflow` VALUES ('b820bb2f-84aa-453f-81e5-3f2ec03ef30c', 'shipping', '', 108, 'bd24206e-d42f-4736-9106-16dca8c687e9', '2026-07-13 18:11:33');
INSERT INTO `orderflow` VALUES ('b9c2701e-5e90-4db5-8810-14a7763fb6cb', 'shipping', '', 49, 'bd24206e-d42f-4736-9106-16dca8c687e9', '2026-06-10 21:58:27');
INSERT INTO `orderflow` VALUES ('b9e39a65-abde-42d3-9f22-79d9c1f11ff5', 'delivered', 'Tự động xác nhận giao hàng thành công', 79, 'system', '2026-06-16 20:22:30');
INSERT INTO `orderflow` VALUES ('bb749e0e-b352-4d1c-bc3c-1ea5a921e36e', 'confirmed', '', 83, 'bd24206e-d42f-4736-9106-16dca8c687e9', '2026-06-16 21:43:37');
INSERT INTO `orderflow` VALUES ('bbdee4b6-27b7-4e64-bacd-e3bc8eeeea8f', 'delivered', 'Tự động xác nhận giao hàng thành công', 85, 'system', '2026-06-16 22:12:48');
INSERT INTO `orderflow` VALUES ('bccfa42a-3834-4acd-84eb-cad111bd562e', 'confirmed', '', 91, 'bd24206e-d42f-4736-9106-16dca8c687e9', '2026-06-19 00:28:05');
INSERT INTO `orderflow` VALUES ('c10d8fd1-51c1-427b-b3f3-fa600e030682', 'completed', 'Tự động hoàn tất đơn hàng', 69, 'system', '2026-06-16 16:04:02');
INSERT INTO `orderflow` VALUES ('c2d5c231-bf93-42c0-8a00-bd8d75deffa2', 'cancelled', '', 44, 'bd24206e-d42f-4736-9106-16dca8c687e9', '2026-06-23 17:35:55');
INSERT INTO `orderflow` VALUES ('c3308383-ffe7-4fcd-993a-a4584d655f67', 'delivered', 'Tự động xác nhận giao hàng thành công', 56, 'system', '2026-06-11 15:22:59');
INSERT INTO `orderflow` VALUES ('c41cdc3a-71bc-42fd-a112-1ab16a226378', 'confirmed', '', 55, 'bd24206e-d42f-4736-9106-16dca8c687e9', '2026-06-11 15:14:03');
INSERT INTO `orderflow` VALUES ('c4ca3037-caeb-428e-9636-1586ced0b759', 'completed', 'Tự động hoàn tất đơn hàng', 76, 'system', '2026-06-16 17:05:11');
INSERT INTO `orderflow` VALUES ('c57f9cb8-acde-4d82-8bc2-857bf7338685', 'completed', 'Tự động hoàn tất đơn hàng', 95, 'system', '2026-06-24 20:57:05');
INSERT INTO `orderflow` VALUES ('c596f04d-683e-48ee-a998-0f404ffcaed1', 'shipping', '', 52, 'bd24206e-d42f-4736-9106-16dca8c687e9', '2026-06-11 12:44:58');
INSERT INTO `orderflow` VALUES ('c67fa69c-a4e0-40bc-b7c8-c7b44765c21a', 'delivered', 'Tự động xác nhận giao hàng thành công', 78, 'system', '2026-06-16 20:15:00');
INSERT INTO `orderflow` VALUES ('c6df9ebe-bbf0-4e06-901a-6b8ceaff8b51', 'delivered', 'Tự động xác nhận giao hàng thành công', 80, 'system', '2026-06-16 20:40:31');
INSERT INTO `orderflow` VALUES ('c710bd5e-a4a6-42b3-9f8c-469920b56ee2', 'shipping', '', 66, 'bd24206e-d42f-4736-9106-16dca8c687e9', '2026-06-15 18:36:09');
INSERT INTO `orderflow` VALUES ('c7136a14-6d53-4df8-9e9c-7dfdc1ca68be', 'completed', 'Tự động hoàn tất đơn hàng', 86, 'system', '2026-06-16 22:35:49');
INSERT INTO `orderflow` VALUES ('c79ddd89-3103-433a-a9c3-b01978e24cf8', 'completed', 'Tự động hoàn tất đơn hàng', 44, 'system', '2026-06-08 17:43:31');
INSERT INTO `orderflow` VALUES ('c97be2b0-164a-4c71-bd41-3e962ac104c3', 'completed', 'Tự động hoàn tất đơn hàng', 40, 'system', '2026-06-08 17:01:30');
INSERT INTO `orderflow` VALUES ('cae73aff-06ff-4eb0-a993-f4f9e2eb8ea9', 'delivered', 'Tự động xác nhận giao hàng thành công', 51, 'system', '2026-06-11 12:31:00');
INSERT INTO `orderflow` VALUES ('cae8e264-625d-4205-8733-553f3f8fdccd', 'delivered', 'Tự động xác nhận giao hàng thành công', 88, 'system', '2026-06-17 21:15:45');
INSERT INTO `orderflow` VALUES ('cbae4376-71db-442b-ad71-8009be2a25aa', 'shipping', '', 70, 'bd24206e-d42f-4736-9106-16dca8c687e9', '2026-06-16 16:06:14');
INSERT INTO `orderflow` VALUES ('cbdd84ad-aa3d-4c53-a866-70f92af95aea', 'delivered', 'Tự động xác nhận giao hàng thành công', 92, 'system', '2026-06-19 00:38:23');
INSERT INTO `orderflow` VALUES ('cc49aa1d-3366-42cc-81df-27390f1f86c8', 'completed', 'Tự động hoàn tất đơn hàng', 100, 'system', '2026-06-24 21:54:19');
INSERT INTO `orderflow` VALUES ('cc8ddd36-f9ce-43cf-b23a-62936a896600', 'shipping', '', 110, 'bd24206e-d42f-4736-9106-16dca8c687e9', '2026-07-13 18:11:27');
INSERT INTO `orderflow` VALUES ('cdfa56bc-9fc3-4ccb-8a82-ace67358318c', 'shipping', '', 59, 'bd24206e-d42f-4736-9106-16dca8c687e9', '2026-06-11 16:49:46');
INSERT INTO `orderflow` VALUES ('ce01a2dd-8d7a-4248-882d-c4beb0002c46', 'completed', 'Tự động hoàn tất đơn hàng', 78, 'system', '2026-06-16 20:16:30');
INSERT INTO `orderflow` VALUES ('cf49ff88-31f4-46ee-970e-c8f496f44611', 'confirmed', '', 70, 'bd24206e-d42f-4736-9106-16dca8c687e9', '2026-06-16 16:06:12');
INSERT INTO `orderflow` VALUES ('cf51ed8c-096f-42e2-997d-d45e167c37dc', 'completed', 'Tự động hoàn tất đơn hàng', 109, 'system', '2026-07-13 18:14:08');
INSERT INTO `orderflow` VALUES ('d11ef714-4d28-4952-b9a7-59f9d862cdcf', 'shipping', '', 82, 'bd24206e-d42f-4736-9106-16dca8c687e9', '2026-06-16 21:37:47');
INSERT INTO `orderflow` VALUES ('d1a1d6cf-8189-4ad6-9e4b-a932c313ab3c', 'confirmed', '', 50, 'bd24206e-d42f-4736-9106-16dca8c687e9', '2026-06-11 12:17:18');
INSERT INTO `orderflow` VALUES ('d1abfe3c-1e4a-425a-8b6b-f226801f2b35', 'confirmed', '', 88, 'bd24206e-d42f-4736-9106-16dca8c687e9', '2026-06-17 21:09:27');
INSERT INTO `orderflow` VALUES ('d1c74bf9-9cc0-4f26-9156-ba71a17b4cd0', 'completed', 'Tự động hoàn tất đơn hàng', 63, 'system', '2026-06-15 17:31:08');
INSERT INTO `orderflow` VALUES ('d4db99eb-62c5-47b5-bd34-f0056e84b29c', 'shipping', '', 77, 'bd24206e-d42f-4736-9106-16dca8c687e9', '2026-06-16 17:08:39');
INSERT INTO `orderflow` VALUES ('d984fea4-f185-4fac-8576-23c56cb90728', 'shipping', '', 83, 'bd24206e-d42f-4736-9106-16dca8c687e9', '2026-06-16 21:43:39');
INSERT INTO `orderflow` VALUES ('da06741b-58b5-4498-b375-dd0b6c08ff24', 'shipping', '', 73, 'bd24206e-d42f-4736-9106-16dca8c687e9', '2026-06-16 16:32:43');
INSERT INTO `orderflow` VALUES ('da58704c-7e1d-4b8b-ba9d-1f9ff483246d', 'confirmed', '', 86, 'bd24206e-d42f-4736-9106-16dca8c687e9', '2026-06-16 22:33:13');
INSERT INTO `orderflow` VALUES ('da5a0507-de75-43d8-a70a-0cb64a89dd7f', 'completed', 'Tự động hoàn tất đơn hàng', 108, 'system', '2026-07-13 18:14:08');
INSERT INTO `orderflow` VALUES ('da72f1e9-40ce-4782-898c-26daaa7c9079', 'shipping', '', 84, 'bd24206e-d42f-4736-9106-16dca8c687e9', '2026-06-16 21:56:32');
INSERT INTO `orderflow` VALUES ('dc44a0b0-cf4a-4c96-b287-6fbdf02a7d7a', 'shipping', '', 80, 'bd24206e-d42f-4736-9106-16dca8c687e9', '2026-06-16 20:39:20');
INSERT INTO `orderflow` VALUES ('dd6a5377-e5de-4bec-9788-30f5ef5af0aa', 'completed', 'Tự động hoàn tất đơn hàng', 106, 'system', '2026-07-13 18:14:38');
INSERT INTO `orderflow` VALUES ('df5451e8-0562-4f69-9e6a-f08c5e2f8ab6', 'shipping', '', 56, 'bd24206e-d42f-4736-9106-16dca8c687e9', '2026-06-11 15:21:31');
INSERT INTO `orderflow` VALUES ('e0cac56f-8b8f-4408-86ce-94b0a5fdd3d4', 'delivered', 'Tự động xác nhận giao hàng thành công', 44, 'system', '2026-06-08 17:42:01');
INSERT INTO `orderflow` VALUES ('e1126200-543d-4f30-95ca-dff8cffc585c', 'completed', 'Tự động hoàn tất đơn hàng', 105, 'system', '2026-07-11 11:48:56');
INSERT INTO `orderflow` VALUES ('e14b6136-1195-42af-967c-1e2dbef043e4', 'shipping', '', 86, 'bd24206e-d42f-4736-9106-16dca8c687e9', '2026-06-16 22:33:16');
INSERT INTO `orderflow` VALUES ('e2501dd7-9dc0-4744-957b-6725b1195228', 'completed', 'Tự động hoàn tất đơn hàng', 85, 'system', '2026-06-16 22:14:18');
INSERT INTO `orderflow` VALUES ('e4aaacf1-e7a8-4d07-b5b0-764414abe449', 'delivered', 'Tự động xác nhận giao hàng thành công', 67, 'system', '2026-06-15 18:42:46');
INSERT INTO `orderflow` VALUES ('e4bfc679-d90d-47f3-a1ce-af70c978ad71', 'completed', 'Tự động hoàn tất đơn hàng', 93, 'system', '2026-06-19 10:05:15');
INSERT INTO `orderflow` VALUES ('e857a92c-ac2a-408f-9cfb-c29af651606b', 'shipping', '', 79, 'bd24206e-d42f-4736-9106-16dca8c687e9', '2026-06-16 20:21:22');
INSERT INTO `orderflow` VALUES ('e941aedd-5daa-4d63-a8c2-8374f4c8a9f3', 'completed', 'Tự động hoàn tất đơn hàng', 90, 'system', '2026-06-19 00:22:17');
INSERT INTO `orderflow` VALUES ('e9730a87-5b49-4409-bbce-06e7e133c00b', 'completed', 'Tự động hoàn tất đơn hàng', 71, 'system', '2026-06-16 16:22:00');
INSERT INTO `orderflow` VALUES ('e9b34e2d-cfcc-46d0-be6f-f3f54018a59e', 'confirmed', '', 82, 'bd24206e-d42f-4736-9106-16dca8c687e9', '2026-06-16 21:37:46');
INSERT INTO `orderflow` VALUES ('ebac1678-9472-4136-8b5e-b385096adff1', 'confirmed', '', 104, 'bd24206e-d42f-4736-9106-16dca8c687e9', '2026-07-09 16:16:39');
INSERT INTO `orderflow` VALUES ('ec4f4e5b-cec7-431d-868e-832dca762d33', 'delivered', 'Tự động xác nhận giao hàng thành công', 45, 'system', '2026-06-08 18:23:37');
INSERT INTO `orderflow` VALUES ('ed9e90b4-cc03-430b-9a72-0fe70e4ffefc', 'completed', 'Tự động hoàn tất đơn hàng', 92, 'system', '2026-06-19 00:39:53');
INSERT INTO `orderflow` VALUES ('edecc0ba-1f8d-4cab-816a-38ebdcd8f15a', 'completed', 'Tự động hoàn tất đơn hàng', 46, 'system', '2026-06-08 18:21:07');
INSERT INTO `orderflow` VALUES ('f4beed29-3a8d-4760-871e-ce742606977b', 'delivered', 'Tự động xác nhận giao hàng thành công', 75, 'system', '2026-06-16 16:48:47');
INSERT INTO `orderflow` VALUES ('f4de7535-81ef-4fa5-9f55-331ee497d956', 'confirmed', '', 69, 'bd24206e-d42f-4736-9106-16dca8c687e9', '2026-06-16 16:01:12');
INSERT INTO `orderflow` VALUES ('f505b0a2-d991-437e-b1a5-3f399f89d801', 'completed', 'Tự động hoàn tất đơn hàng', 35, 'system', '2026-06-08 17:01:30');
INSERT INTO `orderflow` VALUES ('f61b3780-ea0c-4872-904c-8c94c199a258', 'shipping', '', 89, 'bd24206e-d42f-4736-9106-16dca8c687e9', '2026-06-19 00:18:51');
INSERT INTO `orderflow` VALUES ('f69ba54e-7263-4815-a4ba-83079dd568e7', 'confirmed', '', 72, 'bd24206e-d42f-4736-9106-16dca8c687e9', '2026-06-16 16:27:58');
INSERT INTO `orderflow` VALUES ('f8caa652-aa8d-4d4a-a80d-e04c7fa14aa3', 'delivered', 'Tự động xác nhận giao hàng thành công', 73, 'system', '2026-06-16 16:33:52');
INSERT INTO `orderflow` VALUES ('f8f5970f-dd13-413e-bf75-153a521a19fa', 'completed', 'Tự động hoàn tất đơn hàng', 50, 'system', '2026-06-11 12:19:59');
INSERT INTO `orderflow` VALUES ('f9e37428-143d-475c-a376-e035e0f3506e', 'confirmed', '', 47, 'bd24206e-d42f-4736-9106-16dca8c687e9', '2026-06-09 22:38:41');
INSERT INTO `orderflow` VALUES ('faad5936-1389-43a2-914c-2a7762fe189d', 'confirmed', '', 108, 'bd24206e-d42f-4736-9106-16dca8c687e9', '2026-07-13 18:11:31');
INSERT INTO `orderflow` VALUES ('fb0dea30-8897-4af2-be67-b9721618cc75', 'completed', 'Tự động hoàn tất đơn hàng', 67, 'system', '2026-06-15 18:44:17');
INSERT INTO `orderflow` VALUES ('fb30e6ce-e573-473a-9bac-c0c2cc4981b8', 'delivered', 'Tự động xác nhận giao hàng thành công', 65, 'system', '2026-06-15 18:29:13');
INSERT INTO `orderflow` VALUES ('fb3b23af-c135-4a08-a89c-bda46668babd', 'completed', 'Tự động hoàn tất đơn hàng', 59, 'system', '2026-06-11 16:52:21');
INSERT INTO `orderflow` VALUES ('fbd420ae-dc52-4228-b6f7-251abfaa0abf', 'completed', 'Tự động hoàn tất đơn hàng', 88, 'system', '2026-06-17 21:16:46');
INSERT INTO `orderflow` VALUES ('fbe4ff73-8483-4d14-b14d-3a84184b7d58', 'delivered', 'Tự động xác nhận giao hàng thành công', 48, 'system', '2026-06-10 17:30:29');
INSERT INTO `orderflow` VALUES ('fc7c5cc2-8e0e-492f-851d-463707651347', 'confirmed', '', 49, 'bd24206e-d42f-4736-9106-16dca8c687e9', '2026-06-10 21:58:24');
INSERT INTO `orderflow` VALUES ('fcd2fab5-d047-4bc3-9f9d-8b7c5a7e40de', 'delivered', 'Tự động xác nhận giao hàng thành công', 106, 'system', '2026-07-13 18:13:07');
INSERT INTO `orderflow` VALUES ('fda389c5-a927-4802-b05e-8462ccc3186b', 'completed', 'Tự động hoàn tất đơn hàng', 98, 'system', '2026-07-11 11:48:56');
INSERT INTO `orderflow` VALUES ('feaff959-5fb3-42e4-8b49-db13d64320a1', 'completed', 'Tự động hoàn tất đơn hàng', 45, 'system', '2026-06-08 18:25:07');
INSERT INTO `orderflow` VALUES ('ff151dc8-188c-4f25-bf16-870b77f419b1', 'completed', 'Tự động hoàn tất đơn hàng', 49, 'system', '2026-06-10 22:01:27');
INSERT INTO `orderflow` VALUES ('ff7cb4fc-a7c9-4700-9446-7f3bd7913f01', 'confirmed', '', 51, 'bd24206e-d42f-4736-9106-16dca8c687e9', '2026-06-11 12:29:52');

-- ----------------------------
-- Table structure for orderrefund
-- ----------------------------
DROP TABLE IF EXISTS `orderrefund`;
CREATE TABLE `orderrefund`  (
  `id` int NOT NULL AUTO_INCREMENT,
  `order_id` int NOT NULL,
  `status` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL DEFAULT 'pending' COMMENT 'pending | approved | rejected | completed',
  `title` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL,
  `description` text CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL,
  `created_by` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`) USING BTREE,
  INDEX `idx_refund_order`(`order_id` ASC) USING BTREE,
  CONSTRAINT `fk_refund_order` FOREIGN KEY (`order_id`) REFERENCES `order` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE = InnoDB AUTO_INCREMENT = 1 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_general_ci COMMENT = 'Yêu cầu hoàn trả đơn hàng' ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of orderrefund
-- ----------------------------

-- ----------------------------
-- Table structure for productorder
-- ----------------------------
DROP TABLE IF EXISTS `productorder`;
CREATE TABLE `productorder`  (
  `id` int NOT NULL AUTO_INCREMENT,
  `order_id` int NOT NULL,
  `price_after` float NOT NULL,
  `price_before` float NOT NULL,
  `product_id` int NOT NULL,
  `quantity` int NOT NULL,
  `size` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL,
  `color` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL,
  `product_name` varchar(500) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL,
  `product_image` varchar(1000) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL,
  PRIMARY KEY (`id`) USING BTREE,
  INDEX `FKm3bb2ofs70so7ef7hr734b5k7`(`order_id` ASC) USING BTREE,
  CONSTRAINT `FKm3bb2ofs70so7ef7hr734b5k7` FOREIGN KEY (`order_id`) REFERENCES `order` (`id`) ON DELETE RESTRICT ON UPDATE RESTRICT
) ENGINE = InnoDB AUTO_INCREMENT = 90 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_general_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of productorder
-- ----------------------------
INSERT INTO `productorder` VALUES (1, 25, 179000, 250000, 1, 1, 'S', 'Trắng', 'Áo Thun Nam Basic Oversize Cotton', 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&h=400&fit=crop');
INSERT INTO `productorder` VALUES (2, 26, 179000, 250000, 1, 1, 'S', 'Trắng', 'Áo Thun Nam Basic Oversize Cotton', 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&h=400&fit=crop');
INSERT INTO `productorder` VALUES (3, 27, 320000, 450000, 2, 1, 'M', 'Navy', 'Áo Polo Nam Cổ Bẻ Premium', 'https://picsum.photos/seed/polo/400/400');
INSERT INTO `productorder` VALUES (4, 28, 320000, 450000, 2, 1, 'M', 'Navy', 'Áo Polo Nam Cổ Bẻ Premium', 'https://picsum.photos/seed/polo/400/400');
INSERT INTO `productorder` VALUES (5, 29, 320000, 450000, 2, 1, 'M', 'Navy', 'Áo Polo Nam Cổ Bẻ Premium', 'https://picsum.photos/seed/polo/400/400');
INSERT INTO `productorder` VALUES (6, 30, 320000, 450000, 2, 1, 'M', 'Navy', 'Áo Polo Nam Cổ Bẻ Premium', 'https://picsum.photos/seed/polo/400/400');
INSERT INTO `productorder` VALUES (7, 31, 179000, 250000, 1, 1, 'S', 'Trắng', 'Áo Thun Nam Basic Oversize Cotton', 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&h=400&fit=crop');
INSERT INTO `productorder` VALUES (8, 32, 289000, 380000, 3, 1, NULL, NULL, 'Áo Sơ Mi Nữ Linen Cổ V', 'https://images.unsplash.com/photo-1598554747436-c9293d6a588f?w=400&h=400&fit=crop');
INSERT INTO `productorder` VALUES (9, 33, 129000, 180000, 6, 1, NULL, NULL, 'Áo Crop Top Nữ Thun Gân', 'https://picsum.photos/seed/croptop/400/400');
INSERT INTO `productorder` VALUES (10, 34, 499000, 650000, 4, 1, NULL, NULL, 'Áo Khoác Jean Unisex Vintage', 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=400&h=400&fit=crop');
INSERT INTO `productorder` VALUES (11, 35, 420000, 590000, 13, 1, NULL, NULL, 'Đầm Wrap Đơn Giản Màu Trơn', 'https://images.unsplash.com/photo-1496747611176-843222e1e57c?w=400&h=400&fit=crop');
INSERT INTO `productorder` VALUES (12, 36, 199000, 280000, 16, 1, NULL, NULL, 'Túi Tote Canvas In Chữ Minimalist', 'https://picsum.photos/seed/totebag/400/400');
INSERT INTO `productorder` VALUES (13, 37, 199000, 280000, 16, 1, NULL, NULL, 'Túi Tote Canvas In Chữ Minimalist', 'https://picsum.photos/seed/totebag/400/400');
INSERT INTO `productorder` VALUES (14, 38, 129000, 180000, 19, 1, NULL, NULL, 'Mũ Bucket Hat Unisex Phong Cách', 'https://picsum.photos/seed/buckethat/400/400');
INSERT INTO `productorder` VALUES (15, 39, 490000, 680000, 11, 1, NULL, NULL, 'Đầm Maxi Hoa Nhí Mùa Hè', 'https://images.unsplash.com/photo-1572804013427-4d7ca7268217?w=400&h=400&fit=crop');
INSERT INTO `productorder` VALUES (16, 40, 179000, 250000, 1, 1, 'S', 'Trắng', 'Áo Thun Nam Basic Oversize Cotton', 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&h=400&fit=crop');
INSERT INTO `productorder` VALUES (17, 41, 320000, 450000, 2, 1, 'M', 'Navy', 'Áo Polo Nam Cổ Bẻ Premium', 'https://picsum.photos/seed/polo/400/400');
INSERT INTO `productorder` VALUES (18, 42, 605500, 605500, 256, 1, 'Mặc định', 'Tiêu chuẩn', 'Nến thơm Cattail sáp dừa', NULL);
INSERT INTO `productorder` VALUES (19, 43, 123000, 123000, 2021, 1, NULL, NULL, 'Áo', NULL);
INSERT INTO `productorder` VALUES (20, 44, 3936250, 3936250, 2020, 1, NULL, NULL, 'Thớt quả óc chó Chạng vạng cuối hạt', NULL);
INSERT INTO `productorder` VALUES (21, 45, 1117000, 1117000, 2014, 1, 'Mặc định', 'Tiêu chuẩn', 'Nhẫn pha lê Cloudberry thô', NULL);
INSERT INTO `productorder` VALUES (22, 46, 888750, 888750, 2018, 1, 'Mặc định', 'Tiêu chuẩn', 'Vòng Hoa Trâu Khô', NULL);
INSERT INTO `productorder` VALUES (23, 47, 123000, 123000, 2021, 1, NULL, NULL, 'Áo', NULL);
INSERT INTO `productorder` VALUES (24, 48, 768500, 768500, 512, 1, 'Mặc định', 'Tiêu chuẩn', 'Nến thơm sáp dừa Pebble Beach', NULL);
INSERT INTO `productorder` VALUES (25, 49, 604750, 806500, 4, 1, 'Mặc định', 'Tiêu chuẩn', 'Vòng cổ Duran Duran, Lấy cảm hứng từ những năm 1980, Quạt Duranie cổ điển, Kitsch Quirky, Ngôi sao nhạc rock tùy chỉnh, Mặt dây chuyền vui nhộn dành cho người nổi tiếng, Đôi cánh thiên thần đen', 'https://i.etsystatic.com/6200968/r/il/90a7c3/5568833466/il_fullxfull.5568833466_g6k2.jpg');
INSERT INTO `productorder` VALUES (26, 50, 888750, 888750, 2018, 1, 'Mặc định', 'Tiêu chuẩn', 'Vòng Hoa Trâu Khô', 'https://placeholder.com/product/2018/image_1.jpg');
INSERT INTO `productorder` VALUES (27, 51, 1275500, 1275500, 2012, 1, 'Mặc định', 'Tiêu chuẩn', 'Bông tai pha lê hình quả việt quất có dây', 'https://placeholder.com/product/2012/image_1.jpg');
INSERT INTO `productorder` VALUES (28, 52, 255750, 255750, 2002, 1, 'Mặc định', 'Tiêu chuẩn', 'Thiệp cưới màu nước táo gai', 'https://placeholder.com/product/2002/image_1.jpg');
INSERT INTO `productorder` VALUES (29, 53, 5023750, 5023750, 1994, 1, 'Mặc định', 'Tiêu chuẩn', 'Ba lô vải cây ngưu bàng sáp', 'https://placeholder.com/product/1994/image_1.jpg');
INSERT INTO `productorder` VALUES (30, 54, 120000, 120000, 2022, 1, NULL, NULL, 'Quần jean in chữ A', NULL);
INSERT INTO `productorder` VALUES (31, 55, 100000, 122300, 2023, 1, NULL, NULL, 'Túi cá sấu', NULL);
INSERT INTO `productorder` VALUES (32, 56, 425000, 425000, 1, 1, NULL, NULL, 'Vòng tay Dumortierite 6 mm- Chất lượng AAA: Kiên nhẫn, Tinh thần minh mẫn & Hỗ trợ', 'https://i.etsystatic.com/25427589/r/il/848216/3119872288/il_fullxfull.3119872288_qvmn.jpg');
INSERT INTO `productorder` VALUES (33, 56, 265250, 265250, 18, 1, NULL, NULL, '29 Màu, Vòng tay tạ, Vòng tay quyến rũ tạ, Vòng tay nam - nữ, Quà tặng cho nam và nữ, Nâng tạ CrossFit Fitness', 'https://i.etsystatic.com/20515470/r/il/dddd56/3276598652/il_fullxfull.3276598652_qvgp.jpg');
INSERT INTO `productorder` VALUES (34, 57, 120000, 120000, 2022, 1, NULL, NULL, 'Quần jean in chữ A', NULL);
INSERT INTO `productorder` VALUES (35, 58, 123000, 123000, 2021, 1, NULL, NULL, 'Áo', NULL);
INSERT INTO `productorder` VALUES (36, 59, 123000, 123000, 2021, 1, NULL, NULL, 'Áo', NULL);
INSERT INTO `productorder` VALUES (37, 60, 1275500, 1275500, 2012, 1, 'Mặc định', 'Tiêu chuẩn', 'Bông tai pha lê hình quả việt quất có dây', 'https://placeholder.com/product/2012/image_1.jpg');
INSERT INTO `productorder` VALUES (38, 61, 100000, 122300, 2023, 1, NULL, NULL, 'Túi cá sấu', NULL);
INSERT INTO `productorder` VALUES (39, 62, 3936250, 3936250, 2020, 1, 'Mặc định', 'Tiêu chuẩn', 'Thớt quả óc chó Chạng vạng cuối hạt', 'https://placeholder.com/product/2020/image_1.jpg');
INSERT INTO `productorder` VALUES (40, 63, 888750, 888750, 2018, 1, 'Mặc định', 'Tiêu chuẩn', 'Vòng Hoa Trâu Khô', 'https://i.etsystatic.com/13074066/r/il/d55316/5559984582/il_1588xN.5559984582_djtx.jpg');
INSERT INTO `productorder` VALUES (41, 64, 1297000, 1297000, 2017, 1, 'Mặc định', 'Tiêu chuẩn', 'Macramé Hackberry treo tường', 'https://i.etsystatic.com/28442333/r/il/54484f/8065841513/il_1588xN.8065841513_nbu7.jpg');
INSERT INTO `productorder` VALUES (42, 65, 1222220, 3487750, 2019, 1, 'Mặc định', 'Tiêu chuẩn', 'Kệ Gỗ Aurora Chạm Khắc Bằng Tay', 'https://i.etsystatic.com/58686080/r/il/2e2bc4/7326536733/il_1588xN.7326536733_byc8.jpg');
INSERT INTO `productorder` VALUES (43, 66, 3936250, 3936250, 2020, 1, 'Mặc định', 'Tiêu chuẩn', 'Thớt quả óc chó Chạng vạng cuối hạt', 'https://i.etsystatic.com/61760164/r/il/54f51a/8083171940/il_1588xN.8083171940_qtuu.jpg');
INSERT INTO `productorder` VALUES (44, 67, 3936250, 3936250, 2020, 1, NULL, NULL, 'Thớt quả óc chó Chạng vạng cuối hạt', 'https://i.etsystatic.com/61760164/r/il/54f51a/8083171940/il_1588xN.8083171940_qtuu.jpg');
INSERT INTO `productorder` VALUES (45, 67, 3487750, 3487750, 2019, 1, NULL, NULL, 'Kệ Gỗ Aurora Chạm Khắc Bằng Tay', 'https://i.etsystatic.com/58686080/r/il/2e2bc4/7326536733/il_1588xN.7326536733_byc8.jpg');
INSERT INTO `productorder` VALUES (46, 68, 100000, 122300, 2023, 1, NULL, NULL, 'Túi cá sấu', NULL);
INSERT INTO `productorder` VALUES (47, 69, 120000, 120000, 2022, 1, NULL, NULL, 'Quần jean in chữ A', NULL);
INSERT INTO `productorder` VALUES (48, 70, 123000, 123000, 2021, 1, NULL, NULL, 'Áo', NULL);
INSERT INTO `productorder` VALUES (49, 71, 876500, 876500, 2016, 1, 'Mặc định', 'Tiêu chuẩn', 'Nến thơm Bearberry sáp dừa', 'https://placeholder.com/product/2016/image_1.jpg');
INSERT INTO `productorder` VALUES (50, 72, 604750, 806500, 4, 1, 'Mặc định', 'Tiêu chuẩn', 'Vòng cổ Duran Duran, Lấy cảm hứng từ những năm 1980, Quạt Duranie cổ điển, Kitsch Quirky, Ngôi sao nhạc rock tùy chỉnh, Mặt dây chuyền vui nhộn dành cho người nổi tiếng, Đôi cánh thiên thần đen', 'https://i.etsystatic.com/6200968/r/il/90a7c3/5568833466/il_fullxfull.5568833466_g6k2.jpg');
INSERT INTO `productorder` VALUES (51, 73, 571500, 571500, 2013, 1, 'Mặc định', 'Tiêu chuẩn', 'Vòng xếp chồng Crowberry được đóng dấu bằng tay', 'https://placeholder.com/product/2013/image_1.jpg');
INSERT INTO `productorder` VALUES (52, 74, 3936250, 3936250, 2020, 1, 'Mặc định', 'Tiêu chuẩn', 'Thớt quả óc chó Chạng vạng cuối hạt', 'https://i.etsystatic.com/61760164/r/il/54f51a/8083171940/il_1588xN.8083171940_qtuu.jpg');
INSERT INTO `productorder` VALUES (53, 75, 888750, 888750, 2018, 1, 'Mặc định', 'Tiêu chuẩn', 'Vòng Hoa Trâu Khô', 'https://i.etsystatic.com/13074066/r/il/d55316/5559984582/il_1588xN.5559984582_djtx.jpg');
INSERT INTO `productorder` VALUES (54, 76, 1222220, 3487750, 2019, 1, 'Mặc định', 'Tiêu chuẩn', 'Kệ Gỗ Aurora Chạm Khắc Bằng Tay', 'https://i.etsystatic.com/58686080/r/il/2e2bc4/7326536733/il_1588xN.7326536733_byc8.jpg');
INSERT INTO `productorder` VALUES (55, 77, 1297000, 1297000, 2017, 1, 'Mặc định', 'Tiêu chuẩn', 'Macramé Hackberry treo tường', 'https://i.etsystatic.com/28442333/r/il/54484f/8065841513/il_1588xN.8065841513_nbu7.jpg');
INSERT INTO `productorder` VALUES (56, 78, 1368000, 1368000, 2001, 1, 'Mặc định', 'Tiêu chuẩn', 'Tạp chí da Elderflower ràng buộc bằng tay', 'https://placeholder.com/product/2001/image_1.jpg');
INSERT INTO `productorder` VALUES (57, 79, 1222220, 3487750, 2019, 1, 'Mặc định', 'Tiêu chuẩn', 'Kệ Gỗ Aurora Chạm Khắc Bằng Tay', 'https://i.etsystatic.com/58686080/r/il/2e2bc4/7326536733/il_1588xN.7326536733_byc8.jpg');
INSERT INTO `productorder` VALUES (58, 80, 3936250, 3936250, 2020, 1, 'Mặc định', 'Tiêu chuẩn', 'Thớt quả óc chó Chạng vạng cuối hạt', 'https://i.etsystatic.com/61760164/r/il/54f51a/8083171940/il_1588xN.8083171940_qtuu.jpg');
INSERT INTO `productorder` VALUES (59, 81, 1297000, 1297000, 2017, 1, 'Mặc định', 'Tiêu chuẩn', 'Macramé Hackberry treo tường', 'https://i.etsystatic.com/28442333/r/il/54484f/8065841513/il_1588xN.8065841513_nbu7.jpg');
INSERT INTO `productorder` VALUES (60, 82, 1275500, 1275500, 2012, 1, 'Mặc định', 'Tiêu chuẩn', 'Bông tai pha lê hình quả việt quất có dây', 'https://placeholder.com/product/2012/image_1.jpg');
INSERT INTO `productorder` VALUES (61, 83, 1275500, 1275500, 2012, 1, 'Mặc định', 'Tiêu chuẩn', 'Bông tai pha lê hình quả việt quất có dây', 'https://placeholder.com/product/2012/image_1.jpg');
INSERT INTO `productorder` VALUES (62, 84, 120000, 120000, 2022, 1, NULL, NULL, 'Quần jean in chữ A', NULL);
INSERT INTO `productorder` VALUES (63, 85, 3936250, 3936250, 2020, 1, 'Mặc định', 'Tiêu chuẩn', 'Thớt quả óc chó Chạng vạng cuối hạt', 'https://i.etsystatic.com/61760164/r/il/54f51a/8083171940/il_1588xN.8083171940_qtuu.jpg');
INSERT INTO `productorder` VALUES (64, 86, 120000, 120000, 2022, 1, NULL, NULL, 'Quần jean in chữ A', NULL);
INSERT INTO `productorder` VALUES (65, 87, 100000, 122300, 2023, 1, NULL, NULL, 'Túi cá sấu', NULL);
INSERT INTO `productorder` VALUES (66, 88, 100000, 122300, 2023, 1, NULL, NULL, 'Túi cá sấu', NULL);
INSERT INTO `productorder` VALUES (67, 89, 1222220, 3487750, 2019, 1, 'Mặc định', 'Tiêu chuẩn', 'Kệ Gỗ Aurora Chạm Khắc Bằng Tay', 'https://i.etsystatic.com/58686080/r/il/58ce88/7278616766/il_1588xN.7278616766_dmln.jpg');
INSERT INTO `productorder` VALUES (68, 90, 100000, 122300, 2023, 1, NULL, NULL, 'Túi cá sấu', 'https://res.cloudinary.com/dqghfi8be/image/upload/v1781768496/woljjbfo1w7ro88i6npj.png');
INSERT INTO `productorder` VALUES (69, 91, 120000, 120000, 2022, 1, NULL, NULL, 'Quần jean in chữ A', NULL);
INSERT INTO `productorder` VALUES (70, 92, 123000, 123000, 2021, 1, NULL, NULL, 'Áo', NULL);
INSERT INTO `productorder` VALUES (71, 93, 1222220, 3487750, 2019, 1, 'Mặc định', 'Tiêu chuẩn', 'Kệ Gỗ Aurora Chạm Khắc Bằng Tay', 'https://i.etsystatic.com/58686080/r/il/58ce88/7278616766/il_1588xN.7278616766_dmln.jpg');
INSERT INTO `productorder` VALUES (72, 94, 122000, 123000, 2031, 1, NULL, NULL, 'dây đeo tay ', 'https://res.cloudinary.com/dqghfi8be/image/upload/v1781804344/zec3elkzyhda6dujydh2.jpg');
INSERT INTO `productorder` VALUES (73, 95, 100000, 122300, 2023, 1, NULL, NULL, 'Túi cá sấu', 'https://res.cloudinary.com/dqghfi8be/image/upload/v1781768496/woljjbfo1w7ro88i6npj.png');
INSERT INTO `productorder` VALUES (74, 96, 122000, 123000, 2031, 1, NULL, NULL, 'dây đeo tay ', 'https://res.cloudinary.com/dqghfi8be/image/upload/v1781804344/zec3elkzyhda6dujydh2.jpg');
INSERT INTO `productorder` VALUES (75, 97, 1232, 1214, 2025, 1, NULL, NULL, 'fsafa', 'https://res.cloudinary.com/dqghfi8be/image/upload/v1781763872/mjsufrd0w7olwgenxzq9.jpg');
INSERT INTO `productorder` VALUES (76, 98, 1232, 1214, 2025, 1, NULL, NULL, 'fsafa', 'https://res.cloudinary.com/dqghfi8be/image/upload/v1781763872/mjsufrd0w7olwgenxzq9.jpg');
INSERT INTO `productorder` VALUES (77, 99, 500000, 579000, 2032, 1, NULL, NULL, 'Giày da vẽ tay hoa văn độc lạ', 'https://res.cloudinary.com/dqghfi8be/image/upload/v1782311376/zvoglzm219pu1eejut0s.png');
INSERT INTO `productorder` VALUES (78, 100, 500000, 579000, 2032, 1, NULL, NULL, 'Giày da vẽ tay hoa văn độc lạ', 'https://res.cloudinary.com/dqghfi8be/image/upload/v1782311376/zvoglzm219pu1eejut0s.png');
INSERT INTO `productorder` VALUES (79, 101, 529000, 579000, 2032, 1, NULL, NULL, 'Giày da vẽ tay hoa văn độc lạ', 'https://res.cloudinary.com/dqghfi8be/image/upload/v1782311376/zvoglzm219pu1eejut0s.png');
INSERT INTO `productorder` VALUES (80, 102, 425000, 425000, 1, 1, 'Mặc định', 'Tiêu chuẩn', 'Vòng tay Dumortierite 6 mm- Chất lượng AAA: Kiên nhẫn, Tinh thần minh mẫn & Hỗ trợ', 'https://i.etsystatic.com/25427589/r/il/61d03d/3167593611/il_fullxfull.3167593611_kerz.jpg');
INSERT INTO `productorder` VALUES (81, 103, 1222220, 3487750, 2019, 1, 'Mặc định', 'Tiêu chuẩn', 'Kệ Gỗ Aurora Chạm Khắc Bằng Tay', 'https://i.etsystatic.com/58686080/r/il/58ce88/7278616766/il_1588xN.7278616766_dmln.jpg');
INSERT INTO `productorder` VALUES (82, 104, 1000000, 1268250, 2010, 1, 'Mặc định', 'Tiêu chuẩn', 'Vòng tay đá quý dâu tằm đính cườm', 'https://i.etsystatic.com/59294549/r/il/3ad288/8151747825/il_1588xN.8151747825_n568.jpg');
INSERT INTO `productorder` VALUES (83, 105, 425000, 425000, 1, 1, NULL, NULL, 'Vòng tay Dumortierite 6 mm- Chất lượng AAA: Kiên nhẫn, Tinh thần minh mẫn & Hỗ trợ', 'https://i.etsystatic.com/25427589/r/il/61d03d/3167593611/il_fullxfull.3167593611_kerz.jpg');
INSERT INTO `productorder` VALUES (84, 105, 1182750, 1577000, 11, 1, NULL, NULL, 'Bản in nghệ thuật Dundalk, Poster du lịch treo tường Dundalk, Trang trí tường Ireland, Tranh treo tường Dundalk, Bản in thành phố Ireland', 'https://i.etsystatic.com/47426109/r/il/4f4047/6066111694/il_fullxfull.6066111694_i15l.jpg');
INSERT INTO `productorder` VALUES (85, 106, 1000000, 1268250, 2010, 1, 'Mặc định', 'Tiêu chuẩn', 'Vòng tay đá quý dâu tằm đính cườm', 'https://i.etsystatic.com/59294549/r/il/3ad288/8151747825/il_1588xN.8151747825_n568.jpg');
INSERT INTO `productorder` VALUES (86, 107, 1000000, 1268250, 2010, 8, 'Mặc định', 'Tiêu chuẩn', 'Vòng tay đá quý dâu tằm đính cườm', 'https://i.etsystatic.com/59294549/r/il/3ad288/8151747825/il_1588xN.8151747825_n568.jpg');
INSERT INTO `productorder` VALUES (87, 108, 1000000, 1268250, 2010, 2, 'Mặc định', 'Tiêu chuẩn', 'Vòng tay đá quý dâu tằm đính cườm', 'https://i.etsystatic.com/59294549/r/il/3ad288/8151747825/il_1588xN.8151747825_n568.jpg');
INSERT INTO `productorder` VALUES (88, 109, 2452, 23455, 2034, 1, NULL, NULL, 'èghbcvf', NULL);
INSERT INTO `productorder` VALUES (89, 110, 1268250, 1268250, 2010, 1, 'Mặc định', 'Tiêu chuẩn', 'Vòng tay đá quý dâu tằm đính cườm', 'https://i.etsystatic.com/59294549/r/il/3ad288/8151747825/il_1588xN.8151747825_n568.jpg');

-- ----------------------------
-- Table structure for productorderrefund
-- ----------------------------
DROP TABLE IF EXISTS `productorderrefund`;
CREATE TABLE `productorderrefund`  (
  `id` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `order_refund_id` int NOT NULL,
  `product_id` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL,
  `quantity` int NOT NULL DEFAULT 1,
  `description` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL,
  PRIMARY KEY (`id`) USING BTREE,
  INDEX `idx_prodrefund_refund`(`order_refund_id` ASC) USING BTREE,
  INDEX `idx_prodrefund_product`(`product_id` ASC) USING BTREE,
  CONSTRAINT `fk_prodrefund_refund` FOREIGN KEY (`order_refund_id`) REFERENCES `orderrefund` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE = InnoDB CHARACTER SET = utf8mb4 COLLATE = utf8mb4_general_ci COMMENT = 'Chi tiết sản phẩm trong yêu cầu hoàn trả' ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of productorderrefund
-- ----------------------------

-- ----------------------------
-- Table structure for rating
-- ----------------------------
DROP TABLE IF EXISTS `rating`;
CREATE TABLE `rating`  (
  `id` int NOT NULL AUTO_INCREMENT,
  `store_id` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `order_id` int NOT NULL,
  `stars` double NOT NULL DEFAULT 5 COMMENT '1.0 - 5.0',
  `is_reply` tinyint(1) NOT NULL DEFAULT 0 COMMENT '0=chưa reply, 1=đã reply',
  `created_by` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL,
  `updated_by` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL,
  `update_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE CURRENT_TIMESTAMP,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`) USING BTREE,
  INDEX `idx_rating_store`(`store_id` ASC) USING BTREE,
  INDEX `idx_rating_order`(`order_id` ASC) USING BTREE,
  CONSTRAINT `fk_rating_order` FOREIGN KEY (`order_id`) REFERENCES `order` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE = InnoDB AUTO_INCREMENT = 48 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_general_ci COMMENT = 'Đánh giá của user sau khi mua hàng' ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of rating
-- ----------------------------
INSERT INTO `rating` VALUES (1, '1', 1, 5, 1, 'testuser', 'testuser', '2026-05-01 20:00:40', '2026-05-01 19:59:48');
INSERT INTO `rating` VALUES (2, 'store_001', 32, 5, 0, 'testuser', 'testuser', '2026-05-20 10:26:15', '2026-05-20 10:26:15');
INSERT INTO `rating` VALUES (3, 'store_002', 33, 5, 0, 'testuser', 'testuser', '2026-05-20 10:50:20', '2026-05-20 10:50:20');
INSERT INTO `rating` VALUES (4, 'store_001', 34, 5, 0, 'testuser', 'testuser', '2026-05-20 11:17:56', '2026-05-20 11:17:56');
INSERT INTO `rating` VALUES (5, 'store_003', 35, 5, 0, 'testuser', 'testuser', '2026-05-20 11:24:24', '2026-05-20 11:24:24');
INSERT INTO `rating` VALUES (6, 'store_005', 36, 5, 0, 'testuser', 'testuser', '2026-05-20 15:37:00', '2026-05-20 15:37:00');
INSERT INTO `rating` VALUES (7, 'store_005', 37, 5, 0, 'testuser', 'testuser', '2026-05-20 16:18:11', '2026-05-20 16:18:11');
INSERT INTO `rating` VALUES (8, 'store_006', 38, 5, 0, 'testuser', 'testuser', '2026-05-20 16:21:09', '2026-05-20 16:21:09');
INSERT INTO `rating` VALUES (9, 'store_003', 39, 5, 0, 'testuser', 'testuser', '2026-05-20 16:58:33', '2026-05-20 16:58:33');
INSERT INTO `rating` VALUES (10, 'store_001', 40, 5, 0, 'testuser', 'testuser', '2026-05-20 17:51:14', '2026-05-20 17:51:14');
INSERT INTO `rating` VALUES (11, 'store_001', 41, 5, 0, 'testuser', 'testuser', '2026-05-20 17:53:47', '2026-05-20 17:53:47');
INSERT INTO `rating` VALUES (12, 'bd24206e-d42f-4736-9106-16dca8c687e9', 42, 5, 1, 'thu123', 'thu123', '2026-05-27 21:23:45', '2026-05-27 17:53:56');
INSERT INTO `rating` VALUES (13, 'bd24206e-d42f-4736-9106-16dca8c687e9', 59, 5, 1, '22130180@st.hcmuaf.edu.vn', '22130180@st.hcmuaf.edu.vn', '2026-06-11 16:56:00', '2026-06-11 16:55:37');
INSERT INTO `rating` VALUES (14, 'bd24206e-d42f-4736-9106-16dca8c687e9', 63, 1, 0, 'tien', 'tien', '2026-06-15 17:31:54', '2026-06-15 17:31:54');
INSERT INTO `rating` VALUES (15, 'bd24206e-d42f-4736-9106-16dca8c687e9', 64, 5, 0, 'tien', 'tien', '2026-06-15 17:39:33', '2026-06-15 17:39:33');
INSERT INTO `rating` VALUES (16, 'bd24206e-d42f-4736-9106-16dca8c687e9', 65, 5, 0, 'tien', 'tien', '2026-06-15 18:30:59', '2026-06-15 18:30:59');
INSERT INTO `rating` VALUES (17, 'bd24206e-d42f-4736-9106-16dca8c687e9', 66, 5, 0, 'tien', 'tien', '2026-06-15 18:39:19', '2026-06-15 18:39:19');
INSERT INTO `rating` VALUES (18, 'bd24206e-d42f-4736-9106-16dca8c687e9', 67, 5, 0, 'tien', 'tien', '2026-06-15 18:45:11', '2026-06-15 18:45:11');
INSERT INTO `rating` VALUES (19, 'bd24206e-d42f-4736-9106-16dca8c687e9', 68, 5, 0, 'tien', 'tien', '2026-06-15 18:50:16', '2026-06-15 18:50:16');
INSERT INTO `rating` VALUES (20, 'bd24206e-d42f-4736-9106-16dca8c687e9', 69, 5, 0, 'tien', 'tien', '2026-06-16 16:04:30', '2026-06-16 16:04:30');
INSERT INTO `rating` VALUES (21, 'bd24206e-d42f-4736-9106-16dca8c687e9', 70, 5, 0, 'tien', 'tien', '2026-06-16 16:15:14', '2026-06-16 16:15:14');
INSERT INTO `rating` VALUES (22, 'bd24206e-d42f-4736-9106-16dca8c687e9', 71, 1, 0, 'tien', 'tien', '2026-06-16 16:24:41', '2026-06-16 16:24:41');
INSERT INTO `rating` VALUES (23, 'bd24206e-d42f-4736-9106-16dca8c687e9', 72, 5, 0, 'tien', 'tien', '2026-06-16 16:31:32', '2026-06-16 16:31:32');
INSERT INTO `rating` VALUES (24, 'bd24206e-d42f-4736-9106-16dca8c687e9', 73, 5, 0, 'tien', 'tien', '2026-06-16 16:38:17', '2026-06-16 16:38:17');
INSERT INTO `rating` VALUES (25, 'bd24206e-d42f-4736-9106-16dca8c687e9', 74, 5, 0, 'tien', 'tien', '2026-06-16 16:46:50', '2026-06-16 16:46:50');
INSERT INTO `rating` VALUES (26, 'bd24206e-d42f-4736-9106-16dca8c687e9', 75, 5, 0, 'tien', 'tien', '2026-06-16 16:51:19', '2026-06-16 16:51:19');
INSERT INTO `rating` VALUES (27, 'bd24206e-d42f-4736-9106-16dca8c687e9', 76, 5, 0, 'tien', 'tien', '2026-06-16 17:05:33', '2026-06-16 17:05:33');
INSERT INTO `rating` VALUES (28, 'bd24206e-d42f-4736-9106-16dca8c687e9', 77, 5, 0, 'tien', 'tien', '2026-06-16 17:12:30', '2026-06-16 17:12:30');
INSERT INTO `rating` VALUES (29, 'bd24206e-d42f-4736-9106-16dca8c687e9', 78, 5, 0, 'tien', 'tien', '2026-06-16 20:17:15', '2026-06-16 20:17:15');
INSERT INTO `rating` VALUES (30, 'bd24206e-d42f-4736-9106-16dca8c687e9', 79, 5, 0, 'thu123', 'thu123', '2026-06-16 20:25:24', '2026-06-16 20:25:24');
INSERT INTO `rating` VALUES (31, 'bd24206e-d42f-4736-9106-16dca8c687e9', 80, 1, 0, 'thu123', 'thu123', '2026-06-16 20:47:42', '2026-06-16 20:47:42');
INSERT INTO `rating` VALUES (32, 'bd24206e-d42f-4736-9106-16dca8c687e9', 81, 5, 0, 'thu123', 'thu123', '2026-06-16 21:24:41', '2026-06-16 21:24:41');
INSERT INTO `rating` VALUES (33, 'bd24206e-d42f-4736-9106-16dca8c687e9', 82, 5, 0, 'tien', 'tien', '2026-06-16 21:41:22', '2026-06-16 21:41:22');
INSERT INTO `rating` VALUES (34, 'bd24206e-d42f-4736-9106-16dca8c687e9', 83, 5, 1, 'tien', 'tien', '2026-06-23 17:47:50', '2026-06-16 21:51:01');
INSERT INTO `rating` VALUES (35, 'bd24206e-d42f-4736-9106-16dca8c687e9', 84, 5, 0, 'tien', 'tien', '2026-06-16 22:00:38', '2026-06-16 22:00:38');
INSERT INTO `rating` VALUES (36, 'bd24206e-d42f-4736-9106-16dca8c687e9', 85, 5, 0, 'tien', 'tien', '2026-06-16 22:16:21', '2026-06-16 22:16:21');
INSERT INTO `rating` VALUES (37, 'bd24206e-d42f-4736-9106-16dca8c687e9', 86, 5, 0, 'tien', 'tien', '2026-06-16 22:36:52', '2026-06-16 22:36:52');
INSERT INTO `rating` VALUES (38, 'bd24206e-d42f-4736-9106-16dca8c687e9', 87, 3, 1, 'tien', 'tien', '2026-06-18 13:00:37', '2026-06-16 22:50:03');
INSERT INTO `rating` VALUES (39, '7578ede4-cd3f-4976-8712-3cb87cfc0a21', 100, 5, 1, 'tien', 'tien', '2026-06-24 22:04:24', '2026-06-24 22:03:01');
INSERT INTO `rating` VALUES (40, 'bd24206e-d42f-4736-9106-16dca8c687e9', 94, 5, 1, 'tien', 'tien', '2026-07-09 16:22:00', '2026-06-24 22:18:13');
INSERT INTO `rating` VALUES (41, 'bd24206e-d42f-4736-9106-16dca8c687e9', 95, 5, 0, 'tien', 'tien', '2026-07-09 16:19:19', '2026-07-09 16:19:19');
INSERT INTO `rating` VALUES (42, 'bd24206e-d42f-4736-9106-16dca8c687e9', 104, 5, 0, 'tien', 'tien', '2026-07-09 16:21:04', '2026-07-09 16:21:04');
INSERT INTO `rating` VALUES (43, 'bd24206e-d42f-4736-9106-16dca8c687e9', 88, 1, 0, 'tien', 'tien', '2026-07-09 16:30:18', '2026-07-09 16:30:18');
INSERT INTO `rating` VALUES (44, 'bd24206e-d42f-4736-9106-16dca8c687e9', 89, 3, 0, 'tien', 'tien', '2026-07-09 16:30:32', '2026-07-09 16:30:32');
INSERT INTO `rating` VALUES (45, 'bd24206e-d42f-4736-9106-16dca8c687e9', 43, 3, 0, 'thu123', 'thu123', '2026-07-11 12:00:12', '2026-07-11 12:00:12');
INSERT INTO `rating` VALUES (46, 'bd24206e-d42f-4736-9106-16dca8c687e9', 105, 5, 0, 'thu123', 'thu123', '2026-07-11 12:08:09', '2026-07-11 12:08:09');
INSERT INTO `rating` VALUES (47, 'bd24206e-d42f-4736-9106-16dca8c687e9', 98, 5, 0, 'tien', 'tien', '2026-07-13 18:03:36', '2026-07-13 18:03:36');

-- ----------------------------
-- Table structure for ratingmaterial
-- ----------------------------
DROP TABLE IF EXISTS `ratingmaterial`;
CREATE TABLE `ratingmaterial`  (
  `id` int NOT NULL AUTO_INCREMENT,
  `rating_id` int NOT NULL,
  `created_at` datetime(6) NULL DEFAULT NULL,
  `update_at` datetime(6) NULL DEFAULT NULL,
  `created_by` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL,
  `updated_by` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL,
  `url` text CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `rating_reply_id` int NULL DEFAULT NULL,
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 58 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_general_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of ratingmaterial
-- ----------------------------
INSERT INTO `ratingmaterial` VALUES (1, 2, '2026-05-20 10:26:16.000000', '2026-05-20 10:26:16.000000', 'testuser', 'testuser', 'https://res.cloudinary.com/dqghfi8be/image/upload/v1779247570/nesqioczquxpqdw2lply.jpg', NULL);
INSERT INTO `ratingmaterial` VALUES (2, 5, '2026-05-20 11:24:24.000000', '2026-05-20 11:24:24.000000', 'testuser', 'testuser', 'https://res.cloudinary.com/dqghfi8be/image/upload/v1779251058/ikaoxvtkwyvr0wa7an6w.jpg', NULL);
INSERT INTO `ratingmaterial` VALUES (3, 7, '2026-05-20 16:18:11.000000', '2026-05-20 16:18:11.000000', 'testuser', 'testuser', 'https://res.cloudinary.com/dqghfi8be/image/upload/v1779268688/qcz851mtwiwfqb9nb0ov.jpg', NULL);
INSERT INTO `ratingmaterial` VALUES (4, 10, '2026-05-20 17:51:14.000000', '2026-05-20 17:51:14.000000', 'testuser', 'testuser', 'https://res.cloudinary.com/dqghfi8be/image/upload/v1779274260/fcoinzalgetx3o3r3tqz.jpg', NULL);
INSERT INTO `ratingmaterial` VALUES (5, 11, '2026-05-20 17:53:47.000000', '2026-05-20 17:53:47.000000', 'testuser', 'testuser', 'text:ok chất lượng', NULL);
INSERT INTO `ratingmaterial` VALUES (6, 11, '2026-05-20 17:53:47.000000', '2026-05-20 17:53:47.000000', 'testuser', 'testuser', 'https://res.cloudinary.com/dqghfi8be/image/upload/v1779274367/buuma7oigsspxtp93qja.jpg', NULL);
INSERT INTO `ratingmaterial` VALUES (7, 11, '2026-05-20 17:53:47.000000', '2026-05-20 17:53:47.000000', 'testuser', 'testuser', 'https://res.cloudinary.com/dqghfi8be/image/upload/v1779274415/shrgu4hmaa4pkcnnq42b.jpg', NULL);
INSERT INTO `ratingmaterial` VALUES (8, 12, '2026-05-27 17:53:56.000000', '2026-05-27 17:53:56.000000', 'thu123', 'thu123', 'text:sản phẩm oke', NULL);
INSERT INTO `ratingmaterial` VALUES (9, 12, '2026-05-27 17:53:56.000000', '2026-05-27 17:53:56.000000', 'thu123', 'thu123', 'https://res.cloudinary.com/dqghfi8be/image/upload/v1779879234/y3v8kf8bhvwi5fthfdz2.png', NULL);
INSERT INTO `ratingmaterial` VALUES (10, 12, '2026-05-27 21:23:45.000000', '2026-05-27 21:23:45.000000', 'testuser', 'testuser', 'text:Cảm ơn quý khách đã tin tưởng', 1);
INSERT INTO `ratingmaterial` VALUES (11, 12, '2026-05-27 21:23:45.000000', '2026-05-27 21:23:45.000000', 'testuser', 'testuser', 'https://res.cloudinary.com/dqghfi8be/image/upload/v1779891823/elbrvl43l4iklbdjsbex.png', 1);
INSERT INTO `ratingmaterial` VALUES (12, 13, '2026-06-11 16:55:37.000000', '2026-06-11 16:55:37.000000', '22130180@st.hcmuaf.edu.vn', '22130180@st.hcmuaf.edu.vn', 'text:Đẹp', NULL);
INSERT INTO `ratingmaterial` VALUES (13, 13, '2026-06-11 16:56:00.000000', '2026-06-11 16:56:00.000000', 'testuser', 'testuser', 'text:Cảm ơn bạn', 2);
INSERT INTO `ratingmaterial` VALUES (14, 13, '2026-06-11 16:56:00.000000', '2026-06-11 16:56:00.000000', 'testuser', 'testuser', 'https://res.cloudinary.com/dqghfi8be/image/upload/v1781171756/m6lrbwjqvra2sjancjhi.jpg', 2);
INSERT INTO `ratingmaterial` VALUES (15, 14, '2026-06-15 17:31:54.000000', '2026-06-15 17:31:54.000000', 'tien', 'tien', 'text:Tuyệt vời, đẹp lắm', NULL);
INSERT INTO `ratingmaterial` VALUES (16, 15, '2026-06-15 17:39:33.000000', '2026-06-15 17:39:33.000000', 'tien', 'tien', 'text:xấu quắc, tệ', NULL);
INSERT INTO `ratingmaterial` VALUES (17, 16, '2026-06-15 18:30:59.000000', '2026-06-15 18:30:59.000000', 'tien', 'tien', 'text:xấu òm', NULL);
INSERT INTO `ratingmaterial` VALUES (18, 17, '2026-06-15 18:39:19.000000', '2026-06-15 18:39:19.000000', 'tien', 'tien', 'text:gớm, xấu quắc, tệ, chất lượng kém', NULL);
INSERT INTO `ratingmaterial` VALUES (19, 18, '2026-06-15 18:45:11.000000', '2026-06-15 18:45:11.000000', 'tien', 'tien', 'text:tệ, kém chất lượng', NULL);
INSERT INTO `ratingmaterial` VALUES (20, 19, '2026-06-15 18:50:16.000000', '2026-06-15 18:50:16.000000', 'tien', 'tien', 'text:xấu quắc', NULL);
INSERT INTO `ratingmaterial` VALUES (21, 20, '2026-06-16 16:04:30.000000', '2026-06-16 16:04:30.000000', 'tien', 'tien', 'text:sản phẩm tệ, chất lượng kém', NULL);
INSERT INTO `ratingmaterial` VALUES (22, 21, '2026-06-16 16:15:14.000000', '2026-06-16 16:15:14.000000', 'tien', 'tien', 'text:dở tệ', NULL);
INSERT INTO `ratingmaterial` VALUES (23, 22, '2026-06-16 16:24:41.000000', '2026-06-16 16:24:41.000000', 'tien', 'tien', 'text:tuyệt vời, chất lượng rất tốt', NULL);
INSERT INTO `ratingmaterial` VALUES (24, 23, '2026-06-16 16:31:32.000000', '2026-06-16 16:31:32.000000', 'tien', 'tien', 'text:xấu quắc, chất lượng kém, tệ', NULL);
INSERT INTO `ratingmaterial` VALUES (25, 24, '2026-06-16 16:38:17.000000', '2026-06-16 16:38:17.000000', 'tien', 'tien', 'text:tệ, kém chất lượng', NULL);
INSERT INTO `ratingmaterial` VALUES (26, 25, '2026-06-16 16:46:50.000000', '2026-06-16 16:46:50.000000', 'tien', 'tien', 'text:chất lượng kém, dở', NULL);
INSERT INTO `ratingmaterial` VALUES (27, 27, '2026-06-16 17:05:33.000000', '2026-06-16 17:05:33.000000', 'tien', 'tien', 'text:tệ quá', NULL);
INSERT INTO `ratingmaterial` VALUES (28, 28, '2026-06-16 17:12:30.000000', '2026-06-16 17:12:30.000000', 'tien', 'tien', 'text:ổn', NULL);
INSERT INTO `ratingmaterial` VALUES (29, 29, '2026-06-16 20:17:15.000000', '2026-06-16 20:17:15.000000', 'tien', 'tien', 'text:đồ dỏm, kém chất lượng', NULL);
INSERT INTO `ratingmaterial` VALUES (30, 30, '2026-06-16 20:25:24.000000', '2026-06-16 20:25:24.000000', 'thu123', 'thu123', 'text:tệ, không tốt', NULL);
INSERT INTO `ratingmaterial` VALUES (31, 31, '2026-06-16 20:47:42.000000', '2026-06-16 20:47:42.000000', 'thu123', 'thu123', 'text:chất lượng tốt', NULL);
INSERT INTO `ratingmaterial` VALUES (32, 32, '2026-06-16 21:24:41.000000', '2026-06-16 21:24:41.000000', 'thu123', 'thu123', 'text:quá tuyệt vời luôn', NULL);
INSERT INTO `ratingmaterial` VALUES (33, 33, '2026-06-16 21:41:22.000000', '2026-06-16 21:41:22.000000', 'tien', 'tien', 'text:Sản phẩm này không như lời quảng cáo', NULL);
INSERT INTO `ratingmaterial` VALUES (34, 34, '2026-06-16 21:51:01.000000', '2026-06-16 21:51:01.000000', 'tien', 'tien', 'text:ko như quảng cáo, hong ổn tí nào', NULL);
INSERT INTO `ratingmaterial` VALUES (35, 35, '2026-06-16 22:00:38.000000', '2026-06-16 22:00:38.000000', 'tien', 'tien', 'text:không như quảng cáo, không ổn', NULL);
INSERT INTO `ratingmaterial` VALUES (36, 36, '2026-06-16 22:16:21.000000', '2026-06-16 22:16:21.000000', 'tien', 'tien', 'text:không ổn, không như quảng cáo', NULL);
INSERT INTO `ratingmaterial` VALUES (37, 37, '2026-06-16 22:36:52.000000', '2026-06-16 22:36:52.000000', 'tien', 'tien', 'text:không ổn chút nào, không như quảng cáo', NULL);
INSERT INTO `ratingmaterial` VALUES (38, 38, '2026-06-16 22:50:03.000000', '2026-06-16 22:50:03.000000', 'tien', 'tien', 'text:bình thường', NULL);
INSERT INTO `ratingmaterial` VALUES (39, 38, '2026-06-18 13:00:37.000000', '2026-06-18 13:00:37.000000', 'testuser', 'testuser', 'text:tksbanj', 3);
INSERT INTO `ratingmaterial` VALUES (40, 38, '2026-06-18 13:00:37.000000', '2026-06-18 13:00:37.000000', 'testuser', 'testuser', 'https://res.cloudinary.com/dqghfi8be/image/upload/v1781762436/laif1ijn2ql2bgkdqrro.jpg', 3);
INSERT INTO `ratingmaterial` VALUES (41, 34, '2026-06-23 17:47:50.000000', '2026-06-23 17:47:50.000000', 'testuser', 'testuser', 'text:ok', 4);
INSERT INTO `ratingmaterial` VALUES (42, 39, '2026-06-24 22:03:01.000000', '2026-06-24 22:03:01.000000', 'tien', 'tien', 'text:không như mô tả, rất không hài lòng', NULL);
INSERT INTO `ratingmaterial` VALUES (43, 39, '2026-06-24 22:04:24.000000', '2026-06-24 22:04:24.000000', 'pikachuu1', 'pikachuu1', 'text:xin lỗi đã để trải nghiệm của bạn không tốt, chúng tôi sẽ cải thiện', 5);
INSERT INTO `ratingmaterial` VALUES (44, 39, '2026-06-24 22:04:24.000000', '2026-06-24 22:04:24.000000', 'pikachuu1', 'pikachuu1', 'https://res.cloudinary.com/dqghfi8be/image/upload/v1782313462/rnq4wnb3rplni0w5p3h5.png', 5);
INSERT INTO `ratingmaterial` VALUES (45, 40, '2026-06-24 22:18:13.000000', '2026-06-24 22:18:13.000000', 'tien', 'tien', 'text:oke tốt', NULL);
INSERT INTO `ratingmaterial` VALUES (46, 40, '2026-06-24 22:18:13.000000', '2026-06-24 22:18:13.000000', 'tien', 'tien', 'https://res.cloudinary.com/dqghfi8be/image/upload/v1782314283/zrhhay4nomdao14spwnw.png', NULL);
INSERT INTO `ratingmaterial` VALUES (47, 41, '2026-07-09 16:19:19.000000', '2026-07-09 16:19:19.000000', 'tien', 'tien', 'text:dở, đồ ko tốt', NULL);
INSERT INTO `ratingmaterial` VALUES (48, 41, '2026-07-09 16:19:19.000000', '2026-07-09 16:19:19.000000', 'tien', 'tien', 'https://res.cloudinary.com/dqghfi8be/image/upload/v1783588756/ivzxjxin3ix5zrv7fx35.jpg', NULL);
INSERT INTO `ratingmaterial` VALUES (49, 42, '2026-07-09 16:21:04.000000', '2026-07-09 16:21:04.000000', 'tien', 'tien', 'text:kém chất lượng', NULL);
INSERT INTO `ratingmaterial` VALUES (50, 40, '2026-07-09 16:22:00.000000', '2026-07-09 16:22:00.000000', 'testuser', 'testuser', 'text:xxxx', 6);
INSERT INTO `ratingmaterial` VALUES (51, 40, '2026-07-09 16:22:00.000000', '2026-07-09 16:22:00.000000', 'testuser', 'testuser', 'https://res.cloudinary.com/dqghfi8be/image/upload/v1783588918/ksjalrqwokn2qzubumck.jpg', 6);
INSERT INTO `ratingmaterial` VALUES (52, 43, '2026-07-09 16:30:18.000000', '2026-07-09 16:30:18.000000', 'tien', 'tien', 'text:bình thường', NULL);
INSERT INTO `ratingmaterial` VALUES (53, 44, '2026-07-09 16:30:32.000000', '2026-07-09 16:30:32.000000', 'tien', 'tien', 'text:bình thường', NULL);
INSERT INTO `ratingmaterial` VALUES (54, 45, '2026-07-11 12:00:12.000000', '2026-07-11 12:00:12.000000', 'thu123', 'thu123', 'text:bình thường, không nổi bật', NULL);
INSERT INTO `ratingmaterial` VALUES (55, 46, '2026-07-11 12:08:09.000000', '2026-07-11 12:08:09.000000', 'thu123', 'thu123', 'text:tốt', NULL);
INSERT INTO `ratingmaterial` VALUES (56, 46, '2026-07-11 12:08:09.000000', '2026-07-11 12:08:09.000000', 'thu123', 'thu123', 'https://res.cloudinary.com/dqghfi8be/image/upload/v1783746480/c5d1tnntso8dwxyiw4l4.avif', NULL);
INSERT INTO `ratingmaterial` VALUES (57, 47, '2026-07-13 18:03:37.000000', '2026-07-13 18:03:37.000000', 'tien', 'tien', 'text:tệ', NULL);

-- ----------------------------
-- Table structure for ratingreply
-- ----------------------------
DROP TABLE IF EXISTS `ratingreply`;
CREATE TABLE `ratingreply`  (
  `id` int NOT NULL AUTO_INCREMENT,
  `is_reply` bit(1) NOT NULL,
  `rating_id` int NOT NULL,
  `rating_reply_id` int NULL DEFAULT NULL,
  `stars` double NULL DEFAULT NULL,
  `created_at` datetime(6) NULL DEFAULT NULL,
  `update_at` datetime(6) NULL DEFAULT NULL,
  `created_by` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL,
  `updated_by` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL,
  `url` text CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL,
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 7 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_general_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of ratingreply
-- ----------------------------
INSERT INTO `ratingreply` VALUES (1, b'1', 12, NULL, NULL, '2026-05-27 21:23:44.000000', '2026-05-27 21:23:44.000000', 'testuser', 'testuser', NULL);
INSERT INTO `ratingreply` VALUES (2, b'1', 13, NULL, NULL, '2026-06-11 16:56:00.000000', '2026-06-11 16:56:00.000000', 'testuser', 'testuser', NULL);
INSERT INTO `ratingreply` VALUES (3, b'1', 38, NULL, NULL, '2026-06-18 13:00:37.000000', '2026-06-18 13:00:37.000000', 'testuser', 'testuser', NULL);
INSERT INTO `ratingreply` VALUES (4, b'1', 34, NULL, NULL, '2026-06-23 17:47:50.000000', '2026-06-23 17:47:50.000000', 'testuser', 'testuser', NULL);
INSERT INTO `ratingreply` VALUES (5, b'1', 39, NULL, NULL, '2026-06-24 22:04:24.000000', '2026-06-24 22:04:24.000000', 'pikachuu1', 'pikachuu1', NULL);
INSERT INTO `ratingreply` VALUES (6, b'1', 40, NULL, NULL, '2026-07-09 16:22:00.000000', '2026-07-09 16:22:00.000000', 'testuser', 'testuser', NULL);

-- ----------------------------
-- Table structure for settlement
-- ----------------------------
DROP TABLE IF EXISTS `settlement`;
CREATE TABLE `settlement`  (
  `id` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `order_id` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL,
  `store_id` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL,
  `gross_amount` float NULL DEFAULT NULL,
  `commission_fee` float NULL DEFAULT NULL,
  `shipping_fee` float NULL DEFAULT NULL,
  `net_amount` float NULL DEFAULT NULL,
  `status` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL,
  `settled_at` timestamp NULL DEFAULT NULL,
  `created_by` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL,
  `updated_by` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL,
  `update_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB CHARACTER SET = utf8mb4 COLLATE = utf8mb4_general_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of settlement
-- ----------------------------
INSERT INTO `settlement` VALUES ('0ec17046-34c9-4177-bbc0-70ce16c1097b', '95', 'bd24206e-d42f-4736-9106-16dca8c687e9', 100000, 5000, NULL, 95000, 'SETTLED', '2026-06-24 20:59:35', 'system', 'system', '2026-06-24 20:57:05', '2026-06-24 20:57:05');
INSERT INTO `settlement` VALUES ('0f5fca1e-a0b7-4404-b51f-1dda83471cf0', '64', 'bd24206e-d42f-4736-9106-16dca8c687e9', 1297000, 64850, NULL, 1232150, 'SETTLED', '2026-06-15 17:40:27', 'system', 'system', '2026-06-15 17:37:27', '2026-06-15 17:37:27');
INSERT INTO `settlement` VALUES ('1464f8e8-9bad-4365-849a-4d75f9d930f6', '105', 'bd24206e-d42f-4736-9106-16dca8c687e9', 1638890, 81944.5, NULL, 1556950, 'SETTLED', '2026-07-11 11:51:25', 'system', 'system', '2026-07-11 11:48:56', '2026-07-11 11:48:56');
INSERT INTO `settlement` VALUES ('1860a434-1745-4b6d-ba0e-5d17e85f5999', '94', 'bd24206e-d42f-4736-9106-16dca8c687e9', 122000, 6100, NULL, 115900, 'SETTLED', '2026-06-24 20:48:35', 'system', 'system', '2026-06-24 20:45:36', '2026-06-24 20:45:36');
INSERT INTO `settlement` VALUES ('19ce6662-c372-4b6a-a5ba-604608450b58', '56', 'bd24206e-d42f-4736-9106-16dca8c687e9', 690250, 34512.5, NULL, 655738, 'SETTLED', '2026-06-11 15:27:29', 'system', 'system', '2026-06-11 15:24:29', '2026-06-11 15:24:29');
INSERT INTO `settlement` VALUES ('1d72d144-afb7-4f99-848e-7858b25e4d1e', '88', 'bd24206e-d42f-4736-9106-16dca8c687e9', 100000, 5000, NULL, 95000, 'SETTLED', '2026-06-17 21:19:15', 'system', 'system', '2026-06-17 21:16:46', '2026-06-17 21:16:46');
INSERT INTO `settlement` VALUES ('22ecd68a-546d-4b1f-90db-e4bd8ca2efb9', '82', 'bd24206e-d42f-4736-9106-16dca8c687e9', 1275500, 63775, NULL, 1211720, 'SETTLED', '2026-06-16 21:43:38', 'system', 'system', '2026-06-16 21:40:38', '2026-06-16 21:40:38');
INSERT INTO `settlement` VALUES ('24f939b7-5485-44a5-a339-4fa20df29eb1', '108', 'bd24206e-d42f-4736-9106-16dca8c687e9', 2033100, 101655, NULL, 1931440, 'SETTLED', '2026-07-13 18:16:49', 'system', 'system', '2026-07-13 18:14:07', '2026-07-13 18:14:07');
INSERT INTO `settlement` VALUES ('25f4e084-6117-42ff-addc-9196380f7501', '76', 'bd24206e-d42f-4736-9106-16dca8c687e9', 1222220, 61111, NULL, 1161110, 'SETTLED', '2026-06-16 17:07:41', 'system', 'system', '2026-06-16 17:05:11', '2026-06-16 17:05:11');
INSERT INTO `settlement` VALUES ('26c1275b-5605-4403-86b3-4cfff6834f74', '55', 'bd24206e-d42f-4736-9106-16dca8c687e9', 100000, 5000, NULL, 95000, 'SETTLED', '2026-06-11 15:19:28', 'system', 'system', '2026-06-11 15:16:59', '2026-06-11 15:16:58');
INSERT INTO `settlement` VALUES ('2f76b38b-8788-4182-8345-e1e8a81010d2', '66', 'bd24206e-d42f-4736-9106-16dca8c687e9', 3936250, 196812, NULL, 3739440, 'SETTLED', '2026-06-15 18:40:58', 'system', 'system', '2026-06-15 18:38:50', '2026-06-15 18:38:50');
INSERT INTO `settlement` VALUES ('33116e8b-dc78-45c9-b7c2-9e81811cb0dc', '59', 'bd24206e-d42f-4736-9106-16dca8c687e9', 103000, 5150, NULL, 97850, 'SETTLED', '2026-06-11 16:55:21', 'system', 'system', '2026-06-11 16:52:21', '2026-06-11 16:52:21');
INSERT INTO `settlement` VALUES ('42f27771-48fb-4161-a414-68a3068b687e', '58', 'bd24206e-d42f-4736-9106-16dca8c687e9', 103000, 5150, NULL, 97850, 'SETTLED', '2026-06-12 15:14:37', 'system', 'system', '2026-06-12 15:12:07', '2026-06-12 15:12:07');
INSERT INTO `settlement` VALUES ('494b9d3a-8afd-4da4-b95b-0470644938ac', '69', 'bd24206e-d42f-4736-9106-16dca8c687e9', 120000, 6000, NULL, 114000, 'SETTLED', '2026-06-16 16:06:06', 'system', 'system', '2026-06-16 16:04:02', '2026-06-16 16:04:02');
INSERT INTO `settlement` VALUES ('4c1ad000-be05-4d45-9316-4ecb445c2c05', '71', 'bd24206e-d42f-4736-9106-16dca8c687e9', 876500, 43825, NULL, 832675, 'SETTLED', '2026-06-16 16:24:30', 'system', 'system', '2026-06-16 16:22:00', '2026-06-16 16:22:00');
INSERT INTO `settlement` VALUES ('4f961ffe-77f4-4caf-9f2a-2a86db985033', '63', 'bd24206e-d42f-4736-9106-16dca8c687e9', 888750, 44437.5, NULL, 844312, 'SETTLED', '2026-06-15 17:33:37', 'system', 'system', '2026-06-15 17:31:08', '2026-06-15 17:31:08');
INSERT INTO `settlement` VALUES ('50479878-d539-46c6-b63c-a92185ea4a5b', '72', 'bd24206e-d42f-4736-9106-16dca8c687e9', 584750, 29237.5, NULL, 555512, 'SETTLED', '2026-06-16 16:33:22', 'system', 'system', '2026-06-16 16:30:52', '2026-06-16 16:30:52');
INSERT INTO `settlement` VALUES ('5ebf99ad-36eb-4a4f-94a8-128c5f47c705', '87', 'bd24206e-d42f-4736-9106-16dca8c687e9', 100000, 5000, NULL, 95000, 'SETTLED', '2026-06-16 22:46:39', 'system', 'system', '2026-06-16 22:43:39', '2026-06-16 22:43:39');
INSERT INTO `settlement` VALUES ('60cebc69-961b-47aa-a0bf-d11233014387', '80', 'bd24206e-d42f-4736-9106-16dca8c687e9', 3936250, 196812, NULL, 3739440, 'SETTLED', '2026-06-16 20:45:00', 'system', 'system', '2026-06-16 20:42:01', '2026-06-16 20:42:01');
INSERT INTO `settlement` VALUES ('688a1d8a-02e0-4523-953d-7dc1148ea180', '61', 'bd24206e-d42f-4736-9106-16dca8c687e9', 80000, 4000, NULL, 76000, 'SETTLED', '2026-06-12 15:01:36', 'system', 'system', '2026-06-12 14:59:07', '2026-06-12 14:59:07');
INSERT INTO `settlement` VALUES ('6cea13f7-2cc5-450e-b6a2-fd41b4c2fa50', '110', 'bd24206e-d42f-4736-9106-16dca8c687e9', 1297690, 64884.5, NULL, 1232810, 'SETTLED', '2026-07-13 18:16:49', 'system', 'system', '2026-07-13 18:14:08', '2026-07-13 18:14:07');
INSERT INTO `settlement` VALUES ('6e6fe0fd-a042-49df-a8ba-70c413e6c561', '93', 'bd24206e-d42f-4736-9106-16dca8c687e9', 1222220, 61111, NULL, 1161110, 'REFUNDED', '2026-06-19 10:07:44', 'system', 'admin', '2026-06-19 10:09:21', '2026-06-19 10:05:15');
INSERT INTO `settlement` VALUES ('6ee6054b-d1c1-49af-9198-b3093f6a05e9', '106', 'bd24206e-d42f-4736-9106-16dca8c687e9', 1028100, 51405, NULL, 976695, 'SETTLED', '2026-07-13 18:16:49', 'system', 'system', '2026-07-13 18:14:38', '2026-07-13 18:14:38');
INSERT INTO `settlement` VALUES ('74cc7cb5-f025-4c86-b8fb-33ba6c2ad423', '107', 'bd24206e-d42f-4736-9106-16dca8c687e9', 8063100, 403155, NULL, 7659940, 'SETTLED', '2026-07-13 18:16:49', 'system', 'system', '2026-07-13 18:14:38', '2026-07-13 18:14:38');
INSERT INTO `settlement` VALUES ('7859f712-202d-41de-a6f4-a02c76e508bf', '43', 'bd24206e-d42f-4736-9106-16dca8c687e9', 123000, 6150, NULL, 116850, 'SETTLED', '2026-07-11 11:51:25', 'system', 'system', '2026-07-11 11:48:56', '2026-07-11 11:48:56');
INSERT INTO `settlement` VALUES ('7da30f7a-720d-46f4-8ed0-8e0a6908dc69', '100', '7578ede4-cd3f-4976-8712-3cb87cfc0a21', 490000, 24500, NULL, 465500, 'SETTLED', '2026-06-24 21:57:18', 'system', 'system', '2026-06-24 21:54:19', '2026-06-24 21:54:19');
INSERT INTO `settlement` VALUES ('7ddf1e0d-79a9-4a59-8cb2-296e2db6dbec', '74', 'bd24206e-d42f-4736-9106-16dca8c687e9', 3936250, 196812, NULL, 3739440, 'SETTLED', '2026-06-16 16:48:16', 'system', 'system', '2026-06-16 16:45:16', '2026-06-16 16:45:16');
INSERT INTO `settlement` VALUES ('8491f1fd-47bd-4521-aa42-22208c066ac2', '85', 'bd24206e-d42f-4736-9106-16dca8c687e9', 3936250, 196812, NULL, 3739440, 'SETTLED', '2026-06-16 22:16:48', 'system', 'system', '2026-06-16 22:14:18', '2026-06-16 22:14:18');
INSERT INTO `settlement` VALUES ('883dcd17-5e7e-4ae2-b139-12fb18776927', '77', 'bd24206e-d42f-4736-9106-16dca8c687e9', 1297000, 64850, NULL, 1232150, 'SETTLED', '2026-06-16 17:14:19', 'system', 'system', '2026-06-16 17:11:19', '2026-06-16 17:11:19');
INSERT INTO `settlement` VALUES ('8897cf7f-4dac-4bf3-9b7c-afac36999dc1', '70', 'bd24206e-d42f-4736-9106-16dca8c687e9', 123000, 6150, NULL, 116850, 'SETTLED', '2026-06-16 16:11:06', 'system', 'system', '2026-06-16 16:09:02', '2026-06-16 16:09:02');
INSERT INTO `settlement` VALUES ('9214069d-49a4-4bb6-b392-fee6b17ddde0', '83', 'bd24206e-d42f-4736-9106-16dca8c687e9', 1275500, 63775, NULL, 1211720, 'SETTLED', '2026-06-16 21:49:19', 'system', 'system', '2026-06-16 21:46:38', '2026-06-16 21:46:38');
INSERT INTO `settlement` VALUES ('9c2e7fbd-33b9-4923-8e11-03651fff81bd', '101', '7578ede4-cd3f-4976-8712-3cb87cfc0a21', 529000, 26450, NULL, 502550, 'CANCELLED', NULL, 'system', 'admin', '2026-06-24 22:40:14', '2026-06-24 22:39:13');
INSERT INTO `settlement` VALUES ('9cb078b5-c272-422e-ad4f-fbf8b12e1e36', '89', 'bd24206e-d42f-4736-9106-16dca8c687e9', 0, 0, NULL, 0, 'SETTLED', '2026-06-19 00:24:17', 'system', 'system', '2026-06-19 00:21:47', '2026-06-19 00:21:47');
INSERT INTO `settlement` VALUES ('a13f87c7-7e35-4646-8a18-3c6ee0ef6e32', '65', 'bd24206e-d42f-4736-9106-16dca8c687e9', 1222220, 61111, NULL, 1161110, 'REFUNDED', '2026-06-15 18:35:20', 'system', 'admin', '2026-07-11 12:39:49', '2026-06-15 18:30:43');
INSERT INTO `settlement` VALUES ('a59cc0fa-bc41-4ed5-886e-6fba3f9b3b9c', '75', 'bd24206e-d42f-4736-9106-16dca8c687e9', 888750, 44437.5, NULL, 844312, 'SETTLED', '2026-06-16 16:53:16', 'system', 'system', '2026-06-16 16:50:17', '2026-06-16 16:50:17');
INSERT INTO `settlement` VALUES ('b0c275de-a62e-4d30-88b7-ccda7508510f', '86', 'bd24206e-d42f-4736-9106-16dca8c687e9', 120000, 6000, NULL, 114000, 'SETTLED', '2026-06-16 22:38:26', 'system', 'system', '2026-06-16 22:35:49', '2026-06-16 22:35:49');
INSERT INTO `settlement` VALUES ('b753887d-e3b4-41ac-8f85-5ca050133456', '84', 'bd24206e-d42f-4736-9106-16dca8c687e9', 120000, 6000, NULL, 114000, 'SETTLED', '2026-06-16 22:01:39', 'system', 'system', '2026-06-16 21:59:09', '2026-06-16 21:59:09');
INSERT INTO `settlement` VALUES ('beb7bbfd-a797-438a-b6d7-1a163522bdbc', '68', 'bd24206e-d42f-4736-9106-16dca8c687e9', 100000, 5000, NULL, 95000, 'SETTLED', '2026-06-16 15:58:05', 'system', 'system', '2026-06-15 18:50:05', '2026-06-15 18:50:05');
INSERT INTO `settlement` VALUES ('c7b0f3f5-131a-42b5-8474-52901bb61cdb', '90', 'bd24206e-d42f-4736-9106-16dca8c687e9', 100000, 5000, NULL, 95000, 'SETTLED', '2026-06-19 00:24:20', 'system', 'system', '2026-06-19 00:22:17', '2026-06-19 00:22:17');
INSERT INTO `settlement` VALUES ('c8de0a50-257b-4dee-a9bb-a5970c77fa3a', '79', 'bd24206e-d42f-4736-9106-16dca8c687e9', 1222220, 61111, NULL, 1161110, 'SETTLED', '2026-06-16 20:26:00', 'system', 'system', '2026-06-16 20:23:31', '2026-06-16 20:23:31');
INSERT INTO `settlement` VALUES ('ccf58b61-3793-4d62-9ce6-385679df5a57', '98', 'bd24206e-d42f-4736-9106-16dca8c687e9', 1232, 61.6, NULL, 1170.4, 'SETTLED', '2026-07-13 18:14:49', 'system', 'system', '2026-07-11 11:48:56', '2026-07-11 11:48:56');
INSERT INTO `settlement` VALUES ('d7382f4c-70c4-42c9-8b77-7349676e3004', '78', 'bd24206e-d42f-4736-9106-16dca8c687e9', 1368000, 68400, NULL, 1299600, 'SETTLED', '2026-06-16 20:19:00', 'system', 'system', '2026-06-16 20:16:30', '2026-06-16 20:16:30');
INSERT INTO `settlement` VALUES ('ebc3dc84-efed-4fc1-b531-d406cf19edc8', '73', 'bd24206e-d42f-4736-9106-16dca8c687e9', 571500, 28575, NULL, 542925, 'SETTLED', '2026-06-16 16:38:22', 'system', 'system', '2026-06-16 16:35:22', '2026-06-16 16:35:22');
INSERT INTO `settlement` VALUES ('ef1b2870-8124-47c4-a9d7-d8ba2cb3570d', '91', 'bd24206e-d42f-4736-9106-16dca8c687e9', 120000, 6000, NULL, 114000, 'SETTLED', '2026-06-19 00:33:21', 'system', 'system', '2026-06-19 00:30:51', '2026-06-19 00:30:51');
INSERT INTO `settlement` VALUES ('f3e0afc3-9763-4a3d-ad36-3688ccaf3b33', '104', 'bd24206e-d42f-4736-9106-16dca8c687e9', 1028100, 51405, NULL, 976695, 'SETTLED', '2026-07-09 16:21:49', 'system', 'system', '2026-07-09 16:19:20', '2026-07-09 16:19:20');
INSERT INTO `settlement` VALUES ('f3e85832-dd2e-49b6-bf57-2a9459a53fd7', '109', 'bd24206e-d42f-4736-9106-16dca8c687e9', 25552, 1277.6, NULL, 24274.4, 'CREDITED', NULL, 'system', NULL, '2026-07-13 18:14:07', '2026-07-13 18:14:07');
INSERT INTO `settlement` VALUES ('f81d9612-1ded-4c43-8a84-a726a7398c52', '81', 'bd24206e-d42f-4736-9106-16dca8c687e9', 1297000, 64850, NULL, 1232150, 'SETTLED', '2026-06-16 20:45:00', 'system', 'system', '2026-06-16 20:42:31', '2026-06-16 20:42:31');
INSERT INTO `settlement` VALUES ('f99e57d5-1f6a-417f-b65c-9d47214e962e', '92', 'bd24206e-d42f-4736-9106-16dca8c687e9', 123000, 6150, NULL, 116850, 'CANCELLED', NULL, 'system', 'admin', '2026-06-19 00:41:09', '2026-06-19 00:39:53');
INSERT INTO `settlement` VALUES ('ff2ee835-4539-489f-900c-ac91ef60d590', '67', 'bd24206e-d42f-4736-9106-16dca8c687e9', 7424000, 371200, NULL, 7052800, 'SETTLED', '2026-06-15 18:47:05', 'system', 'system', '2026-06-15 18:44:17', '2026-06-15 18:44:16');

-- ----------------------------
-- Table structure for shop_violation
-- ----------------------------
DROP TABLE IF EXISTS `shop_violation`;
CREATE TABLE `shop_violation`  (
  `id` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `complaint_id` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL,
  `created_at` datetime(6) NULL DEFAULT NULL,
  `order_id` int NULL DEFAULT NULL,
  `penalty_amount` float NULL DEFAULT NULL,
  `shop_id` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL,
  `violation_points` int NULL DEFAULT NULL,
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB CHARACTER SET = utf8mb4 COLLATE = utf8mb4_general_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of shop_violation
-- ----------------------------
INSERT INTO `shop_violation` VALUES ('806986ef-1881-4fea-aa28-899488b6b38a', '18549163-663b-436a-a090-97d0b169042c', '2026-06-19 00:41:09.000000', 92, 6150, 'bd24206e-d42f-4736-9106-16dca8c687e9', 10);
INSERT INTO `shop_violation` VALUES ('ac02aea3-8e82-4f09-a5d6-0f1185f42743', 'cd27d017-c01e-49fb-b5a8-55b09e45e1d5', '2026-06-19 10:09:21.000000', 93, 61111, 'bd24206e-d42f-4736-9106-16dca8c687e9', 10);
INSERT INTO `shop_violation` VALUES ('b1128348-a682-4798-836e-cc1d7756fb3f', 'd4376d78-430b-4557-8cad-218cd3eaaef9', '2026-06-24 22:40:14.000000', 101, 26450, '7578ede4-cd3f-4976-8712-3cb87cfc0a21', 10);
INSERT INTO `shop_violation` VALUES ('c12ebaec-0480-4704-9b39-aee96eed9d69', '66d7572b-30d8-479d-b2e6-7cead6a3cfbb', '2026-07-11 12:39:49.000000', 65, 61111, 'bd24206e-d42f-4736-9106-16dca8c687e9', 10);
INSERT INTO `shop_violation` VALUES ('e498ce00-672d-496b-8274-bdef1e51b1ca', 'c49f29cb-46c6-4176-b684-6853f2c7593b', '2026-06-19 00:17:08.000000', 63, 44437.5, 'bd24206e-d42f-4736-9106-16dca8c687e9', 10);

-- ----------------------------
-- Table structure for user_local
-- ----------------------------
DROP TABLE IF EXISTS `user_local`;
CREATE TABLE `user_local`  (
  `created_at` datetime(6) NULL DEFAULT NULL,
  `update_at` datetime(6) NULL DEFAULT NULL,
  `id` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `username` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL,
  `full_name` text CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL,
  `image` text CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL,
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB CHARACTER SET = utf8mb4 COLLATE = utf8mb4_general_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of user_local
-- ----------------------------
INSERT INTO `user_local` VALUES ('2026-06-08 17:35:12.000000', '2026-06-12 14:43:21.000000', '048ee526-036f-4cc2-a95c-4ac64f5c8204', 'thungan123', 'Trần Thị Thu Ngân', 'https://lh3.googleusercontent.com/a/ACg8ocJxSMbpqLsjNQoheDcfKcHM8vQmO-GI904MgoRi7PN8UjVL4O6o=s96-c');
INSERT INTO `user_local` VALUES ('2026-06-11 18:20:11.000000', '2026-06-11 18:20:11.000000', '05f9e130-8712-484c-971e-0670a837f6ca', 'thungan', 'Ngan', NULL);
INSERT INTO `user_local` VALUES ('2026-06-15 17:10:01.000000', '2026-06-15 17:10:01.000000', '20d428c7-bc91-49de-b321-17d40dae8a68', 'tien', 'Vu Tien', NULL);
INSERT INTO `user_local` VALUES ('2026-06-24 21:25:47.000000', '2026-07-11 14:46:05.000000', '35ab910f-0158-4869-8d2d-d07a2e627991', 'pikachuu1', 'Pika', '/uploads/avatars/35ab910f-0158-4869-8d2d-d07a2e627991.png');
INSERT INTO `user_local` VALUES ('2026-06-11 16:40:24.000000', '2026-06-11 16:40:24.000000', '45841b96-6a49-4879-b4ca-13d1cb80b4a2', 'google_116581109411755024402', 'Ngân Trần Nguyễn Thu', 'https://lh3.googleusercontent.com/a/ACg8ocLB6rFKldIkzMmdYLyFdUJrB3mqEyp3vZQ2ozCE-pciWcwNUA=s96-c');
INSERT INTO `user_local` VALUES ('2026-06-19 16:12:32.000000', '2026-06-19 16:12:32.000000', '6c137f53-6c8c-461d-8477-5917294a474b', 'admin1', 'Admin Quản lý người dùng', NULL);
INSERT INTO `user_local` VALUES ('2026-05-12 23:13:59.000000', '2026-05-12 23:13:59.000000', '882b4b5a-3e56-4208-986c-98bc2186ab3b', 'thnhngns', 'ThanhNgan', NULL);
INSERT INTO `user_local` VALUES ('2026-06-19 16:20:38.000000', '2026-06-19 16:20:38.000000', '8ec9866c-935c-495d-a30d-7f7cf4e5a1cc', 'shopmanager', 'Quản lý shop', NULL);
INSERT INTO `user_local` VALUES ('2026-06-19 16:20:12.000000', '2026-06-19 16:20:12.000000', '928942c5-2566-4ddd-9a7e-65d86c8b1647', 'productmanager', 'Quản lý sản phẩm', NULL);
INSERT INTO `user_local` VALUES ('2026-05-14 12:48:30.000000', '2026-05-14 12:48:30.000000', '9ae5e6ec-3d7b-452b-ac1a-ea01c1d05b31', 'testuser', 'Trần Ngọc An Nhiên', 'https://res.cloudinary.com/dqghfi8be/image/upload/v1778580381/ogux74s2hv5mw1nrcfjc.jpg');
INSERT INTO `user_local` VALUES ('2026-06-18 23:52:24.000000', '2026-06-18 23:52:24.000000', 'a064d764-f66a-41cc-9351-87249e97b105', 'admin', 'System Admin', NULL);
INSERT INTO `user_local` VALUES ('2026-05-27 17:52:31.000000', '2026-05-27 17:52:31.000000', 'c41636a7-61fe-4f6f-9456-ae1d99550945', 'thu123', 'Võ Thu', NULL);
INSERT INTO `user_local` VALUES ('2026-06-19 16:12:59.000000', '2026-06-19 16:12:59.000000', 'f9efffc5-f4ac-4182-9107-926103220452', 'admin2', 'Admin Quản lý shop', NULL);

-- ----------------------------
-- Table structure for voucher
-- ----------------------------
DROP TABLE IF EXISTS `voucher`;
CREATE TABLE `voucher`  (
  `id` int NOT NULL AUTO_INCREMENT,
  `code` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `title` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `init_quantity` int NOT NULL DEFAULT 0,
  `current_quantity` int NOT NULL DEFAULT 0,
  `description` text CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL,
  `type` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL COMMENT 'percent | fixed',
  `percent` double NULL DEFAULT 0,
  `maximum` int NULL DEFAULT 0 COMMENT 'Giảm tối đa (VNĐ)',
  `start_date` datetime NOT NULL,
  `end_date` datetime NOT NULL,
  `status` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT 'active',
  `store_id` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL,
  `created_by` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL,
  `updated_by` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL,
  `update_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE CURRENT_TIMESTAMP,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `discount_type` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `discount_value` float NOT NULL,
  `max_discount` float NULL DEFAULT NULL,
  `min_order_value` float NULL DEFAULT NULL,
  `name` varchar(200) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL,
  `quantity` int NULL DEFAULT NULL,
  `used_count` int NULL DEFAULT NULL,
  PRIMARY KEY (`id`) USING BTREE,
  UNIQUE INDEX `code`(`code` ASC) USING BTREE,
  UNIQUE INDEX `UKpvh1lqheshnjoekevvwla03xn`(`code` ASC) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 1 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_general_ci COMMENT = 'Mã giảm giá' ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of voucher
-- ----------------------------

SET FOREIGN_KEY_CHECKS = 1;
