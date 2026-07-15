/*
 Navicat Premium Dump SQL

 Source Server         : KLTN
 Source Server Type    : MySQL
 Source Server Version : 100432 (10.4.32-MariaDB)
 Source Host           : localhost:3306
 Source Schema         : storesdb

 Target Server Type    : MySQL
 Target Server Version : 100432 (10.4.32-MariaDB)
 File Encoding         : 65001

 Date: 14/07/2026 19:06:26
*/

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- ----------------------------
-- Table structure for category_condition_voucher
-- ----------------------------
DROP TABLE IF EXISTS `category_condition_voucher`;
CREATE TABLE `category_condition_voucher`  (
  `id` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `voucher_id` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL,
  `category_shortname` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL,
  PRIMARY KEY (`id`) USING BTREE,
  INDEX `fk_ccv_voucher`(`voucher_id` ASC) USING BTREE,
  CONSTRAINT `fk_ccv_voucher` FOREIGN KEY (`voucher_id`) REFERENCES `voucher` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE = InnoDB CHARACTER SET = utf8mb4 COLLATE = utf8mb4_general_ci ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Records of category_condition_voucher
-- ----------------------------
INSERT INTO `category_condition_voucher` VALUES ('8c74301d-2933-4d1c-a27f-2ed6d4743ee4', 'c2415bd2-9eaa-4e1f-8ff5-ee1ca51a589a', 'ao');

-- ----------------------------
-- Table structure for price_condition_voucher
-- ----------------------------
DROP TABLE IF EXISTS `price_condition_voucher`;
CREATE TABLE `price_condition_voucher`  (
  `id` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `voucher_id` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL,
  `total_min` float NULL DEFAULT NULL,
  `total_max` float NULL DEFAULT NULL,
  `price_min` float NULL DEFAULT NULL,
  `price_max` float NULL DEFAULT NULL,
  PRIMARY KEY (`id`) USING BTREE,
  INDEX `fk_pcv_voucher`(`voucher_id` ASC) USING BTREE,
  CONSTRAINT `fk_pcv_voucher` FOREIGN KEY (`voucher_id`) REFERENCES `voucher` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE = InnoDB CHARACTER SET = utf8mb4 COLLATE = utf8mb4_general_ci ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Records of price_condition_voucher
-- ----------------------------
INSERT INTO `price_condition_voucher` VALUES ('5aa04dab-3c53-4fda-91b3-df51561a216b', '6c31fc6d-e9a8-416e-80d4-5c8a99ed6864', 350000, NULL, NULL, NULL);
INSERT INTO `price_condition_voucher` VALUES ('8ebcb770-1eb1-4f62-9d66-71eb487b914a', 'c2415bd2-9eaa-4e1f-8ff5-ee1ca51a589a', 20000, NULL, NULL, NULL);

-- ----------------------------
-- Table structure for product_promotion
-- ----------------------------
DROP TABLE IF EXISTS `product_promotion`;
CREATE TABLE `product_promotion`  (
  `id` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `product_id` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL,
  `name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL,
  `image` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL,
  `quantity` int NULL DEFAULT NULL,
  `bought` int NULL DEFAULT NULL,
  `price_after` float NULL DEFAULT NULL,
  `is_delete` tinyint(1) NULL DEFAULT NULL,
  `created_by` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL,
  `updated_by` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL,
  `update_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `sale_promotion_id` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL,
  PRIMARY KEY (`id`) USING BTREE,
  INDEX `fk_pp_sale_promotion`(`product_id` ASC) USING BTREE
) ENGINE = InnoDB CHARACTER SET = utf8mb4 COLLATE = utf8mb4_general_ci ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Records of product_promotion
-- ----------------------------
INSERT INTO `product_promotion` VALUES ('039a1751-b1a3-40bf-915f-a5ebebd535b2', '2032', 'Giày da vẽ tay hoa văn độc lạ', NULL, 11, 0, 500000, 0, '35ab910f-0158-4869-8d2d-d07a2e627991', '35ab910f-0158-4869-8d2d-d07a2e627991', '2026-07-11 15:16:03', '2026-07-11 15:16:03', '4738ac0a-7d6c-4f0b-875c-7885ecdd71fc');
INSERT INTO `product_promotion` VALUES ('0d0390aa-c38b-4a7e-99c6-7222dbf626c8', '2023', 'Túi cá sấu', NULL, 12, 0, 100000, 1, '9ae5e6ec-3d7b-452b-ac1a-ea01c1d05b31', '9ae5e6ec-3d7b-452b-ac1a-ea01c1d05b31', '2026-07-11 15:42:53', '2026-05-27 16:08:20', '86c3e297-9f78-4963-a494-3782d55ea7aa');
INSERT INTO `product_promotion` VALUES ('5c2d97c8-3852-46f7-8c0f-68f9e312467a', '2020', 'Thớt quả óc chó Chạng vạng cuối hạt', NULL, 12, 0, 12, 1, '9ae5e6ec-3d7b-452b-ac1a-ea01c1d05b31', '9ae5e6ec-3d7b-452b-ac1a-ea01c1d05b31', '2026-05-27 15:10:53', '2026-05-27 15:10:50', '86c3e297-9f78-4963-a494-3782d55ea7aa');
INSERT INTO `product_promotion` VALUES ('5c8251db-f53c-4147-98b8-fc67b5a93055', '2010', 'Vòng tay đá quý dâu tằm đính cườm', NULL, 12, 13, 1000000, 0, '9ae5e6ec-3d7b-452b-ac1a-ea01c1d05b31', '9ae5e6ec-3d7b-452b-ac1a-ea01c1d05b31', '2026-06-11 15:38:26', '2026-06-11 15:38:26', '0e342a04-7bc7-49c0-8945-6a9f3e6f2c3f');
INSERT INTO `product_promotion` VALUES ('5d154916-a599-45f2-85e2-1c961c66e9fc', '2013', 'Vòng xếp chồng Crowberry được đóng dấu bằng tay', 'https://i.etsystatic.com/14792900/r/il/bba691/6866866700/il_1588xN.6866866700_fz8z.jpg', 12, 0, 400000, 0, '9ae5e6ec-3d7b-452b-ac1a-ea01c1d05b31', '9ae5e6ec-3d7b-452b-ac1a-ea01c1d05b31', '2026-07-11 15:41:55', '2026-07-11 15:41:55', 'd0a52f61-32b2-4e5f-aeea-a103b3eca325');
INSERT INTO `product_promotion` VALUES ('60f2e8ec-d601-426b-9121-3fc2536be08e', '2020', 'Thớt quả óc chó Chạng vạng cuối hạt', NULL, 1, 0, 3000000, 1, '9ae5e6ec-3d7b-452b-ac1a-ea01c1d05b31', '9ae5e6ec-3d7b-452b-ac1a-ea01c1d05b31', '2026-05-27 15:01:18', '2026-05-27 15:00:24', '86c3e297-9f78-4963-a494-3782d55ea7aa');
INSERT INTO `product_promotion` VALUES ('64b68816-5a34-4013-bf7c-9c471cbe2c6f', '2021', 'Áo', NULL, 12, 0, 122000, 1, '9ae5e6ec-3d7b-452b-ac1a-ea01c1d05b31', '9ae5e6ec-3d7b-452b-ac1a-ea01c1d05b31', '2026-05-27 15:10:42', '2026-05-27 15:10:40', '86c3e297-9f78-4963-a494-3782d55ea7aa');
INSERT INTO `product_promotion` VALUES ('7ca63748-c712-4828-b562-25506cd9e158', '2010', 'Vòng tay đá quý dâu tằm đính cườm', NULL, 1, 0, 1112220, 1, '9ae5e6ec-3d7b-452b-ac1a-ea01c1d05b31', '9ae5e6ec-3d7b-452b-ac1a-ea01c1d05b31', '2026-07-11 15:30:51', '2026-07-11 15:04:15', '86c3e297-9f78-4963-a494-3782d55ea7aa');
INSERT INTO `product_promotion` VALUES ('8458c41c-2f57-4e97-b0a2-7b362c5e2546', '2023', 'Túi cá sấu', NULL, 11, 0, 100000, 1, '9ae5e6ec-3d7b-452b-ac1a-ea01c1d05b31', '9ae5e6ec-3d7b-452b-ac1a-ea01c1d05b31', '2026-06-11 15:38:40', '2026-06-11 15:38:37', '0e342a04-7bc7-49c0-8945-6a9f3e6f2c3f');
INSERT INTO `product_promotion` VALUES ('96de5233-8980-4803-924d-63eceba70fff', '2008', 'Vòng tay tình bạn mộc qua dệt tay', NULL, 12, 0, 200000, 1, '9ae5e6ec-3d7b-452b-ac1a-ea01c1d05b31', '9ae5e6ec-3d7b-452b-ac1a-ea01c1d05b31', '2026-07-11 15:42:00', '2026-07-11 14:48:49', 'd0a52f61-32b2-4e5f-aeea-a103b3eca325');
INSERT INTO `product_promotion` VALUES ('af81ed82-d957-41bc-8dc4-911b1f024494', '2019', 'Kệ Gỗ Aurora Chạm Khắc Bằng Tay', NULL, 12, 1, 1222220, 0, '9ae5e6ec-3d7b-452b-ac1a-ea01c1d05b31', '9ae5e6ec-3d7b-452b-ac1a-ea01c1d05b31', '2026-05-27 15:01:39', '2026-05-27 15:01:39', '86c3e297-9f78-4963-a494-3782d55ea7aa');
INSERT INTO `product_promotion` VALUES ('b43ffd49-8e8c-4a73-a67e-f39a3a4b46cd', '1950', 'Nhẫn pha lê Rowan thô', 'https://i.etsystatic.com/19828721/r/il/fea32e/6452769971/il_1588xN.6452769971_o2k0.jpg', 111, 0, 1500000, 0, '9ae5e6ec-3d7b-452b-ac1a-ea01c1d05b31', '9ae5e6ec-3d7b-452b-ac1a-ea01c1d05b31', '2026-07-11 15:44:32', '2026-07-11 15:44:32', 'd0a52f61-32b2-4e5f-aeea-a103b3eca325');
INSERT INTO `product_promotion` VALUES ('b8d598fa-3cf9-49d2-b207-5788dbe99e22', '2014', 'Nhẫn pha lê Cloudberry thô', 'https://i.etsystatic.com/36713311/r/il/ba1e10/6887281043/il_1588xN.6887281043_atms.jpg', 12, 0, 1100000, 0, '9ae5e6ec-3d7b-452b-ac1a-ea01c1d05b31', '9ae5e6ec-3d7b-452b-ac1a-ea01c1d05b31', '2026-07-11 15:44:20', '2026-07-11 15:44:20', 'd0a52f61-32b2-4e5f-aeea-a103b3eca325');
INSERT INTO `product_promotion` VALUES ('cbd48dc5-d8df-4171-86e6-44c8982cdd40', '2021', 'Áo', NULL, 11, 0, 122000, 1, '9ae5e6ec-3d7b-452b-ac1a-ea01c1d05b31', '9ae5e6ec-3d7b-452b-ac1a-ea01c1d05b31', '2026-05-27 15:00:07', '2026-05-27 15:00:00', '86c3e297-9f78-4963-a494-3782d55ea7aa');
INSERT INTO `product_promotion` VALUES ('d02479b6-4593-4d3c-bd51-6623299bbc8a', '2023', 'Túi cá sấu', 'https://res.cloudinary.com/dqghfi8be/image/upload/v1781768496/woljjbfo1w7ro88i6npj.png', 1, 0, 99000, 0, '9ae5e6ec-3d7b-452b-ac1a-ea01c1d05b31', '9ae5e6ec-3d7b-452b-ac1a-ea01c1d05b31', '2026-07-11 15:43:03', '2026-07-11 15:43:03', '86c3e297-9f78-4963-a494-3782d55ea7aa');
INSERT INTO `product_promotion` VALUES ('ea6eae8d-1186-4ca2-bc7e-b8b4bae3445a', '2010', 'Vòng tay đá quý dâu tằm đính cườm', NULL, 10, 0, 1111110, 1, '9ae5e6ec-3d7b-452b-ac1a-ea01c1d05b31', '9ae5e6ec-3d7b-452b-ac1a-ea01c1d05b31', '2026-07-11 15:30:59', '2026-07-11 15:03:46', 'd0a52f61-32b2-4e5f-aeea-a103b3eca325');
INSERT INTO `product_promotion` VALUES ('f8d2ff48-2559-4b9f-8be7-a49dafde5391', '2032', 'Giày da vẽ tay hoa văn độc lạ', NULL, 10, 1, 529000, 0, '35ab910f-0158-4869-8d2d-d07a2e627991', '35ab910f-0158-4869-8d2d-d07a2e627991', '2026-06-24 21:54:42', '2026-06-24 21:54:42', '4d413259-906a-438d-9b4a-708941f6644e');

-- ----------------------------
-- Table structure for sale_promotion
-- ----------------------------
DROP TABLE IF EXISTS `sale_promotion`;
CREATE TABLE `sale_promotion`  (
  `id` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `title` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL,
  `description` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL,
  `type` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL,
  `status` int NULL DEFAULT NULL,
  `start_date` timestamp NULL DEFAULT NULL,
  `end_date` timestamp NULL DEFAULT NULL,
  `created_by` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL,
  `updated_by` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL,
  `update_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB CHARACTER SET = utf8mb4 COLLATE = utf8mb4_general_ci ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Records of sale_promotion
-- ----------------------------
INSERT INTO `sale_promotion` VALUES ('024cd593-0b7e-4ad2-876e-fddb15faa882', 'GIAM GIA TO DUNG', 'giam gia', 'FLASH_SALE', 1, '2026-07-11 08:29:00', '2026-07-23 08:29:00', '35ab910f-0158-4869-8d2d-d07a2e627991', '35ab910f-0158-4869-8d2d-d07a2e627991', '2026-07-11 15:29:18', '2026-07-11 15:29:18');
INSERT INTO `sale_promotion` VALUES ('0e342a04-7bc7-49c0-8945-6a9f3e6f2c3f', 'Khuyến Mãi Mùa Thu', 'Giảm giá 20% sản phẩm........', 'FLASH_SALE', 1, '2026-07-02 18:37:00', '2026-07-31 18:37:00', '9ae5e6ec-3d7b-452b-ac1a-ea01c1d05b31', '9ae5e6ec-3d7b-452b-ac1a-ea01c1d05b31', '2026-07-09 15:50:59', '2026-06-11 15:37:57');
INSERT INTO `sale_promotion` VALUES ('4738ac0a-7d6c-4f0b-875c-7885ecdd71fc', 'THU', 'Giảm giá mùa thu', 'FLASH_SALE', 0, '2026-07-11 08:15:00', '2026-07-23 08:15:00', '35ab910f-0158-4869-8d2d-d07a2e627991', '35ab910f-0158-4869-8d2d-d07a2e627991', '2026-07-11 15:28:56', '2026-07-11 15:15:50');
INSERT INTO `sale_promotion` VALUES ('4d413259-906a-438d-9b4a-708941f6644e', 'Khuyến Mãi', 'Khuyến mãi 10%', 'FLASH_SALE', 1, '2026-06-24 14:53:00', '2026-07-23 14:53:00', '35ab910f-0158-4869-8d2d-d07a2e627991', '35ab910f-0158-4869-8d2d-d07a2e627991', '2026-06-24 21:54:09', '2026-06-24 21:54:09');
INSERT INTO `sale_promotion` VALUES ('86c3e297-9f78-4963-a494-3782d55ea7aa', 'Khuyến mãi Hè 2026', 'Giảm giá tất cả sản phẩm', 'SALE', 1, '2026-05-26 10:45:00', '2026-07-28 10:45:00', '9ae5e6ec-3d7b-452b-ac1a-ea01c1d05b31', '9ae5e6ec-3d7b-452b-ac1a-ea01c1d05b31', '2026-07-11 15:03:05', '2026-05-26 17:45:34');
INSERT INTO `sale_promotion` VALUES ('d0a52f61-32b2-4e5f-aeea-a103b3eca325', 'Khuyến mãi mùa thu', 'Giảm sản phẩm quần áo ', 'BUNDLE', 1, '2026-07-11 03:28:00', '2026-09-22 03:28:00', '9ae5e6ec-3d7b-452b-ac1a-ea01c1d05b31', '9ae5e6ec-3d7b-452b-ac1a-ea01c1d05b31', '2026-07-11 15:02:07', '2026-05-26 18:29:18');

-- ----------------------------
-- Table structure for store
-- ----------------------------
DROP TABLE IF EXISTS `store`;
CREATE TABLE `store`  (
  `id` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL,
  `image` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL,
  `location` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL,
  `description` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL,
  `status` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL,
  `created_by` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL,
  `updated_by` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL,
  `update_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB CHARACTER SET = utf8mb4 COLLATE = utf8mb4_general_ci ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Records of store
-- ----------------------------
INSERT INTO `store` VALUES ('17c0bfc7-38de-47e9-a970-36f933e428c1', 'EXO', '', '133 Ngõ Hạ Đông, Phường Đông Cao, Thành phố Phổ Yên, Tỉnh Thái Nguyên', 'ầ', 'active', 'e9eb5b42-14e9-47c2-854a-562fa8579bc2', 'ADMIN', '2026-06-25 14:59:20', '2026-06-22 16:41:00');
INSERT INTO `store` VALUES ('2700cc0c-60c0-41cc-9a46-0e516231e1d8', 'cashier', '', 'Thu Duc', 'Cashier', 'active', 'be5acd90-0505-4abd-a243-8d27a21e51c8', 'ADMIN', '2026-07-09 16:51:50', '2026-06-11 18:51:01');
INSERT INTO `store` VALUES ('2f5a3cc2-f2e9-436d-bce9-40c9ab71333c', 'BTS', '', '177 Thôn 2, Xã Hưng Khánh, Huyện Trấn Yên, Tỉnh Yên Bái', 'GOODS BTS', 'active', 'd03dc9ef-6f39-4e3b-8794-22c2ece4406a', NULL, '2026-06-19 17:12:21', '2026-06-19 17:12:21');
INSERT INTO `store` VALUES ('2f6fcc10-1060-4178-bfad-b5f0f7dd7b95', 'Bảo Cát', '', '12 Nguyễn Huệ, Quận 1, TPHCM', 'Shop test', 'active', '048ee526-036f-4cc2-a95c-4ac64f5c8204', NULL, '2026-05-25 21:20:28', '2026-05-25 21:20:28');
INSERT INTO `store` VALUES ('36c34cc4-3830-4729-bb41-dd3c57a884ee', 'tien', '', 'bà gia', 'bán đồ gỗ', 'active', '20d428c7-bc91-49de-b321-17d40dae8a68', 'ADMIN', '2026-06-22 16:16:38', '2026-06-04 22:55:06');
INSERT INTO `store` VALUES ('4564c550-64f8-4236-97a9-f1d546b2642c', 'AAAA', '', '123 Đường 17, Linh Chiểu, Thủ Đức', 'AAAAAAAAAAAAAAA', 'active', '78ba2416-158a-4001-80e2-34785504b1a5', NULL, '2026-06-04 21:38:53', '2026-06-04 21:38:53');
INSERT INTO `store` VALUES ('6776e6c8-97d1-4f0a-b581-0be818ca6b42', 'EXO', '', '133 thôn 2, Xã Tả Ngảo, Huyện Sìn Hồ, Tỉnh Lai Châu', '', 'active', '3c45eba9-0d3c-49bc-8509-cfe41507f406', 'ADMIN', '2026-06-22 16:39:24', '2026-06-22 16:18:04');
INSERT INTO `store` VALUES ('7578ede4-cd3f-4976-8712-3cb87cfc0a21', 'Pikachu', 'https://res.cloudinary.com/dqghfi8be/image/upload/v1782311272/oumzkxwyqtjyowyfefnf.png', '123 Xã 4, Xã Dực Yên, Huyện Đầm Hà, Tỉnh Quảng Ninh', 'Pika pikachu', 'active', '35ab910f-0158-4869-8d2d-d07a2e627991', NULL, '2026-06-24 21:28:12', '2026-06-24 21:28:12');
INSERT INTO `store` VALUES ('bd24206e-d42f-4736-9106-16dca8c687e9', 'Thu Ngân', 'https://res.cloudinary.com/dqghfi8be/image/upload/v1781804378/rs7ghychgrxaf8p7rrvm.png', '133 Đường 17, Phường Linh Chiểu, Thành phố Thủ Đức, Thành phố Hồ Chí Minh', 'Bán Hàng Nha', 'active', '9ae5e6ec-3d7b-452b-ac1a-ea01c1d05b31', '9ae5e6ec-3d7b-452b-ac1a-ea01c1d05b31', '2026-06-19 00:39:40', '2026-05-13 11:21:09');
INSERT INTO `store` VALUES ('d31fc09d-5f73-43b0-b18c-fddf02e178da', 'Hang Shop', '', 'bà gia', 'Shop handmade', 'active', 'e5ce55f2-f8f5-4b6a-a416-ec4c6f2480b4', NULL, '2026-06-04 23:12:20', '2026-06-04 23:12:20');
INSERT INTO `store` VALUES ('d4cbb90c-234e-4c7f-b03e-7deaa0a7894e', 'aăn ăn ăn', '', '123 Đường 17, Linh Chiểu, Thủ Đức', 'ádasd', 'active', 'bed931db-1d1c-40b7-b84c-c4d146de6a09', NULL, '2026-06-04 22:33:32', '2026-06-04 22:33:32');
INSERT INTO `store` VALUES ('f11eca16-0945-4cc4-95c8-7200ced03796', 'Thiet Tinh', '', '123 Đường 17, Linh Chiểu, Thủ Đức', 'abcdefghiklmnopq', 'active', 'c41636a7-61fe-4f6f-9456-ae1d99550945', NULL, '2026-06-04 16:51:52', '2026-06-04 16:51:52');

-- ----------------------------
-- Table structure for store_sale_promotion
-- ----------------------------
DROP TABLE IF EXISTS `store_sale_promotion`;
CREATE TABLE `store_sale_promotion`  (
  `id` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `sale_promotion_id` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL,
  `store_id` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL,
  `status` int NULL DEFAULT NULL,
  `created_by` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL,
  `updated_by` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL,
  `update_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`) USING BTREE,
  INDEX `fk_ssp_sale_promotion`(`sale_promotion_id` ASC) USING BTREE,
  CONSTRAINT `fk_ssp_sale_promotion` FOREIGN KEY (`sale_promotion_id`) REFERENCES `sale_promotion` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE = InnoDB CHARACTER SET = utf8mb4 COLLATE = utf8mb4_general_ci ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Records of store_sale_promotion
-- ----------------------------
INSERT INTO `store_sale_promotion` VALUES ('27f0d8bf-9077-4813-9c6f-da39d776c93a', '86c3e297-9f78-4963-a494-3782d55ea7aa', 'bd24206e-d42f-4736-9106-16dca8c687e9', 1, '9ae5e6ec-3d7b-452b-ac1a-ea01c1d05b31', '9ae5e6ec-3d7b-452b-ac1a-ea01c1d05b31', '2026-05-26 17:45:34', '2026-05-26 17:45:34');
INSERT INTO `store_sale_promotion` VALUES ('58382ea3-1cd6-414d-972f-22a38fb1ba83', 'd0a52f61-32b2-4e5f-aeea-a103b3eca325', 'bd24206e-d42f-4736-9106-16dca8c687e9', 1, '9ae5e6ec-3d7b-452b-ac1a-ea01c1d05b31', '9ae5e6ec-3d7b-452b-ac1a-ea01c1d05b31', '2026-05-26 18:29:18', '2026-05-26 18:29:18');
INSERT INTO `store_sale_promotion` VALUES ('7dc1ac37-b42c-4c80-ba9f-6e1e7bdbeaeb', '0e342a04-7bc7-49c0-8945-6a9f3e6f2c3f', 'bd24206e-d42f-4736-9106-16dca8c687e9', 1, '9ae5e6ec-3d7b-452b-ac1a-ea01c1d05b31', '9ae5e6ec-3d7b-452b-ac1a-ea01c1d05b31', '2026-06-11 15:37:57', '2026-06-11 15:37:57');
INSERT INTO `store_sale_promotion` VALUES ('9f887de0-7cbd-4647-8936-93939346b70b', '4738ac0a-7d6c-4f0b-875c-7885ecdd71fc', '7578ede4-cd3f-4976-8712-3cb87cfc0a21', 0, '35ab910f-0158-4869-8d2d-d07a2e627991', '35ab910f-0158-4869-8d2d-d07a2e627991', '2026-07-11 15:15:50', '2026-07-11 15:15:50');
INSERT INTO `store_sale_promotion` VALUES ('b9487c72-674e-4c9c-8762-74a5497b2fe9', '4d413259-906a-438d-9b4a-708941f6644e', '7578ede4-cd3f-4976-8712-3cb87cfc0a21', 1, '35ab910f-0158-4869-8d2d-d07a2e627991', '35ab910f-0158-4869-8d2d-d07a2e627991', '2026-06-24 21:54:09', '2026-06-24 21:54:09');
INSERT INTO `store_sale_promotion` VALUES ('c0a39d22-ca25-4889-8f9f-ec608ba1dc2c', '024cd593-0b7e-4ad2-876e-fddb15faa882', '7578ede4-cd3f-4976-8712-3cb87cfc0a21', 1, '35ab910f-0158-4869-8d2d-d07a2e627991', '35ab910f-0158-4869-8d2d-d07a2e627991', '2026-07-11 15:29:18', '2026-07-11 15:29:18');

-- ----------------------------
-- Table structure for voucher
-- ----------------------------
DROP TABLE IF EXISTS `voucher`;
CREATE TABLE `voucher`  (
  `id` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `code` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL,
  `title` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL,
  `description` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL,
  `init_quantity` int NULL DEFAULT NULL,
  `current_quantity` int NULL DEFAULT NULL,
  `status` int NULL DEFAULT NULL,
  `type` int NULL DEFAULT NULL,
  `store_id` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL,
  `percent` double NULL DEFAULT NULL,
  `maximum` int NULL DEFAULT NULL,
  `start_date` timestamp NULL DEFAULT NULL,
  `end_date` timestamp NULL DEFAULT NULL,
  `created_by` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL,
  `updated_by` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL,
  `update_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`) USING BTREE,
  INDEX `fk_voucher_store`(`store_id` ASC) USING BTREE,
  CONSTRAINT `fk_voucher_store` FOREIGN KEY (`store_id`) REFERENCES `store` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE = InnoDB CHARACTER SET = utf8mb4 COLLATE = utf8mb4_general_ci ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Records of voucher
-- ----------------------------
INSERT INTO `voucher` VALUES ('5d4d6e30-10ce-43eb-99b6-15caa5bb9dec', 'SALE', 'Giảm 100%', 'Giảm tất cả spham ', 1, 0, 0, 1, 'bd24206e-d42f-4736-9106-16dca8c687e9', 100, 200000, '2026-06-25 20:59:00', '2026-06-26 21:00:00', '9ae5e6ec-3d7b-452b-ac1a-ea01c1d05b31', '9ae5e6ec-3d7b-452b-ac1a-ea01c1d05b31', '2026-07-06 15:53:53', '2026-06-23 18:00:09');
INSERT INTO `voucher` VALUES ('6c31fc6d-e9a8-416e-80d4-5c8a99ed6864', 'ABCDE', '50%', '', 2, 2, 1, 2, 'bd24206e-d42f-4736-9106-16dca8c687e9', 50000, NULL, '2026-06-18 15:41:00', '2026-06-19 15:41:00', '9ae5e6ec-3d7b-452b-ac1a-ea01c1d05b31', '9ae5e6ec-3d7b-452b-ac1a-ea01c1d05b31', '2026-06-24 21:48:37', '2026-06-18 12:41:58');
INSERT INTO `voucher` VALUES ('938a021f-a05b-478d-9c16-d3c69ade6fa2', 'PIKACHU', 'PIKACHU', '', 10, 9, 1, 1, '7578ede4-cd3f-4976-8712-3cb87cfc0a21', 10, 10000, '2026-06-24 14:30:00', '2026-06-25 14:30:00', '35ab910f-0158-4869-8d2d-d07a2e627991', NULL, '2026-06-24 21:38:10', '2026-06-24 21:30:42');
INSERT INTO `voucher` VALUES ('b4cfb49a-49cb-46bc-bfc0-d76853c69b08', 'SALE10', 'Giảm 10% các đơn hàng', 'Giảm 10% các đơn hàng', 25, 25, 1, 1, 'bd24206e-d42f-4736-9106-16dca8c687e9', 10, 20000, '2026-05-20 19:53:00', '2026-05-22 19:53:00', '9ae5e6ec-3d7b-452b-ac1a-ea01c1d05b31', '9ae5e6ec-3d7b-452b-ac1a-ea01c1d05b31', '2026-07-06 15:53:49', '2026-05-21 16:53:42');
INSERT INTO `voucher` VALUES ('c2415bd2-9eaa-4e1f-8ff5-ee1ca51a589a', 'THUNGAN20', 'Giảm 20000đ cho đơn hàng từ 200000', 'Giảm 20000đ cho đơn hàng trên 200000', 10, 10, 1, 2, 'bd24206e-d42f-4736-9106-16dca8c687e9', 20000, 20000, '2026-05-22 09:54:00', '2026-06-05 09:54:00', '9ae5e6ec-3d7b-452b-ac1a-ea01c1d05b31', NULL, '2026-05-21 16:55:38', '2026-05-21 16:55:38');
INSERT INTO `voucher` VALUES ('e30585fa-bb4b-41e8-9390-e77ae710a592', '123', '123', '123', 12, 12, 0, 1, 'bd24206e-d42f-4736-9106-16dca8c687e9', 10, 49997, '2026-05-27 02:07:00', '2026-05-29 02:07:00', '9ae5e6ec-3d7b-452b-ac1a-ea01c1d05b31', '9ae5e6ec-3d7b-452b-ac1a-ea01c1d05b31', '2026-05-27 16:08:03', '2026-05-27 16:07:23');
INSERT INTO `voucher` VALUES ('ec6c3258-f0b7-4b85-ab18-442722cd6ebe', 'THUNGAN30', 'Giảm 30000 cho tất cả đơn hàng', 'Giảm 30000 cho tất cả đơn hàng', 10, 10, 1, 2, 'bd24206e-d42f-4736-9106-16dca8c687e9', 30000, 30000, '2026-05-21 10:01:00', '2026-05-27 10:01:00', '9ae5e6ec-3d7b-452b-ac1a-ea01c1d05b31', NULL, '2026-05-21 17:01:22', '2026-05-21 17:01:22');

-- ----------------------------
-- Table structure for wallet
-- ----------------------------
DROP TABLE IF EXISTS `wallet`;
CREATE TABLE `wallet`  (
  `id` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `store_id` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL,
  `available_balance` float NULL DEFAULT 0,
  `pending_balance` float NULL DEFAULT 0,
  `reserved_balance` float NULL DEFAULT 0,
  `total_earned` float NULL DEFAULT 0,
  `total_withdrawn` float NULL DEFAULT 0,
  `created_by` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL,
  `updated_by` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL,
  `update_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `version` bigint NULL DEFAULT NULL,
  `commission_rate` double NULL DEFAULT NULL,
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB CHARACTER SET = utf8mb4 COLLATE = utf8mb4_general_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of wallet
-- ----------------------------
INSERT INTO `wallet` VALUES ('3c295c7d-70c0-4a3e-bff2-0132260541e5', 'bd24206e-d42f-4736-9106-16dca8c687e9', 51637400, 24220, 0, 54332400, 200000, 'system', NULL, '2026-06-10 18:15:39', '2026-06-10 18:15:39', 124, NULL);
INSERT INTO `wallet` VALUES ('a90ba767-d8bc-4d9c-be12-a9b0f619f518', '7578ede4-cd3f-4976-8712-3cb87cfc0a21', 389050, 0, 0, 465500, 50000, 'system', NULL, '2026-06-24 21:54:19', '2026-06-24 21:54:19', 9, NULL);

-- ----------------------------
-- Table structure for wallet_transaction
-- ----------------------------
DROP TABLE IF EXISTS `wallet_transaction`;
CREATE TABLE `wallet_transaction`  (
  `id` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `amount` double NULL DEFAULT NULL,
  `balance_after` double NULL DEFAULT NULL,
  `balance_before` double NULL DEFAULT NULL,
  `created_at` datetime(6) NULL DEFAULT NULL,
  `created_by` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL,
  `direction` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL,
  `note` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL,
  `reference_id` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL,
  `reference_type` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL,
  `status` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL,
  `type` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL,
  `update_at` datetime(6) NULL DEFAULT NULL,
  `updated_by` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL,
  `wallet_id` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL,
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB CHARACTER SET = utf8mb4 COLLATE = utf8mb4_general_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of wallet_transaction
-- ----------------------------
INSERT INTO `wallet_transaction` VALUES ('04abec83-9978-4e34-bb10-18d841c391bb', 95000, 95000, 0, '2026-06-11 15:16:59.000000', 'system', 'IN', 'Pending từ đơn hàng: 55', '55', 'ORDER', 'COMPLETED', 'ORDER_RECEIVED', '2026-06-11 15:16:59.000000', NULL, '3c295c7d-70c0-4a3e-bff2-0132260541e5');
INSERT INTO `wallet_transaction` VALUES ('05fa45b8-8da4-45ea-95fa-bcc59dd5461d', 61111, 40996489, 41057600, '2026-07-11 12:39:49.000000', 'system', 'OUT', 'Phạt vi phạm khiếu nại: 66d7572b-30d8-479d-b2e6-7cead6a3cfbb_penalty', '66d7572b-30d8-479d-b2e6-7cead6a3cfbb_penalty', 'COMPLAINT', 'COMPLETED', 'PENALTY', '2026-07-11 12:39:49.000000', NULL, '3c295c7d-70c0-4a3e-bff2-0132260541e5');
INSERT INTO `wallet_transaction` VALUES ('0b3eb4ed-56c6-4440-9408-805668ec6d67', 502550, 0, 502550, '2026-06-24 22:40:14.000000', 'system', 'OUT', 'Thu hồi pending balance do hoàn tiền khiếu nại: d4376d78-430b-4557-8cad-218cd3eaaef9', 'd4376d78-430b-4557-8cad-218cd3eaaef9', 'COMPLAINT', 'COMPLETED', 'CANCEL_PENDING', '2026-06-24 22:40:14.000000', NULL, 'a90ba767-d8bc-4d9c-be12-a9b0f619f518');
INSERT INTO `wallet_transaction` VALUES ('0bb7943a-043f-4f55-b084-a94141c67a0d', 1556950, 40940850, 39383900, '2026-07-11 11:51:25.000000', 'system', 'IN', 'Release từ pending sang available', '1464f8e8-9bad-4365-849a-4d75f9d930f6', 'SETTLEMENT', 'COMPLETED', 'ORDER_RECEIVED', '2026-07-11 11:51:25.000000', NULL, '3c295c7d-70c0-4a3e-bff2-0132260541e5');
INSERT INTO `wallet_transaction` VALUES ('0df77951-7e70-42f4-90fb-522708af8602', 1299600, 25385600, 24086000, '2026-06-16 20:19:00.000000', 'system', 'IN', 'Release từ pending sang available', 'd7382f4c-70c4-42c9-8b77-7349676e3004', 'SETTLEMENT', 'COMPLETED', 'ORDER_RECEIVED', '2026-06-16 20:19:00.000000', NULL, '3c295c7d-70c0-4a3e-bff2-0132260541e5');
INSERT INTO `wallet_transaction` VALUES ('1094610f-e798-4c5e-a946-987922b4046e', 1161109, 1161109, 0, '2026-06-15 18:30:43.000000', 'system', 'IN', 'Pending từ đơn hàng: 65', '65', 'ORDER', 'COMPLETED', 'ORDER_RECEIVED', '2026-06-15 18:30:43.000000', NULL, '3c295c7d-70c0-4a3e-bff2-0132260541e5');
INSERT INTO `wallet_transaction` VALUES ('1109928e-5889-4d73-a7a6-768548a835ec', 555512, 16566212, 16010700, '2026-06-16 16:33:22.000000', 'system', 'IN', 'Release từ pending sang available', '50479878-d539-46c6-b63c-a92185ea4a5b', 'SETTLEMENT', 'COMPLETED', 'ORDER_RECEIVED', '2026-06-16 16:33:22.000000', NULL, '3c295c7d-70c0-4a3e-bff2-0132260541e5');
INSERT INTO `wallet_transaction` VALUES ('11b5f4f0-bb06-486b-865b-9527efa99307', 116850, 41057650, 40940800, '2026-07-11 11:51:25.000000', 'system', 'IN', 'Release từ pending sang available', '7859f712-202d-41de-a6f4-a02c76e508bf', 'SETTLEMENT', 'COMPLETED', 'ORDER_RECEIVED', '2026-07-11 11:51:25.000000', NULL, '3c295c7d-70c0-4a3e-bff2-0132260541e5');
INSERT INTO `wallet_transaction` VALUES ('126694ca-597e-4268-b81d-1f51f1ce9cc4', 3739437.5, 3739437.5, 0, '2026-06-15 18:38:50.000000', 'system', 'IN', 'Pending từ đơn hàng: 66', '66', 'ORDER', 'COMPLETED', 'ORDER_RECEIVED', '2026-06-15 18:38:50.000000', NULL, '3c295c7d-70c0-4a3e-bff2-0132260541e5');
INSERT INTO `wallet_transaction` VALUES ('126d2beb-fce1-412f-bb4e-06ffb6aaa409', 655738, 750738, 95000, '2026-06-11 15:27:29.000000', 'system', 'IN', 'Release từ pending sang available', '19ce6662-c372-4b6a-a5ba-604608450b58', 'SETTLEMENT', 'COMPLETED', 'ORDER_RECEIVED', '2026-06-11 15:27:29.000000', NULL, '3c295c7d-70c0-4a3e-bff2-0132260541e5');
INSERT INTO `wallet_transaction` VALUES ('14e778e0-5b38-412c-92b7-3b1018a8f351', 95000, 95000, 0, '2026-06-16 22:43:39.000000', 'system', 'IN', 'Pending từ đơn hàng: 87', '87', 'ORDER', 'COMPLETED', 'ORDER_RECEIVED', '2026-06-16 22:43:39.000000', NULL, '3c295c7d-70c0-4a3e-bff2-0132260541e5');
INSERT INTO `wallet_transaction` VALUES ('1a39b1be-dfe4-4e04-8ca0-a671cc953cc7', 1161110, 4060010, 2898900, '2026-06-15 18:35:20.000000', 'system', 'IN', 'Release từ pending sang available', 'a13f87c7-7e35-4646-8a18-3c6ee0ef6e32', 'SETTLEMENT', 'COMPLETED', 'ORDER_RECEIVED', '2026-06-15 18:35:20.000000', NULL, '3c295c7d-70c0-4a3e-bff2-0132260541e5');
INSERT INTO `wallet_transaction` VALUES ('1fff5974-f659-450b-be3e-ad769a74aa9b', 114000, 114000, 0, '2026-06-16 16:04:02.000000', 'system', 'IN', 'Pending từ đơn hàng: 69', '69', 'ORDER', 'COMPLETED', 'ORDER_RECEIVED', '2026-06-16 16:04:02.000000', NULL, '3c295c7d-70c0-4a3e-bff2-0132260541e5');
INSERT INTO `wallet_transaction` VALUES ('23be9ca9-87e2-4f24-877a-c9f74a09deb1', 95000, 95000, 0, '2026-06-19 00:22:17.000000', 'system', 'IN', 'Pending từ đơn hàng: 90', '90', 'ORDER', 'COMPLETED', 'ORDER_RECEIVED', '2026-06-19 00:22:17.000000', NULL, '3c295c7d-70c0-4a3e-bff2-0132260541e5');
INSERT INTO `wallet_transaction` VALUES ('2436fa67-3a75-496d-91dc-8dfff3fd714c', 542925, 542925, 0, '2026-06-16 16:35:22.000000', 'system', 'IN', 'Pending từ đơn hàng: 73', '73', 'ORDER', 'COMPLETED', 'ORDER_RECEIVED', '2026-06-16 16:35:22.000000', NULL, '3c295c7d-70c0-4a3e-bff2-0132260541e5');
INSERT INTO `wallet_transaction` VALUES ('2688d584-2531-4db5-8ce7-1c7297bd514e', 1232150, 1232150, 0, '2026-06-16 17:11:19.000000', 'system', 'IN', 'Pending từ đơn hàng: 77', '77', 'ORDER', 'COMPLETED', 'ORDER_RECEIVED', '2026-06-16 17:11:19.000000', NULL, '3c295c7d-70c0-4a3e-bff2-0132260541e5');
INSERT INTO `wallet_transaction` VALUES ('2b250fc2-2a0c-4c96-8dbb-be4af3c60fca', 3739440, 30286140, 26546700, '2026-06-16 20:45:00.000000', 'system', 'IN', 'Release từ pending sang available', '60cebc69-961b-47aa-a0bf-d11233014387', 'SETTLEMENT', 'COMPLETED', 'ORDER_RECEIVED', '2026-06-16 20:45:00.000000', NULL, '3c295c7d-70c0-4a3e-bff2-0132260541e5');
INSERT INTO `wallet_transaction` VALUES ('2b4a2d89-efca-43fd-a9d8-7faa00802510', 1170.4, 118020.4, 116850, '2026-07-11 11:48:56.000000', 'system', 'IN', 'Pending từ đơn hàng: 98', '98', 'ORDER', 'COMPLETED', 'ORDER_RECEIVED', '2026-07-11 11:48:56.000000', NULL, '3c295c7d-70c0-4a3e-bff2-0132260541e5');
INSERT INTO `wallet_transaction` VALUES ('2bf0d96c-774a-4ea6-8be0-7e825040c814', 26450, 389050, 415500, '2026-06-24 22:40:14.000000', 'system', 'OUT', 'Phạt vi phạm khiếu nại: d4376d78-430b-4557-8cad-218cd3eaaef9_penalty', 'd4376d78-430b-4557-8cad-218cd3eaaef9_penalty', 'COMPLAINT', 'COMPLETED', 'PENALTY', '2026-06-24 22:40:14.000000', NULL, 'a90ba767-d8bc-4d9c-be12-a9b0f619f518');
INSERT INTO `wallet_transaction` VALUES ('2c5df736-7f67-4077-aece-4d83a16d2e48', 3739440, 7799450, 4060010, '2026-06-15 18:40:58.000000', 'system', 'IN', 'Release từ pending sang available', '2f76b38b-8788-4182-8345-e1e8a81010d2', 'SETTLEMENT', 'COMPLETED', 'ORDER_RECEIVED', '2026-06-15 18:40:58.000000', NULL, '3c295c7d-70c0-4a3e-bff2-0132260541e5');
INSERT INTO `wallet_transaction` VALUES ('2d6c662f-09fb-4dd3-afa9-8c87235ac46e', 655737.5, 655737.5, 0, '2026-06-11 15:24:29.000000', 'system', 'IN', 'Pending từ đơn hàng: 56', '56', 'ORDER', 'COMPLETED', 'ORDER_RECEIVED', '2026-06-11 15:24:29.000000', NULL, '3c295c7d-70c0-4a3e-bff2-0132260541e5');
INSERT INTO `wallet_transaction` VALUES ('30820928-6783-4e67-8a0b-20b31126f99c', 50000, NULL, NULL, '2026-06-24 22:35:13.000000', 'system', 'OUT', 'VNPay đã chuyển khoản. Mã GD: VNP-3F19181D', '62f4ee36-ea64-4c71-8483-8185103c847f', 'WITHDRAWAL', 'COMPLETED', 'WITHDRAWAL_COMPLETED', '2026-06-24 22:35:13.000000', NULL, 'a90ba767-d8bc-4d9c-be12-a9b0f619f518');
INSERT INTO `wallet_transaction` VALUES ('320f6d11-eebf-43c6-93c6-85fe85f01694', 50000, 824588, 774588, '2026-06-12 15:07:15.000000', 'admin', 'IN', 'Bị từ chối: Thẻ không hợp lệ', '283f360b-a4e4-4fbf-9d43-a2124bd16c70', 'WITHDRAWAL', 'REJECTED', 'WITHDRAWAL_REJECTED', '2026-06-12 15:07:15.000000', NULL, '3c295c7d-70c0-4a3e-bff2-0132260541e5');
INSERT INTO `wallet_transaction` VALUES ('33700dc5-6516-4a4d-8723-f718a84c4932', 844312, 1666750, 822438, '2026-06-15 17:33:37.000000', 'system', 'IN', 'Release từ pending sang available', '4f961ffe-77f4-4caf-9f2a-2a86db985033', 'SETTLEMENT', 'COMPLETED', 'ORDER_RECEIVED', '2026-06-15 17:33:37.000000', NULL, '3c295c7d-70c0-4a3e-bff2-0132260541e5');
INSERT INTO `wallet_transaction` VALUES ('33a6971b-4736-4348-9017-3cbcef7ab4d7', 832675, 832675, 0, '2026-06-16 16:22:00.000000', 'system', 'IN', 'Pending từ đơn hàng: 71', '71', 'ORDER', 'COMPLETED', 'ORDER_RECEIVED', '2026-06-16 16:22:00.000000', NULL, '3c295c7d-70c0-4a3e-bff2-0132260541e5');
INSERT INTO `wallet_transaction` VALUES ('342da744-79bf-44f3-b689-8aade217e248', 976695, 39383895, 38407200, '2026-07-09 16:21:49.000000', 'system', 'IN', 'Release từ pending sang available', 'f3e0afc3-9763-4a3d-ad36-3688ccaf3b33', 'SETTLEMENT', 'COMPLETED', 'ORDER_RECEIVED', '2026-07-09 16:21:49.000000', NULL, '3c295c7d-70c0-4a3e-bff2-0132260541e5');
INSERT INTO `wallet_transaction` VALUES ('368fbb7d-3681-4f08-bdb8-d860068e2187', 7052800, 14852250, 7799450, '2026-06-15 18:47:05.000000', 'system', 'IN', 'Release từ pending sang available', 'ff2ee835-4539-489f-900c-ac91ef60d590', 'SETTLEMENT', 'COMPLETED', 'ORDER_RECEIVED', '2026-06-15 18:47:05.000000', NULL, '3c295c7d-70c0-4a3e-bff2-0132260541e5');
INSERT INTO `wallet_transaction` VALUES ('379ead2a-6c95-4cda-beaa-617fc93ca4d7', 115900, 38312200, 38196300, '2026-06-24 20:48:35.000000', 'system', 'IN', 'Release từ pending sang available', '1860a434-1745-4b6d-ba0e-5d17e85f5999', 'SETTLEMENT', 'COMPLETED', 'ORDER_RECEIVED', '2026-06-24 20:48:35.000000', NULL, '3c295c7d-70c0-4a3e-bff2-0132260541e5');
INSERT INTO `wallet_transaction` VALUES ('38aece62-44af-4801-bba4-584f2d198849', 1161109, 1161109, 0, '2026-06-16 20:23:31.000000', 'system', 'IN', 'Pending từ đơn hàng: 79', '79', 'ORDER', 'COMPLETED', 'ORDER_RECEIVED', '2026-06-16 20:23:31.000000', NULL, '3c295c7d-70c0-4a3e-bff2-0132260541e5');
INSERT INTO `wallet_transaction` VALUES ('3a9db0f8-75f4-4b42-9163-01c70942ccf9', 95000, 95000, 0, '2026-06-11 15:19:28.000000', 'system', 'IN', 'Release từ pending sang available', '26c1275b-5605-4403-86b3-4cfff6834f74', 'SETTLEMENT', 'COMPLETED', 'ORDER_RECEIVED', '2026-06-11 15:19:28.000000', NULL, '3c295c7d-70c0-4a3e-bff2-0132260541e5');
INSERT INTO `wallet_transaction` VALUES ('3b86b16b-4de5-4841-9f68-5b9447ccb53f', 116850, 0, 116850, '2026-06-19 00:41:09.000000', 'system', 'OUT', 'Thu hồi pending balance do hoàn tiền khiếu nại: 18549163-663b-436a-a090-97d0b169042c', '18549163-663b-436a-a090-97d0b169042c', 'COMPLAINT', 'COMPLETED', 'CANCEL_PENDING', '2026-06-19 00:41:09.000000', NULL, '3c295c7d-70c0-4a3e-bff2-0132260541e5');
INSERT INTO `wallet_transaction` VALUES ('4038a52e-c50e-434a-8211-cdc89abaa497', 3739437.5, 3739437.5, 0, '2026-06-16 22:14:18.000000', 'system', 'IN', 'Pending từ đơn hàng: 85', '85', 'ORDER', 'COMPLETED', 'ORDER_RECEIVED', '2026-06-16 22:14:18.000000', NULL, '3c295c7d-70c0-4a3e-bff2-0132260541e5');
INSERT INTO `wallet_transaction` VALUES ('40785c7d-80eb-4e7d-b1da-a1d7c1f80352', 844312.5, 844312.5, 0, '2026-06-16 16:50:17.000000', 'system', 'IN', 'Pending từ đơn hàng: 75', '75', 'ORDER', 'COMPLETED', 'ORDER_RECEIVED', '2026-06-16 16:50:17.000000', NULL, '3c295c7d-70c0-4a3e-bff2-0132260541e5');
INSERT INTO `wallet_transaction` VALUES ('40a5d815-7a3c-4a46-a04f-8a5ba1f9d281', 1211725, 1211725, 0, '2026-06-16 21:46:38.000000', 'system', 'IN', 'Pending từ đơn hàng: 83', '83', 'ORDER', 'COMPLETED', 'ORDER_RECEIVED', '2026-06-16 21:46:38.000000', NULL, '3c295c7d-70c0-4a3e-bff2-0132260541e5');
INSERT INTO `wallet_transaction` VALUES ('4456fb79-9e73-452b-a4a5-342bc7f48a14', 115900, 115900, 0, '2026-06-24 20:45:36.000000', 'system', 'IN', 'Pending từ đơn hàng: 94', '94', 'ORDER', 'COMPLETED', 'ORDER_RECEIVED', '2026-06-24 20:45:36.000000', NULL, '3c295c7d-70c0-4a3e-bff2-0132260541e5');
INSERT INTO `wallet_transaction` VALUES ('45406d93-829e-48ea-8280-b128af3bccb4', 114000, 37909000, 37795000, '2026-06-16 22:38:26.000000', 'system', 'IN', 'Release từ pending sang available', 'b0c275de-a62e-4d30-88b7-ccda7508510f', 'SETTLEMENT', 'COMPLETED', 'ORDER_RECEIVED', '2026-06-16 22:38:26.000000', NULL, '3c295c7d-70c0-4a3e-bff2-0132260541e5');
INSERT INTO `wallet_transaction` VALUES ('46a3026d-b14c-4913-8f8c-58d3eee9cd8c', 116850, 116850, 0, '2026-06-19 00:39:53.000000', 'system', 'IN', 'Pending từ đơn hàng: 92', '92', 'ORDER', 'COMPLETED', 'ORDER_RECEIVED', '2026-06-19 00:39:53.000000', NULL, '3c295c7d-70c0-4a3e-bff2-0132260541e5');
INSERT INTO `wallet_transaction` VALUES ('472bc3e9-38b6-44e2-bb02-a6b5fa004e35', 50000, 415500, 465500, '2026-06-24 22:32:23.000000', '7578ede4-cd3f-4976-8712-3cb87cfc0a21', 'OUT', 'Yêu cầu rút tiền: 62f4ee36-ea64-4c71-8483-8185103c847f', '62f4ee36-ea64-4c71-8483-8185103c847f', 'WITHDRAWAL', 'COMPLETED', 'WITHDRAWAL', '2026-06-24 22:32:23.000000', NULL, 'a90ba767-d8bc-4d9c-be12-a9b0f619f518');
INSERT INTO `wallet_transaction` VALUES ('477806f9-19e9-4fa3-8fb3-110212b183d4', 24274.4, 1956894.4, 1932620, '2026-07-13 18:14:07.000000', 'system', 'IN', 'Pending từ đơn hàng: 109', '109', 'ORDER', 'COMPLETED', 'ORDER_RECEIVED', '2026-07-13 18:14:07.000000', NULL, '3c295c7d-70c0-4a3e-bff2-0132260541e5');
INSERT INTO `wallet_transaction` VALUES ('4f25512d-ae63-49ec-a7e5-3e3a31da9010', 1232150, 31518250, 30286100, '2026-06-16 20:45:00.000000', 'system', 'IN', 'Release từ pending sang available', 'f81d9612-1ded-4c43-8a84-a726a7398c52', 'SETTLEMENT', 'COMPLETED', 'ORDER_RECEIVED', '2026-06-16 20:45:00.000000', NULL, '3c295c7d-70c0-4a3e-bff2-0132260541e5');
INSERT INTO `wallet_transaction` VALUES ('4fe09663-0d3c-4dca-ae20-998619945e29', 95000, 38407200, 38312200, '2026-06-24 20:59:35.000000', 'system', 'IN', 'Release từ pending sang available', '0ec17046-34c9-4177-bbc0-70ce16c1097b', 'SETTLEMENT', 'COMPLETED', 'ORDER_RECEIVED', '2026-06-24 20:59:35.000000', NULL, '3c295c7d-70c0-4a3e-bff2-0132260541e5');
INSERT INTO `wallet_transaction` VALUES ('51d9c905-3595-4968-a144-2b5a098ae5ba', 7052800, 7052800, 0, '2026-06-15 18:44:17.000000', 'system', 'IN', 'Pending từ đơn hàng: 67', '67', 'ORDER', 'COMPLETED', 'ORDER_RECEIVED', '2026-06-15 18:44:17.000000', NULL, '3c295c7d-70c0-4a3e-bff2-0132260541e5');
INSERT INTO `wallet_transaction` VALUES ('52550678-4426-4f75-85a1-644f9a3075cd', 1232810, 43000810, 41768000, '2026-07-13 18:16:49.000000', 'system', 'IN', 'Release từ pending sang available', '6cea13f7-2cc5-450e-b6a2-fd41b4c2fa50', 'SETTLEMENT', 'COMPLETED', 'ORDER_RECEIVED', '2026-07-13 18:16:49.000000', NULL, '3c295c7d-70c0-4a3e-bff2-0132260541e5');
INSERT INTO `wallet_transaction` VALUES ('52dc51e7-2276-422d-a711-c2397b889844', 555512.5, 555512.5, 0, '2026-06-16 16:30:52.000000', 'system', 'IN', 'Pending từ đơn hàng: 72', '72', 'ORDER', 'COMPLETED', 'ORDER_RECEIVED', '2026-06-16 16:30:52.000000', NULL, '3c295c7d-70c0-4a3e-bff2-0132260541e5');
INSERT INTO `wallet_transaction` VALUES ('56ff8f55-30f6-4083-b660-57933a87ed38', 7659945, 11826345, 4166400, '2026-07-13 18:14:38.000000', 'system', 'IN', 'Pending từ đơn hàng: 107', '107', 'ORDER', 'COMPLETED', 'ORDER_RECEIVED', '2026-07-13 18:14:38.000000', NULL, '3c295c7d-70c0-4a3e-bff2-0132260541e5');
INSERT INTO `wallet_transaction` VALUES ('57aa8ccd-dc0a-4cdb-bf40-7fc07709e16e', 6150, 38257450, 38263600, '2026-06-19 00:41:09.000000', 'system', 'OUT', 'Phạt vi phạm khiếu nại: 18549163-663b-436a-a090-97d0b169042c_penalty', '18549163-663b-436a-a090-97d0b169042c_penalty', 'COMPLAINT', 'COMPLETED', 'PENALTY', '2026-06-19 00:41:09.000000', NULL, '3c295c7d-70c0-4a3e-bff2-0132260541e5');
INSERT INTO `wallet_transaction` VALUES ('5c8011e8-c3df-40ec-9f49-bc9ff2309792', 1232805.5, 3189695.5, 1956890, '2026-07-13 18:14:07.000000', 'system', 'IN', 'Pending từ đơn hàng: 110', '110', 'ORDER', 'COMPLETED', 'ORDER_RECEIVED', '2026-07-13 18:14:07.000000', NULL, '3c295c7d-70c0-4a3e-bff2-0132260541e5');
INSERT INTO `wallet_transaction` VALUES ('5df00d14-fe1a-44ad-af4f-1cd0f9ae4f58', 100000, 415500, 315500, '2026-06-24 22:35:52.000000', 'admin', 'IN', 'Bị từ chối: hết tiền', 'f25749f8-9b2e-4eb0-be8e-1bbd6ae16f3e', 'WITHDRAWAL', 'REJECTED', 'WITHDRAWAL_REJECTED', '2026-06-24 22:35:52.000000', NULL, 'a90ba767-d8bc-4d9c-be12-a9b0f619f518');
INSERT INTO `wallet_transaction` VALUES ('6111f183-5c20-4375-ae5e-da32159bd8c7', 1232150, 4971590, 3739440, '2026-06-16 20:42:31.000000', 'system', 'IN', 'Pending từ đơn hàng: 81', '81', 'ORDER', 'COMPLETED', 'ORDER_RECEIVED', '2026-06-16 20:42:31.000000', NULL, '3c295c7d-70c0-4a3e-bff2-0132260541e5');
INSERT INTO `wallet_transaction` VALUES ('65cd59d6-5398-424a-9440-8e9312d8cc89', 50000, 774588, 824588, '2026-06-12 15:06:57.000000', 'bd24206e-d42f-4736-9106-16dca8c687e9', 'OUT', 'Yêu cầu rút tiền: 283f360b-a4e4-4fbf-9d43-a2124bd16c70', '283f360b-a4e4-4fbf-9d43-a2124bd16c70', 'WITHDRAWAL', 'COMPLETED', 'WITHDRAWAL', '2026-06-12 15:06:57.000000', NULL, '3c295c7d-70c0-4a3e-bff2-0132260541e5');
INSERT INTO `wallet_transaction` VALUES ('678a82e3-a47b-4d4c-98ce-b85de7202842', 1232150, 1232150, 0, '2026-06-15 17:37:27.000000', 'system', 'IN', 'Pending từ đơn hàng: 64', '64', 'ORDER', 'COMPLETED', 'ORDER_RECEIVED', '2026-06-15 17:37:27.000000', NULL, '3c295c7d-70c0-4a3e-bff2-0132260541e5');
INSERT INTO `wallet_transaction` VALUES ('6bcb8313-dc28-4c87-b68d-1326a350b180', 1211720, 32729920, 31518200, '2026-06-16 21:43:38.000000', 'system', 'IN', 'Release từ pending sang available', '22ecd68a-546d-4b1f-90db-e4bd8ca2efb9', 'SETTLEMENT', 'COMPLETED', 'ORDER_RECEIVED', '2026-06-16 21:43:38.000000', NULL, '3c295c7d-70c0-4a3e-bff2-0132260541e5');
INSERT INTO `wallet_transaction` VALUES ('6e6b80cb-9ccf-47e6-b2f2-87bc97449fb8', 97850, 872438, 774588, '2026-06-12 15:14:37.000000', 'system', 'IN', 'Release từ pending sang available', '42f27771-48fb-4161-a414-68a3068b687e', 'SETTLEMENT', 'COMPLETED', 'ORDER_RECEIVED', '2026-06-12 15:14:37.000000', NULL, '3c295c7d-70c0-4a3e-bff2-0132260541e5');
INSERT INTO `wallet_transaction` VALUES ('6efe352a-46fd-44da-907f-889668869b14', 114000, 38263600, 38149600, '2026-06-19 00:33:21.000000', 'system', 'IN', 'Release từ pending sang available', 'ef1b2870-8124-47c4-a9d7-d8ba2cb3570d', 'SETTLEMENT', 'COMPLETED', 'ORDER_RECEIVED', '2026-06-19 00:33:21.000000', NULL, '3c295c7d-70c0-4a3e-bff2-0132260541e5');
INSERT INTO `wallet_transaction` VALUES ('6f28e130-8dfe-483c-ae24-290681d0de83', 95000, 38149600, 38054600, '2026-06-19 00:24:20.000000', 'system', 'IN', 'Release từ pending sang available', 'c7b0f3f5-131a-42b5-8474-52901bb61cdb', 'SETTLEMENT', 'COMPLETED', 'ORDER_RECEIVED', '2026-06-19 00:24:20.000000', NULL, '3c295c7d-70c0-4a3e-bff2-0132260541e5');
INSERT INTO `wallet_transaction` VALUES ('7289f3b3-f90d-4e78-b5a8-f7124d2d5c44', 61111, 39357389, 39418500, '2026-06-19 10:09:21.000000', 'system', 'OUT', 'Phạt vi phạm khiếu nại: cd27d017-c01e-49fb-b5a8-55b09e45e1d5_penalty', 'cd27d017-c01e-49fb-b5a8-55b09e45e1d5_penalty', 'COMPLAINT', 'COMPLETED', 'PENALTY', '2026-06-19 10:09:21.000000', NULL, '3c295c7d-70c0-4a3e-bff2-0132260541e5');
INSERT INTO `wallet_transaction` VALUES ('72b7580e-a80e-4772-b844-dc6e492b4b8d', 465500, 465500, 0, '2026-06-24 21:57:18.000000', 'system', 'IN', 'Release từ pending sang available', '7da30f7a-720d-46f4-8ed0-8e0a6908dc69', 'SETTLEMENT', 'COMPLETED', 'ORDER_RECEIVED', '2026-06-24 21:57:18.000000', NULL, 'a90ba767-d8bc-4d9c-be12-a9b0f619f518');
INSERT INTO `wallet_transaction` VALUES ('74604126-0995-40cb-a8fc-13747eeea5c0', 114000, 114000, 0, '2026-06-16 22:35:49.000000', 'system', 'IN', 'Pending từ đơn hàng: 86', '86', 'ORDER', 'COMPLETED', 'ORDER_RECEIVED', '2026-06-16 22:35:49.000000', NULL, '3c295c7d-70c0-4a3e-bff2-0132260541e5');
INSERT INTO `wallet_transaction` VALUES ('75a79241-4e41-4d0e-a777-51bac3fb46ed', 50000, 774588, 824588, '2026-06-12 15:10:55.000000', 'bd24206e-d42f-4736-9106-16dca8c687e9', 'OUT', 'Yêu cầu rút tiền: f29f323e-012a-41a2-b2f2-f6e6d17cb17f', 'f29f323e-012a-41a2-b2f2-f6e6d17cb17f', 'WITHDRAWAL', 'COMPLETED', 'WITHDRAWAL', '2026-06-12 15:10:55.000000', NULL, '3c295c7d-70c0-4a3e-bff2-0132260541e5');
INSERT INTO `wallet_transaction` VALUES ('78ab60da-5f4f-4ba0-bfb7-529b030af955', 832675, 16010675, 15178000, '2026-06-16 16:24:30.000000', 'system', 'IN', 'Release từ pending sang available', '4c1ad000-be05-4d45-9316-4ecb445c2c05', 'SETTLEMENT', 'COMPLETED', 'ORDER_RECEIVED', '2026-06-16 16:24:30.000000', NULL, '3c295c7d-70c0-4a3e-bff2-0132260541e5');
INSERT INTO `wallet_transaction` VALUES ('7b00d3bf-1bbe-4f38-88f2-ad2a0319c869', 95000, 95000, 0, '2026-06-15 18:50:05.000000', 'system', 'IN', 'Pending từ đơn hàng: 68', '68', 'ORDER', 'COMPLETED', 'ORDER_RECEIVED', '2026-06-15 18:50:05.000000', NULL, '3c295c7d-70c0-4a3e-bff2-0132260541e5');
INSERT INTO `wallet_transaction` VALUES ('7b6344fb-697c-4d6c-96d0-c240b1cf68e8', 0, 0, 0, '2026-06-19 00:21:47.000000', 'system', 'IN', 'Pending từ đơn hàng: 89', '89', 'ORDER', 'COMPLETED', 'ORDER_RECEIVED', '2026-06-19 00:21:47.000000', NULL, '3c295c7d-70c0-4a3e-bff2-0132260541e5');
INSERT INTO `wallet_transaction` VALUES ('7f61a1d1-55b4-4ff2-a9ff-2e585ec19df3', 95000, 95000, 0, '2026-06-17 21:16:46.000000', 'system', 'IN', 'Pending từ đơn hàng: 88', '88', 'ORDER', 'COMPLETED', 'ORDER_RECEIVED', '2026-06-17 21:16:46.000000', NULL, '3c295c7d-70c0-4a3e-bff2-0132260541e5');
INSERT INTO `wallet_transaction` VALUES ('818a5cd0-da84-4628-b8b2-a4ca4bfa8638', 76000, 824588, 748588, '2026-06-12 15:01:36.000000', 'system', 'IN', 'Release từ pending sang available', '688a1d8a-02e0-4523-953d-7dc1148ea180', 'SETTLEMENT', 'COMPLETED', 'ORDER_RECEIVED', '2026-06-12 15:01:36.000000', NULL, '3c295c7d-70c0-4a3e-bff2-0132260541e5');
INSERT INTO `wallet_transaction` VALUES ('8ae0af29-8533-4433-af39-bbfe4cb71643', 1232150, 24086050, 22853900, '2026-06-16 17:14:19.000000', 'system', 'IN', 'Release từ pending sang available', '883dcd17-5e7e-4ae2-b139-12fb18776927', 'SETTLEMENT', 'COMPLETED', 'ORDER_RECEIVED', '2026-06-16 17:14:19.000000', NULL, '3c295c7d-70c0-4a3e-bff2-0132260541e5');
INSERT INTO `wallet_transaction` VALUES ('8b1f6669-d270-4a65-b783-2f456a7712af', 1931445, 1932615, 1170, '2026-07-13 18:14:07.000000', 'system', 'IN', 'Pending từ đơn hàng: 108', '108', 'ORDER', 'COMPLETED', 'ORDER_RECEIVED', '2026-07-13 18:14:07.000000', NULL, '3c295c7d-70c0-4a3e-bff2-0132260541e5');
INSERT INTO `wallet_transaction` VALUES ('8b8229c3-dbf6-48de-a813-29e98156eb89', 1161110, 38196290, 39357400, '2026-06-19 10:09:21.000000', 'system', 'OUT', 'Phạt vi phạm khiếu nại: cd27d017-c01e-49fb-b5a8-55b09e45e1d5_reversal', 'cd27d017-c01e-49fb-b5a8-55b09e45e1d5_reversal', 'COMPLAINT', 'COMPLETED', 'PENALTY', '2026-06-19 10:09:21.000000', NULL, '3c295c7d-70c0-4a3e-bff2-0132260541e5');
INSERT INTO `wallet_transaction` VALUES ('8e182f72-7cf2-49c6-806c-e72f88f209a4', 502550, 502550, 0, '2026-06-24 22:39:13.000000', 'system', 'IN', 'Pending từ đơn hàng: 101', '101', 'ORDER', 'COMPLETED', 'ORDER_RECEIVED', '2026-06-24 22:39:13.000000', NULL, 'a90ba767-d8bc-4d9c-be12-a9b0f619f518');
INSERT INTO `wallet_transaction` VALUES ('904453a9-7c98-4857-908f-e06d8665869f', 114000, 15061200, 14947200, '2026-06-16 16:06:06.000000', 'system', 'IN', 'Release từ pending sang available', '494b9d3a-8afd-4da4-b95b-0470644938ac', 'SETTLEMENT', 'COMPLETED', 'ORDER_RECEIVED', '2026-06-16 16:06:06.000000', NULL, '3c295c7d-70c0-4a3e-bff2-0132260541e5');
INSERT INTO `wallet_transaction` VALUES ('920741b3-ef6e-4f75-9e54-e06faf24b796', 1161110, 22853910, 21692800, '2026-06-16 17:07:41.000000', 'system', 'IN', 'Release từ pending sang available', '25f4e084-6117-42ff-addc-9196380f7501', 'SETTLEMENT', 'COMPLETED', 'ORDER_RECEIVED', '2026-06-16 17:07:41.000000', NULL, '3c295c7d-70c0-4a3e-bff2-0132260541e5');
INSERT INTO `wallet_transaction` VALUES ('925d2977-3f00-470c-ac7e-1cd22353fb45', 76000, 76000, 0, '2026-06-12 14:59:07.000000', 'system', 'IN', 'Pending từ đơn hàng: 61', '61', 'ORDER', 'COMPLETED', 'ORDER_RECEIVED', '2026-06-12 14:59:07.000000', NULL, '3c295c7d-70c0-4a3e-bff2-0132260541e5');
INSERT INTO `wallet_transaction` VALUES ('92caf25a-b2ad-437a-abf7-ea4142f492c0', 1299600, 1299600, 0, '2026-06-16 20:16:30.000000', 'system', 'IN', 'Pending từ đơn hàng: 78', '78', 'ORDER', 'COMPLETED', 'ORDER_RECEIVED', '2026-06-16 20:16:30.000000', NULL, '3c295c7d-70c0-4a3e-bff2-0132260541e5');
INSERT INTO `wallet_transaction` VALUES ('9387b6c5-5d4d-4e3a-9e50-5715cff3f6ff', 1211725, 1211725, 0, '2026-06-16 21:40:38.000000', 'system', 'IN', 'Pending từ đơn hàng: 82', '82', 'ORDER', 'COMPLETED', 'ORDER_RECEIVED', '2026-06-16 21:40:38.000000', NULL, '3c295c7d-70c0-4a3e-bff2-0132260541e5');
INSERT INTO `wallet_transaction` VALUES ('93d62382-d386-4121-9065-a75ced22d6ef', 976695, 4166395, 3189700, '2026-07-13 18:14:38.000000', 'system', 'IN', 'Pending từ đơn hàng: 106', '106', 'ORDER', 'COMPLETED', 'ORDER_RECEIVED', '2026-07-13 18:14:38.000000', NULL, '3c295c7d-70c0-4a3e-bff2-0132260541e5');
INSERT INTO `wallet_transaction` VALUES ('947f5aa2-9644-4e27-abf7-fbe692afc1a6', 95000, 38004000, 37909000, '2026-06-16 22:46:39.000000', 'system', 'IN', 'Release từ pending sang available', '5ebf99ad-36eb-4a4f-94a8-128c5f47c705', 'SETTLEMENT', 'COMPLETED', 'ORDER_RECEIVED', '2026-06-16 22:46:39.000000', NULL, '3c295c7d-70c0-4a3e-bff2-0132260541e5');
INSERT INTO `wallet_transaction` VALUES ('95108f58-9334-48d2-b297-b48f02777d69', 44437.5, 38054562.5, 38099000, '2026-06-19 00:17:08.000000', 'system', 'OUT', 'Phạt vi phạm khiếu nại: c49f29cb-46c6-4176-b684-6853f2c7593b', 'c49f29cb-46c6-4176-b684-6853f2c7593b', 'COMPLAINT', 'COMPLETED', 'PENALTY', '2026-06-19 00:17:08.000000', NULL, '3c295c7d-70c0-4a3e-bff2-0132260541e5');
INSERT INTO `wallet_transaction` VALUES ('95ece076-78d8-42e7-b8b4-73c27abf0a8a', 542925, 17109125, 16566200, '2026-06-16 16:38:22.000000', 'system', 'IN', 'Release từ pending sang available', 'ebc3dc84-efed-4fc1-b531-d406cf19edc8', 'SETTLEMENT', 'COMPLETED', 'ORDER_RECEIVED', '2026-06-16 16:38:22.000000', NULL, '3c295c7d-70c0-4a3e-bff2-0132260541e5');
INSERT INTO `wallet_transaction` VALUES ('99cd2d2d-7658-4a43-a589-25e8fb9c8438', 1161109, 1161109, 0, '2026-06-16 17:05:11.000000', 'system', 'IN', 'Pending từ đơn hàng: 76', '76', 'ORDER', 'COMPLETED', 'ORDER_RECEIVED', '2026-06-16 17:05:11.000000', NULL, '3c295c7d-70c0-4a3e-bff2-0132260541e5');
INSERT INTO `wallet_transaction` VALUES ('9acd813a-2162-4d77-8729-1b0c4c3edcdb', 50000, NULL, NULL, '2026-06-19 16:32:07.000000', 'system', 'OUT', 'VNPay đã chuyển khoản. Mã GD: VNP-35CC3BC3', 'dcd05c44-2bc7-495a-a5f4-232a301c881d', 'WITHDRAWAL', 'COMPLETED', 'WITHDRAWAL_COMPLETED', '2026-06-19 16:32:07.000000', NULL, '3c295c7d-70c0-4a3e-bff2-0132260541e5');
INSERT INTO `wallet_transaction` VALUES ('a2087cb0-9de5-4f19-b220-54df32895c4d', 1211720, 33941620, 32729900, '2026-06-16 21:49:19.000000', 'system', 'IN', 'Release từ pending sang available', '9214069d-49a4-4bb6-b392-fee6b17ddde0', 'SETTLEMENT', 'COMPLETED', 'ORDER_RECEIVED', '2026-06-16 21:49:19.000000', NULL, '3c295c7d-70c0-4a3e-bff2-0132260541e5');
INSERT INTO `wallet_transaction` VALUES ('a308e8d6-cc1d-4f09-9f55-bfeea1093428', 1161109, 1161109, 0, '2026-06-19 10:05:15.000000', 'system', 'IN', 'Pending từ đơn hàng: 93', '93', 'ORDER', 'COMPLETED', 'ORDER_RECEIVED', '2026-06-19 10:05:15.000000', NULL, '3c295c7d-70c0-4a3e-bff2-0132260541e5');
INSERT INTO `wallet_transaction` VALUES ('a3bd26e7-17ed-46ec-8aad-6e60be7e4ac1', 3739437.5, 3739437.5, 0, '2026-06-16 20:42:01.000000', 'system', 'IN', 'Pending từ đơn hàng: 80', '80', 'ORDER', 'COMPLETED', 'ORDER_RECEIVED', '2026-06-16 20:42:01.000000', NULL, '3c295c7d-70c0-4a3e-bff2-0132260541e5');
INSERT INTO `wallet_transaction` VALUES ('a3bf1ffd-c03c-44e2-8b2d-80b79117261e', 114000, 34055600, 33941600, '2026-06-16 22:01:39.000000', 'system', 'IN', 'Release từ pending sang available', 'b753887d-e3b4-41ac-8f85-5ca050133456', 'SETTLEMENT', 'COMPLETED', 'ORDER_RECEIVED', '2026-06-16 22:01:39.000000', NULL, '3c295c7d-70c0-4a3e-bff2-0132260541e5');
INSERT INTO `wallet_transaction` VALUES ('a9202df9-8653-4096-85d1-0a1b019d9093', 95000, 14947200, 14852200, '2026-06-16 15:58:05.000000', 'system', 'IN', 'Release từ pending sang available', 'beb7bbfd-a797-438a-b6d7-1a163522bdbc', 'SETTLEMENT', 'COMPLETED', 'ORDER_RECEIVED', '2026-06-16 15:58:05.000000', NULL, '3c295c7d-70c0-4a3e-bff2-0132260541e5');
INSERT INTO `wallet_transaction` VALUES ('aa44aeb0-3c54-4807-8fb2-0301b2a9d73a', 116850, 116850, 0, '2026-07-11 11:48:56.000000', 'system', 'IN', 'Pending từ đơn hàng: 43', '43', 'ORDER', 'COMPLETED', 'ORDER_RECEIVED', '2026-07-11 11:48:56.000000', NULL, '3c295c7d-70c0-4a3e-bff2-0132260541e5');
INSERT INTO `wallet_transaction` VALUES ('aed8555e-87f6-4300-9dc9-3f3cc9ce90fc', 1232150, 2898900, 1666750, '2026-06-15 17:40:27.000000', 'system', 'IN', 'Release từ pending sang available', '0f5fca1e-a0b7-4404-b51f-1dda83471cf0', 'SETTLEMENT', 'COMPLETED', 'ORDER_RECEIVED', '2026-06-15 17:40:27.000000', NULL, '3c295c7d-70c0-4a3e-bff2-0132260541e5');
INSERT INTO `wallet_transaction` VALUES ('b0c4bc50-9f1c-4b6c-8fbc-8006efb038d4', 95000, 38099000, 38004000, '2026-06-17 21:19:15.000000', 'system', 'IN', 'Release từ pending sang available', '1d72d144-afb7-4f99-848e-7858b25e4d1e', 'SETTLEMENT', 'COMPLETED', 'ORDER_RECEIVED', '2026-06-17 21:19:15.000000', NULL, '3c295c7d-70c0-4a3e-bff2-0132260541e5');
INSERT INTO `wallet_transaction` VALUES ('b4e0b059-ba96-4e06-94de-50359a7da8c0', 50000, NULL, NULL, '2026-06-12 14:58:46.000000', 'system', 'OUT', 'VNPay đã chuyển khoản. Mã GD: VNP-330C9BD8', 'b68b5039-cf08-4c65-ab2b-e7c598c71bf8', 'WITHDRAWAL', 'COMPLETED', 'WITHDRAWAL_COMPLETED', '2026-06-12 14:58:46.000000', NULL, '3c295c7d-70c0-4a3e-bff2-0132260541e5');
INSERT INTO `wallet_transaction` VALUES ('b78afc83-9bda-4af9-b906-b67caa489a98', 97850, 97850, 0, '2026-06-12 15:12:07.000000', 'system', 'IN', 'Pending từ đơn hàng: 58', '58', 'ORDER', 'COMPLETED', 'ORDER_RECEIVED', '2026-06-12 15:12:07.000000', NULL, '3c295c7d-70c0-4a3e-bff2-0132260541e5');
INSERT INTO `wallet_transaction` VALUES ('b85d9ded-6efa-49f7-8ff8-a59c6f2d4e7c', 1170.4, 39836570.4, 39835400, '2026-07-13 18:14:49.000000', 'system', 'IN', 'Release từ pending sang available', 'ccf58b61-3793-4d62-9ce6-385679df5a57', 'SETTLEMENT', 'COMPLETED', 'ORDER_RECEIVED', '2026-07-13 18:14:49.000000', NULL, '3c295c7d-70c0-4a3e-bff2-0132260541e5');
INSERT INTO `wallet_transaction` VALUES ('b8d61400-712c-4648-b286-9aacba8b1449', 97850, 97850, 0, '2026-06-11 16:52:21.000000', 'system', 'IN', 'Pending từ đơn hàng: 59', '59', 'ORDER', 'COMPLETED', 'ORDER_RECEIVED', '2026-06-11 16:52:21.000000', NULL, '3c295c7d-70c0-4a3e-bff2-0132260541e5');
INSERT INTO `wallet_transaction` VALUES ('bff4af6d-52b7-4ee6-a64d-c20fd2637085', 116850, 116850, 0, '2026-06-16 16:09:02.000000', 'system', 'IN', 'Pending từ đơn hàng: 70', '70', 'ORDER', 'COMPLETED', 'ORDER_RECEIVED', '2026-06-16 16:09:02.000000', NULL, '3c295c7d-70c0-4a3e-bff2-0132260541e5');
INSERT INTO `wallet_transaction` VALUES ('c130751e-fd7b-4494-bbaf-812bbf1ecda0', 976695, 43977495, 43000800, '2026-07-13 18:16:49.000000', 'system', 'IN', 'Release từ pending sang available', '6ee6054b-d1c1-49af-9198-b3093f6a05e9', 'SETTLEMENT', 'COMPLETED', 'ORDER_RECEIVED', '2026-07-13 18:16:49.000000', NULL, '3c295c7d-70c0-4a3e-bff2-0132260541e5');
INSERT INTO `wallet_transaction` VALUES ('c96dc8dc-a80c-47f2-a6a1-b50f891e3975', 3739437.5, 3739437.5, 0, '2026-06-16 16:45:16.000000', 'system', 'IN', 'Pending từ đơn hàng: 74', '74', 'ORDER', 'COMPLETED', 'ORDER_RECEIVED', '2026-06-16 16:45:16.000000', NULL, '3c295c7d-70c0-4a3e-bff2-0132260541e5');
INSERT INTO `wallet_transaction` VALUES ('c971e053-2250-42fa-80f6-90aec1a1dee6', 465500, 465500, 0, '2026-06-24 21:54:19.000000', 'system', 'IN', 'Pending từ đơn hàng: 100', '100', 'ORDER', 'COMPLETED', 'ORDER_RECEIVED', '2026-06-24 21:54:19.000000', NULL, 'a90ba767-d8bc-4d9c-be12-a9b0f619f518');
INSERT INTO `wallet_transaction` VALUES ('cb07bd81-8e80-4109-ba0f-dcb503efc8ff', 116850, 15178050, 15061200, '2026-06-16 16:11:06.000000', 'system', 'IN', 'Release từ pending sang available', '8897cf7f-4dac-4bf3-9b7c-afac36999dc1', 'SETTLEMENT', 'COMPLETED', 'ORDER_RECEIVED', '2026-06-16 16:11:06.000000', NULL, '3c295c7d-70c0-4a3e-bff2-0132260541e5');
INSERT INTO `wallet_transaction` VALUES ('cf1a9a76-87e8-4c29-833c-57af27a6d129', 50000, NULL, NULL, '2026-06-11 16:53:05.000000', 'system', 'OUT', 'VNPay đã chuyển khoản. Mã GD: VNP-9370D4B4', 'c6cb40de-abb1-463d-98e2-4988fe870ef6', 'WITHDRAWAL', 'COMPLETED', 'WITHDRAWAL_COMPLETED', '2026-06-11 16:53:05.000000', NULL, '3c295c7d-70c0-4a3e-bff2-0132260541e5');
INSERT INTO `wallet_transaction` VALUES ('d21230b6-44f4-4e56-b671-e528e57238b8', 1161110, 39418510, 38257400, '2026-06-19 10:07:44.000000', 'system', 'IN', 'Release từ pending sang available', '6e6fe0fd-a042-49df-a8ba-70c413e6c561', 'SETTLEMENT', 'COMPLETED', 'ORDER_RECEIVED', '2026-06-19 10:07:44.000000', NULL, '3c295c7d-70c0-4a3e-bff2-0132260541e5');
INSERT INTO `wallet_transaction` VALUES ('d35199db-9b60-4d90-a7d8-b04d4b719588', 3739440, 37795040, 34055600, '2026-06-16 22:16:48.000000', 'system', 'IN', 'Release từ pending sang available', '8491f1fd-47bd-4521-aa42-22208c066ac2', 'SETTLEMENT', 'COMPLETED', 'ORDER_RECEIVED', '2026-06-16 22:16:48.000000', NULL, '3c295c7d-70c0-4a3e-bff2-0132260541e5');
INSERT INTO `wallet_transaction` VALUES ('d94b8a1c-7f29-4a06-8900-0e1d1248aec4', 114000, 114000, 0, '2026-06-16 21:59:09.000000', 'system', 'IN', 'Pending từ đơn hàng: 84', '84', 'ORDER', 'COMPLETED', 'ORDER_RECEIVED', '2026-06-16 21:59:09.000000', NULL, '3c295c7d-70c0-4a3e-bff2-0132260541e5');
INSERT INTO `wallet_transaction` VALUES ('d9f6be43-f843-48cd-a878-97f5b62391d7', 1161110, 39835390, 40996500, '2026-07-11 12:39:49.000000', 'system', 'OUT', 'Phạt vi phạm khiếu nại: 66d7572b-30d8-479d-b2e6-7cead6a3cfbb_reversal', '66d7572b-30d8-479d-b2e6-7cead6a3cfbb_reversal', 'COMPLAINT', 'COMPLETED', 'PENALTY', '2026-07-11 12:39:49.000000', NULL, '3c295c7d-70c0-4a3e-bff2-0132260541e5');
INSERT INTO `wallet_transaction` VALUES ('da1f4d88-f526-4ce2-b86b-e0ba7739b4a3', 50000, NULL, NULL, '2026-06-12 15:11:27.000000', 'system', 'OUT', 'VNPay đã chuyển khoản. Mã GD: VNP-021DDF39', 'f29f323e-012a-41a2-b2f2-f6e6d17cb17f', 'WITHDRAWAL', 'COMPLETED', 'WITHDRAWAL_COMPLETED', '2026-06-12 15:11:27.000000', NULL, '3c295c7d-70c0-4a3e-bff2-0132260541e5');
INSERT INTO `wallet_transaction` VALUES ('dc8932f7-2c19-4468-a3f9-0c3946367165', 114000, 114000, 0, '2026-06-19 00:30:51.000000', 'system', 'IN', 'Pending từ đơn hàng: 91', '91', 'ORDER', 'COMPLETED', 'ORDER_RECEIVED', '2026-06-19 00:30:51.000000', NULL, '3c295c7d-70c0-4a3e-bff2-0132260541e5');
INSERT INTO `wallet_transaction` VALUES ('dce0a5c2-8ca8-436d-844d-e29056af1a9a', 50000, 748588, 798588, '2026-06-12 14:57:32.000000', 'bd24206e-d42f-4736-9106-16dca8c687e9', 'OUT', 'Yêu cầu rút tiền: b68b5039-cf08-4c65-ab2b-e7c598c71bf8', 'b68b5039-cf08-4c65-ab2b-e7c598c71bf8', 'WITHDRAWAL', 'COMPLETED', 'WITHDRAWAL', '2026-06-12 14:57:32.000000', NULL, '3c295c7d-70c0-4a3e-bff2-0132260541e5');
INSERT INTO `wallet_transaction` VALUES ('ddeddbad-ebd6-4c8b-b01c-20fc2846b858', 1931440, 41768040, 39836600, '2026-07-13 18:16:49.000000', 'system', 'IN', 'Release từ pending sang available', '24f939b7-5485-44a5-a339-4fa20df29eb1', 'SETTLEMENT', 'COMPLETED', 'ORDER_RECEIVED', '2026-07-13 18:16:49.000000', NULL, '3c295c7d-70c0-4a3e-bff2-0132260541e5');
INSERT INTO `wallet_transaction` VALUES ('dfe53bf6-eae0-4a21-9fe3-5029cce5ae9c', 976695, 976695, 0, '2026-07-09 16:19:20.000000', 'system', 'IN', 'Pending từ đơn hàng: 104', '104', 'ORDER', 'COMPLETED', 'ORDER_RECEIVED', '2026-07-09 16:19:20.000000', NULL, '3c295c7d-70c0-4a3e-bff2-0132260541e5');
INSERT INTO `wallet_transaction` VALUES ('e1040aff-d1bc-474b-b76f-aa04e85c8b7c', 95000, 95000, 0, '2026-06-24 20:57:05.000000', 'system', 'IN', 'Pending từ đơn hàng: 95', '95', 'ORDER', 'COMPLETED', 'ORDER_RECEIVED', '2026-06-24 20:57:05.000000', NULL, '3c295c7d-70c0-4a3e-bff2-0132260541e5');
INSERT INTO `wallet_transaction` VALUES ('e34deaa7-0032-424f-a342-3709b6577518', 97850, 798588, 700738, '2026-06-11 16:55:21.000000', 'system', 'IN', 'Release từ pending sang available', '33116e8b-dc78-45c9-b7c2-9e81811cb0dc', 'SETTLEMENT', 'COMPLETED', 'ORDER_RECEIVED', '2026-06-11 16:55:21.000000', NULL, '3c295c7d-70c0-4a3e-bff2-0132260541e5');
INSERT INTO `wallet_transaction` VALUES ('e718c85a-127b-4837-baff-e9c9b31aac28', 100000, 315500, 415500, '2026-06-24 22:35:41.000000', '7578ede4-cd3f-4976-8712-3cb87cfc0a21', 'OUT', 'Yêu cầu rút tiền: f25749f8-9b2e-4eb0-be8e-1bbd6ae16f3e', 'f25749f8-9b2e-4eb0-be8e-1bbd6ae16f3e', 'WITHDRAWAL', 'COMPLETED', 'WITHDRAWAL', '2026-06-24 22:35:41.000000', NULL, 'a90ba767-d8bc-4d9c-be12-a9b0f619f518');
INSERT INTO `wallet_transaction` VALUES ('ea80302f-09bd-41f1-a556-39fe15ced00c', 0, 38054600, 38054600, '2026-06-19 00:24:17.000000', 'system', 'IN', 'Release từ pending sang available', '9cb078b5-c272-422e-ad4f-fbf8b12e1e36', 'SETTLEMENT', 'COMPLETED', 'ORDER_RECEIVED', '2026-06-19 00:24:17.000000', NULL, '3c295c7d-70c0-4a3e-bff2-0132260541e5');
INSERT INTO `wallet_transaction` VALUES ('ecab9dc6-4ee7-4c58-ba64-926f8d057026', 50000, 700738, 750738, '2026-06-11 16:50:51.000000', 'bd24206e-d42f-4736-9106-16dca8c687e9', 'OUT', 'Yêu cầu rút tiền: c6cb40de-abb1-463d-98e2-4988fe870ef6', 'c6cb40de-abb1-463d-98e2-4988fe870ef6', 'WITHDRAWAL', 'COMPLETED', 'WITHDRAWAL', '2026-06-11 16:50:51.000000', NULL, '3c295c7d-70c0-4a3e-bff2-0132260541e5');
INSERT INTO `wallet_transaction` VALUES ('ed789215-0fcc-470f-9da9-b393ca15d209', 844312.5, 844312.5, 0, '2026-06-15 17:31:08.000000', 'system', 'IN', 'Pending từ đơn hàng: 63', '63', 'ORDER', 'COMPLETED', 'ORDER_RECEIVED', '2026-06-15 17:31:08.000000', NULL, '3c295c7d-70c0-4a3e-bff2-0132260541e5');
INSERT INTO `wallet_transaction` VALUES ('ef89e4aa-1a54-4560-8228-dfd4bba6e054', 1161110, 26546710, 25385600, '2026-06-16 20:26:00.000000', 'system', 'IN', 'Release từ pending sang available', 'c8de0a50-257b-4dee-a9bb-a5970c77fa3a', 'SETTLEMENT', 'COMPLETED', 'ORDER_RECEIVED', '2026-06-16 20:26:00.000000', NULL, '3c295c7d-70c0-4a3e-bff2-0132260541e5');
INSERT INTO `wallet_transaction` VALUES ('f0357611-1277-45a7-876f-3131f327f0f3', 844312, 21692812, 20848500, '2026-06-16 16:53:16.000000', 'system', 'IN', 'Release từ pending sang available', 'a59cc0fa-bc41-4ed5-886e-6fba3f9b3b9c', 'SETTLEMENT', 'COMPLETED', 'ORDER_RECEIVED', '2026-06-16 16:53:16.000000', NULL, '3c295c7d-70c0-4a3e-bff2-0132260541e5');
INSERT INTO `wallet_transaction` VALUES ('f207c9b9-9ea5-447a-b740-4f2f7c4839d3', 1556945.5, 1674965.5, 118020, '2026-07-11 11:48:56.000000', 'system', 'IN', 'Pending từ đơn hàng: 105', '105', 'ORDER', 'COMPLETED', 'ORDER_RECEIVED', '2026-07-11 11:48:56.000000', NULL, '3c295c7d-70c0-4a3e-bff2-0132260541e5');
INSERT INTO `wallet_transaction` VALUES ('f3a533c2-4a8a-4bf2-9399-a6b958bad3ac', 7659940, 51637440, 43977500, '2026-07-13 18:16:49.000000', 'system', 'IN', 'Release từ pending sang available', '74cc7cb5-f025-4c86-b8fb-33ba6c2ad423', 'SETTLEMENT', 'COMPLETED', 'ORDER_RECEIVED', '2026-07-13 18:16:49.000000', NULL, '3c295c7d-70c0-4a3e-bff2-0132260541e5');
INSERT INTO `wallet_transaction` VALUES ('f77da84f-f2a9-4a7f-b7c1-d0657357a419', 3739440, 20848540, 17109100, '2026-06-16 16:48:16.000000', 'system', 'IN', 'Release từ pending sang available', '7ddf1e0d-79a9-4a59-8cb2-296e2db6dbec', 'SETTLEMENT', 'COMPLETED', 'ORDER_RECEIVED', '2026-06-16 16:48:16.000000', NULL, '3c295c7d-70c0-4a3e-bff2-0132260541e5');
INSERT INTO `wallet_transaction` VALUES ('fb537469-480f-4bed-86e2-dd4ce97dcb5e', 50000, 822438, 872438, '2026-06-12 15:22:46.000000', 'bd24206e-d42f-4736-9106-16dca8c687e9', 'OUT', 'Yêu cầu rút tiền: dcd05c44-2bc7-495a-a5f4-232a301c881d', 'dcd05c44-2bc7-495a-a5f4-232a301c881d', 'WITHDRAWAL', 'COMPLETED', 'WITHDRAWAL', '2026-06-12 15:22:46.000000', NULL, '3c295c7d-70c0-4a3e-bff2-0132260541e5');

-- ----------------------------
-- Table structure for withdrawal_request
-- ----------------------------
DROP TABLE IF EXISTS `withdrawal_request`;
CREATE TABLE `withdrawal_request`  (
  `id` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `account_holder_name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL,
  `amount` double NULL DEFAULT NULL,
  `bank_account_number` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL,
  `bank_name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL,
  `created_at` datetime(6) NULL DEFAULT NULL,
  `created_by` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL,
  `processed_at` datetime(6) NULL DEFAULT NULL,
  `processed_by` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL,
  `reject_reason` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL,
  `status` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL,
  `store_id` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL,
  `update_at` datetime(6) NULL DEFAULT NULL,
  `updated_by` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL,
  `wallet_id` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL,
  `vnpay_fail_reason` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL,
  `vnpay_transaction_code` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL,
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB CHARACTER SET = utf8mb4 COLLATE = utf8mb4_general_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of withdrawal_request
-- ----------------------------
INSERT INTO `withdrawal_request` VALUES ('283f360b-a4e4-4fbf-9d43-a2124bd16c70', 'Nguyen Van A', 50000, '0982782182814', 'NCB', '2026-06-12 15:06:57.000000', 'bd24206e-d42f-4736-9106-16dca8c687e9', '2026-06-12 15:07:15.000000', 'admin', NULL, 'REJECTED', 'bd24206e-d42f-4736-9106-16dca8c687e9', '2026-06-12 15:06:57.000000', NULL, '3c295c7d-70c0-4a3e-bff2-0132260541e5', 'Thẻ không hợp lệ', NULL);
INSERT INTO `withdrawal_request` VALUES ('62f4ee36-ea64-4c71-8483-8185103c847f', 'NGUYEN VAN A', 50000, '1234567890', 'ACB', '2026-06-24 22:32:23.000000', '7578ede4-cd3f-4976-8712-3cb87cfc0a21', '2026-06-24 22:35:13.000000', 'admin', NULL, 'COMPLETED', '7578ede4-cd3f-4976-8712-3cb87cfc0a21', '2026-06-24 22:32:23.000000', NULL, 'a90ba767-d8bc-4d9c-be12-a9b0f619f518', NULL, 'VNP-3F19181D');
INSERT INTO `withdrawal_request` VALUES ('b68b5039-cf08-4c65-ab2b-e7c598c71bf8', 'Nguyen Van A', 50000, '123214', 'NCB', '2026-06-12 14:57:32.000000', 'bd24206e-d42f-4736-9106-16dca8c687e9', '2026-06-12 14:58:46.000000', 'admin', NULL, 'COMPLETED', 'bd24206e-d42f-4736-9106-16dca8c687e9', '2026-06-12 14:57:32.000000', NULL, '3c295c7d-70c0-4a3e-bff2-0132260541e5', NULL, 'VNP-330C9BD8');
INSERT INTO `withdrawal_request` VALUES ('c6cb40de-abb1-463d-98e2-4988fe870ef6', 'NGUYEN VAN A', 50000, '9704198526191432198', 'NCB', '2026-06-11 16:50:51.000000', 'bd24206e-d42f-4736-9106-16dca8c687e9', '2026-06-11 16:53:05.000000', 'admin', NULL, 'COMPLETED', 'bd24206e-d42f-4736-9106-16dca8c687e9', '2026-06-11 16:50:51.000000', NULL, '3c295c7d-70c0-4a3e-bff2-0132260541e5', NULL, 'VNP-9370D4B4');
INSERT INTO `withdrawal_request` VALUES ('dcd05c44-2bc7-495a-a5f4-232a301c881d', 'Nguyen Van A', 50000, '1241947021', 'NCB', '2026-06-12 15:22:46.000000', 'bd24206e-d42f-4736-9106-16dca8c687e9', '2026-06-19 16:32:07.000000', 'admin', NULL, 'COMPLETED', 'bd24206e-d42f-4736-9106-16dca8c687e9', '2026-06-12 15:22:46.000000', NULL, '3c295c7d-70c0-4a3e-bff2-0132260541e5', NULL, 'VNP-35CC3BC3');
INSERT INTO `withdrawal_request` VALUES ('f25749f8-9b2e-4eb0-be8e-1bbd6ae16f3e', 'NGUYEN VAN A', 100000, '1234567890', 'NCB', '2026-06-24 22:35:41.000000', '7578ede4-cd3f-4976-8712-3cb87cfc0a21', '2026-06-24 22:35:52.000000', 'admin', NULL, 'REJECTED', '7578ede4-cd3f-4976-8712-3cb87cfc0a21', '2026-06-24 22:35:41.000000', NULL, 'a90ba767-d8bc-4d9c-be12-a9b0f619f518', 'hết tiền', NULL);
INSERT INTO `withdrawal_request` VALUES ('f29f323e-012a-41a2-b2f2-f6e6d17cb17f', 'Nguyen Van A', 50000, '912847124', 'NCB', '2026-06-12 15:10:55.000000', 'bd24206e-d42f-4736-9106-16dca8c687e9', '2026-06-12 15:11:27.000000', 'admin', NULL, 'COMPLETED', 'bd24206e-d42f-4736-9106-16dca8c687e9', '2026-06-12 15:10:55.000000', NULL, '3c295c7d-70c0-4a3e-bff2-0132260541e5', NULL, 'VNP-021DDF39');

SET FOREIGN_KEY_CHECKS = 1;
