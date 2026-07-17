-- MySQL dump 10.13  Distrib 8.0.46, for Linux (x86_64)
--
-- Host: localhost    Database: usersdb
-- ------------------------------------------------------
-- Server version	8.0.46

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `account`
--

DROP TABLE IF EXISTS `account`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `account` (
  `username` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `created_at` datetime(6) DEFAULT NULL,
  `created_by` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `password` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `role` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `store_role_id` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `update_at` datetime(6) DEFAULT NULL,
  `updated_by` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `user_id` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  PRIMARY KEY (`username`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci ROW_FORMAT=DYNAMIC;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `account`
--

LOCK TABLES `account` WRITE;
/*!40000 ALTER TABLE `account` DISABLE KEYS */;
INSERT INTO `account` VALUES ('abc','2026-06-04 21:43:03.000000','abc','$2a$10$Aw5xtqBVmslCK7BCmluRrOJODzQwnb.2CAel1aXclkUPLDDX8QNeK','USER','','2026-06-04 21:43:03.000000','abc','bed931db-1d1c-40b7-b84c-c4d146de6a09'),('abcde','2026-06-18 12:22:50.000000','abcde','$2a$10$EUgfU3fX9tupbaceVod6NeX/QTN3kwERPIEZBAD3Ue0VDAkAttiTe','SELLER','6a1e4f05-e1fd-4de8-8603-0beee401ee2a','2026-06-22 16:18:21.000000','abcde','3c45eba9-0d3c-49bc-8509-cfe41507f406'),('admin','2026-05-28 22:30:39.000000','system','$2a$10$wYnstkmX33SZn4f4pdJF/OSNhXeLYIsAXTE/aEBuD9zq/EZOzjZJ.','ADMIN',NULL,'2026-05-28 22:30:39.000000','system','a064d764-f66a-41cc-9351-87249e97b105'),('admin1','2026-06-19 16:09:53.000000','system','$2a$10$uryFG4tnmdZ3ipSW97LKauKxrDicDkXNgS4NIpQ6IdDQu3131Pl3.','ADMIN',NULL,'2026-06-19 16:09:53.000000','system','6c137f53-6c8c-461d-8477-5917294a474b'),('admin2','2026-06-19 16:09:53.000000','system','$2a$10$hd71lfTKnjuVbkxaLTlzOuSOCkG/yVNFw0gTUn04/VlzdfmlZ0YNq','ADMIN',NULL,'2026-06-19 16:09:53.000000','system','f9efffc5-f4ac-4182-9107-926103220452'),('bts','2026-06-19 17:11:46.000000','bts','$2a$10$8DwqJoDaKmGO/RJ4J.n6c.1CbsZAHwQznNZcs1PDtUUND/ds4TOUe','USER',NULL,'2026-06-23 17:47:23.000000','bts','d03dc9ef-6f39-4e3b-8794-22c2ece4406a'),('cashier','2026-06-11 18:50:31.000000','cashier','$2a$10$iNAj8Yc9dwvnduLwP3IrpOk9Z7NQePVoSHGisxtsvH1x2gfH3uyR2','SELLER','324918ec-41db-45e9-80c9-81bdab597b93','2026-06-19 17:21:18.000000','cashier','be5acd90-0505-4abd-a243-8d27a21e51c8'),('exo','2026-06-22 16:40:25.000000','exo','$2a$10$Xaav26Lth3xUcJPER2PioOnEtppzYoBNSHF6uj7rF7RSgcjo3wkK2','SELLER','7bece000-b02b-4efa-8b5b-c1d1fb2d6d3b','2026-06-24 21:23:53.000000','exo','e9eb5b42-14e9-47c2-854a-562fa8579bc2'),('google_116581109411755024402','2026-05-08 11:17:08.000000','google_116581109411755024402','19032680-40ad-4a69-ba5d-d69ef9570919','USER',NULL,'2026-05-29 08:28:47.000000','google_116581109411755024402','45841b96-6a49-4879-b4ca-13d1cb80b4a2'),('hang123','2026-06-04 23:11:44.000000','hang123','$2a$10$0M9JvXLjcZRdA3ANftyD..7LjfjVJV3VqdZ.BRWhHrpsbus5j6l/y','SELLER','0320ffbc-8aa7-43f9-a923-fd6c2a45af41','2026-06-19 17:21:18.000000','hang123','e5ce55f2-f8f5-4b6a-a416-ec4c6f2480b4'),('pikachuu1','2026-06-24 21:24:57.000000','pikachu','$2a$10$2NnUumjb6iFOkJ9Jdah.ke9RvfTGI4ANxyVLP.gkv0gOCdCruS2QO','SELLER','97b35ad7-0468-4a94-a6f3-217be05e612a','2026-06-24 21:32:36.000000','pikachu','35ab910f-0158-4869-8d2d-d07a2e627991'),('productmanager','2026-06-19 16:18:40.000000','system','$2a$10$JF6MKx0JfvzJA5BbizNvLe6emYXVf7mQ9SZAxJquWUnNP9sr2U/gG','ADMIN',NULL,'2026-06-19 16:18:40.000000','system','928942c5-2566-4ddd-9a7e-65d86c8b1647'),('shopmanager','2026-06-19 16:18:40.000000','system','$2a$10$7ys9ThwewuGOAgJYxKaCOu/uitzfmMYb4Z41knkhwu96sryNHm2c6','ADMIN',NULL,'2026-06-19 16:18:40.000000','system','8ec9866c-935c-495d-a30d-7f7cf4e5a1cc'),('testuser','2026-05-07 11:09:47.000000','testuser','$2a$10$Xaav26Lth3xUcJPER2PioOnEtppzYoBNSHF6uj7rF7RSgcjo3wkK2','SELLER','408f338f-6c29-4073-af8a-52534fc616d6','2026-06-19 17:21:18.000000','testuser','9ae5e6ec-3d7b-452b-ac1a-ea01c1d05b31'),('thngan','2026-05-07 11:08:27.000000','thngan','$2a$10$D.LLKWxKp.v3TChHeEqqbehMqCereb49YtP3jcoI7wZfJ00ErDQhi','SELLER','fcecea5e-6f6c-496d-b175-e11e2d0ed01a','2026-06-19 17:21:18.000000','thngan','78ba2416-158a-4001-80e2-34785504b1a5'),('thu123','2026-05-07 23:00:00.000000','thuthu','$2a$10$.5CPlu.Lwtg3m6XfGr/9U.FzQTiqaCNXfV5cNUDf.Q6JsgQ3nhh7C','USER',NULL,'2026-05-07 23:31:58.000000','thuthu','c41636a7-61fe-4f6f-9456-ae1d99550945'),('thungan','2026-06-11 18:18:03.000000','thungan','$2a$10$v6FW97ESovLv/A9cJRRGQ.yxZuEfemRy7C6F8CUxH0wtx2UVQCzgm','USER',NULL,'2026-06-11 18:19:28.000000','thungan','05f9e130-8712-484c-971e-0670a837f6ca'),('thungan050804@gmail.com','2026-06-11 18:24:07.000000','thungan050804@gmail.com','f3a26822-2ceb-49a5-bd2a-fe543fd6e4ff','USER',NULL,'2026-06-11 18:24:07.000000','thungan050804@gmail.com','048ee526-036f-4cc2-a95c-4ac64f5c8204'),('thungan123','2026-05-25 20:59:25.000000','thungan123','$2a$10$vFR.4HEc5wO3GXGg4UiMce7OpiHXMGdLLG7RYDtDMurJ0Acyael9S','SELLER','a18a3868-cd52-46f3-92f7-a6664aa7b446','2026-06-19 17:21:18.000000','thungan123','048ee526-036f-4cc2-a95c-4ac64f5c8204'),('tien','2026-06-04 22:54:35.000000','tien','$2a$10$rFpQ7plEUgMCjfq/uTiSDebBzyBDEts.ef1qTyxhtNNSDPVTPQi3q','USER',NULL,'2026-06-24 20:42:37.000000','tien','20d428c7-bc91-49de-b321-17d40dae8a68');
/*!40000 ALTER TABLE `account` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `admin_activity_log`
--

DROP TABLE IF EXISTS `admin_activity_log`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `admin_activity_log` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `action` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `admin_id` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `admin_name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `category` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `created_at` datetime(6) NOT NULL,
  `is_read` bit(1) NOT NULL,
  `target` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  PRIMARY KEY (`id`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=43 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci ROW_FORMAT=DYNAMIC;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `admin_activity_log`
--

LOCK TABLES `admin_activity_log` WRITE;
/*!40000 ALTER TABLE `admin_activity_log` DISABLE KEYS */;
INSERT INTO `admin_activity_log` VALUES (42,'Thêm chính sách','a064d764-f66a-41cc-9351-87249e97b105','System Admin','policy','2026-07-15 16:04:33.987555',_binary '\0','Liên Hệ');
/*!40000 ALTER TABLE `admin_activity_log` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `password_reset_token`
--

DROP TABLE IF EXISTS `password_reset_token`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `password_reset_token` (
  `id` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `expiry_date` datetime(6) NOT NULL,
  `is_used` tinyint(1) NOT NULL DEFAULT '0',
  `token` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `user_id` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `username` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  PRIMARY KEY (`id`) USING BTREE,
  UNIQUE KEY `UKg0guo4k8krgpwuagos61oc06j` (`token`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci ROW_FORMAT=DYNAMIC;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `password_reset_token`
--

LOCK TABLES `password_reset_token` WRITE;
/*!40000 ALTER TABLE `password_reset_token` DISABLE KEYS */;
/*!40000 ALTER TABLE `password_reset_token` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `permission`
--

DROP TABLE IF EXISTS `permission`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `permission` (
  `id` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `created_at` datetime(6) DEFAULT NULL,
  `created_by` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `instance` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `permission` varchar(10) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `update_at` datetime(6) DEFAULT NULL,
  `updated_by` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `user_id` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  PRIMARY KEY (`id`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci ROW_FORMAT=DYNAMIC;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `permission`
--

LOCK TABLES `permission` WRITE;
/*!40000 ALTER TABLE `permission` DISABLE KEYS */;
INSERT INTO `permission` VALUES ('06288ecc-b30f-4e81-a718-8a5db9e52d0c','2026-07-15 15:51:50.000037','system','dashboard','READ','2026-07-15 15:51:50.000064','system','928942c5-2566-4ddd-9a7e-65d86c8b1647'),('08e0a4f1-f94d-415d-a59b-66f8f86d31cc','2026-06-22 16:40:25.000000','exo','DEFAULT','READ','2026-06-22 16:40:25.000000','exo','e9eb5b42-14e9-47c2-854a-562fa8579bc2'),('1a45c85c-c882-4972-be44-fedb60c4afc0','2026-05-07 22:59:59.000000','thuthu','DEFAULT','READ','2026-05-07 22:59:59.000000','thuthu','c41636a7-61fe-4f6f-9456-ae1d99550945'),('28374ad1-c7a2-4d3b-8571-18f7bdb4fbd5','2026-06-23 17:47:23.000000','system','DEFAULT','READ','2026-06-23 17:47:23.000000','system','d03dc9ef-6f39-4e3b-8794-22c2ece4406a'),('28774645-1eaf-46c6-8a44-d1482df6b292','2026-05-25 20:59:25.000000','thungan123','DEFAULT','READ','2026-05-25 20:59:25.000000','thungan123','048ee526-036f-4cc2-a95c-4ac64f5c8204'),('2de96593-8ad8-4ae2-8e04-7ebdb03ba69f','2026-07-15 15:51:50.003987','system','products','READ','2026-07-15 15:51:50.004012','system','928942c5-2566-4ddd-9a7e-65d86c8b1647'),('2f29bcfe-6c07-44ab-8147-22dc53d31106','2026-05-07 11:09:47.000000','testuser','DEFAULT','READ','2026-05-07 11:09:47.000000','testuser','9ae5e6ec-3d7b-452b-ac1a-ea01c1d05b31'),('36839e43-1f0c-40c6-a226-a9dd545df50f','2026-07-15 15:51:49.889968','system','shops','READ','2026-07-15 15:51:49.889992','system','8ec9866c-935c-495d-a30d-7f7cf4e5a1cc'),('36d1be58-f84f-4fe8-b016-0d9c211052b6','2026-06-18 12:22:50.000000','abcde','DEFAULT','READ','2026-06-18 12:22:50.000000','abcde','3c45eba9-0d3c-49bc-8509-cfe41507f406'),('4414a4aa-d191-4ab8-9424-e3dff9d676e9','2026-05-08 11:17:08.000000','google_116581109411755024402','DEFAULT','READ','2026-05-08 11:17:08.000000','google_116581109411755024402','45841b96-6a49-4879-b4ca-13d1cb80b4a2'),('494f461b-20ff-4b28-b02d-344cb0a5b5e2','2026-06-11 18:50:31.000000','cashier','DEFAULT','READ','2026-06-11 18:50:31.000000','cashier','be5acd90-0505-4abd-a243-8d27a21e51c8'),('6add3f47-1ac5-4b1e-ac85-452fb12d4c96','2026-05-07 11:08:27.000000','thngan','DEFAULT','READ','2026-05-07 11:08:27.000000','thngan','78ba2416-158a-4001-80e2-34785504b1a5'),('76851556-3d36-4e17-85c2-df05ccb695f5','2026-07-15 15:51:49.885082','system','dashboard','READ','2026-07-15 15:51:49.885100','system','8ec9866c-935c-495d-a30d-7f7cf4e5a1cc'),('867a38d3-99f6-4226-8d54-96a4ec549f4f','2026-06-24 21:24:57.000000','pikachu','DEFAULT','READ','2026-06-24 21:24:57.000000','pikachu','35ab910f-0158-4869-8d2d-d07a2e627991'),('868d2d70-06bd-4a75-96d4-53cc6363a374','2026-06-19 16:09:53.000000','system','users','READ','2026-06-19 16:09:53.000000','system','6c137f53-6c8c-461d-8477-5917294a474b'),('8aaee6d1-4b20-4dea-9cc3-5903c6228008','2026-06-11 18:18:03.000000','thungan','DEFAULT','READ','2026-06-11 18:18:03.000000','thungan','05f9e130-8712-484c-971e-0670a837f6ca'),('9552e433-a944-41a5-a0ca-4fb113e52e2a','2026-07-15 15:51:49.887328','system','users','READ','2026-07-15 15:51:49.887342','system','8ec9866c-935c-495d-a30d-7f7cf4e5a1cc'),('9f1a38b0-6e79-400a-91a4-9de2867beac2','2026-06-24 20:42:37.000000','system','DEFAULT','READ','2026-06-24 20:42:37.000000','system','20d428c7-bc91-49de-b321-17d40dae8a68'),('b4c51867-6b5e-4427-bf58-f6447a9d4716','2026-07-15 15:51:49.604694','system','ALL','READ','2026-07-15 15:51:49.604715','system','a064d764-f66a-41cc-9351-87249e97b105'),('cf5b34af-719c-441f-b903-bdea34147199','2026-06-19 16:09:53.000000','system','dashboard','READ','2026-06-19 16:09:53.000000','system','6c137f53-6c8c-461d-8477-5917294a474b'),('d766166d-4175-45f1-bfa2-fd4119098a55','2026-06-19 16:09:53.000000','system','shops','READ','2026-06-19 16:09:53.000000','system','f9efffc5-f4ac-4182-9107-926103220452'),('dac8c0de-6609-4396-b79b-c86fd0cfa99e','2026-06-19 16:09:53.000000','system','dashboard','READ','2026-06-19 16:09:53.000000','system','f9efffc5-f4ac-4182-9107-926103220452'),('eaa2ea21-a0fd-4b26-a884-8598a8a1d590','2026-06-04 23:11:43.000000','hang123','DEFAULT','READ','2026-06-04 23:11:43.000000','hang123','e5ce55f2-f8f5-4b6a-a416-ec4c6f2480b4'),('f5fbe75e-8acf-4009-bc48-bfee39dc467e','2026-06-04 21:43:02.000000','abc','DEFAULT','READ','2026-06-04 21:43:02.000000','abc','bed931db-1d1c-40b7-b84c-c4d146de6a09');
/*!40000 ALTER TABLE `permission` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `policy`
--

DROP TABLE IF EXISTS `policy`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `policy` (
  `id` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `content` longtext COLLATE utf8mb4_unicode_ci,
  `created_at` datetime(6) DEFAULT NULL,
  `status` varchar(20) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `title` text COLLATE utf8mb4_unicode_ci,
  `type` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `updated_at` datetime(6) DEFAULT NULL,
  `created_by` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `updated_by` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `policy`
--

LOCK TABLES `policy` WRITE;
/*!40000 ALTER TABLE `policy` DISABLE KEYS */;
INSERT INTO `policy` VALUES ('df175cc6-43a2-45c9-9316-15386d40b8c4','Liên Hệ Hotline: 0862162224','2026-07-15 16:04:31.795522','ACTIVE','Liên Hệ','terms','2026-07-15 16:04:31.795535','a064d764-f66a-41cc-9351-87249e97b105',NULL);
/*!40000 ALTER TABLE `policy` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `storerole`
--

DROP TABLE IF EXISTS `storerole`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `storerole` (
  `id` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `created_at` datetime(6) DEFAULT NULL,
  `created_by` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `role` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `status` varchar(10) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `store_role` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `update_at` datetime(6) DEFAULT NULL,
  `updated_by` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  PRIMARY KEY (`id`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci ROW_FORMAT=DYNAMIC;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `storerole`
--

LOCK TABLES `storerole` WRITE;
/*!40000 ALTER TABLE `storerole` DISABLE KEYS */;
INSERT INTO `storerole` VALUES ('0320ffbc-8aa7-43f9-a923-fd6c2a45af41','2026-06-04 23:12:55.000000','admin','SELLER','active','d31fc09d-5f73-43b0-b18c-fddf02e178da','2026-06-04 23:12:55.000000',NULL),('0e05ea0c-ab93-4484-85df-8ca62fe55203','2026-05-29 08:28:47.000000','admin','ADMIN','ACTIVE','DEFAULT','2026-05-29 08:38:12.000000','admin'),('1caeef91-e8dd-40a9-a7c2-d85b5e4d173c','2026-06-04 21:43:02.000000','abc','USER','ACTIVE','DEFAULT','2026-06-04 21:43:02.000000','abc'),('324918ec-41db-45e9-80c9-81bdab597b93','2026-06-11 19:03:59.000000','admin','SELLER','active','2700cc0c-60c0-41cc-9a46-0e516231e1d8','2026-06-11 19:03:59.000000',NULL),('3fddef99-941d-438b-9e86-aacc35ae5592','2026-06-19 17:12:50.000000','admin','SELLER','active','2f5a3cc2-f2e9-436d-bce9-40c9ab71333c','2026-06-19 17:12:50.000000',NULL),('408f338f-6c29-4073-af8a-52534fc616d6','2026-05-07 11:09:47.000000','testuser','SELLER','ACTIVE','DEFAULT','2026-05-07 11:09:47.000000','testuser'),('6a1e4f05-e1fd-4de8-8603-0beee401ee2a','2026-06-22 16:18:21.000000','admin','SELLER','active','6776e6c8-97d1-4f0a-b581-0be818ca6b42','2026-06-22 16:18:21.000000',NULL),('7bece000-b02b-4efa-8b5b-c1d1fb2d6d3b','2026-06-24 21:23:53.000000','admin','SELLER','active','17c0bfc7-38de-47e9-a970-36f933e428c1','2026-06-24 21:23:53.000000',NULL),('97b35ad7-0468-4a94-a6f3-217be05e612a','2026-06-24 21:28:32.000000','admin','SELLER','active','7578ede4-cd3f-4976-8712-3cb87cfc0a21','2026-06-24 21:28:32.000000',NULL),('a18a3868-cd52-46f3-92f7-a6664aa7b446','2026-05-25 20:59:25.000000','thungan123','SELLER','ACTIVE','DEFAULT','2026-05-29 08:45:03.000000','thungan123'),('c377804b-4c26-429f-9466-cc90e1e150d1','2026-05-07 22:59:59.000000','thuthu','SELLER','ACTIVE','DEFAULT','2026-05-07 22:59:59.000000','thuthu'),('ddd14e79-2116-45f9-a019-e52290128e73','2026-05-08 11:17:08.000000','google_116581109411755024402','USER','ACTIVE','DEFAULT','2026-05-08 11:17:08.000000','google_116581109411755024402'),('e7508de4-b7ed-419d-9f22-454e0abdfeae','2026-06-04 23:10:49.000000','admin','SELLER','active','36c34cc4-3830-4729-bb41-dd3c57a884ee','2026-06-04 23:10:49.000000',NULL),('fcecea5e-6f6c-496d-b175-e11e2d0ed01a','2026-05-07 11:08:27.000000','thngan','SELLER','ACTIVE','DEFAULT','2026-05-07 11:08:27.000000','thngan');
/*!40000 ALTER TABLE `storerole` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `user`
--

DROP TABLE IF EXISTS `user`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `user` (
  `id` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `address` text CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci,
  `birthday` datetime(6) DEFAULT NULL,
  `created_at` datetime(6) DEFAULT NULL,
  `email` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `full_name` text CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci,
  `image` text CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci,
  `permission` text CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci,
  `rank_id` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `role` text CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci,
  `status` varchar(10) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `update_at` datetime(6) DEFAULT NULL,
  PRIMARY KEY (`id`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci ROW_FORMAT=DYNAMIC;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `user`
--

LOCK TABLES `user` WRITE;
/*!40000 ALTER TABLE `user` DISABLE KEYS */;
INSERT INTO `user` VALUES ('048ee526-036f-4cc2-a95c-4ac64f5c8204','Thủ Đức',NULL,'2026-05-25 20:59:25.000000','thungan050804@gmail.com','Trần Thị Thu Ngân','https://lh3.googleusercontent.com/a/ACg8ocJxSMbpqLsjNQoheDcfKcHM8vQmO-GI904MgoRi7PN8UjVL4O6o=s96-c','READ',NULL,'SELLER','ACTIVE','2026-06-19 17:10:42.000000'),('05f9e130-8712-484c-971e-0670a837f6ca','thu duc',NULL,'2026-06-11 18:18:03.000000','ngantnt0508@gmail.com','Ngan',NULL,'READ',NULL,'USER','ACTIVE','2026-06-27 20:12:09.000000'),('20d428c7-bc91-49de-b321-17d40dae8a68','',NULL,'2026-06-04 22:54:35.000000','tien123@gmail.com','Vu Tien',NULL,'READ',NULL,'USER','ACTIVE','2026-06-24 20:42:37.000000'),('35ab910f-0158-4869-8d2d-d07a2e627991','132 Thôn 5, Xã Hương Cần, Huyện Thanh Sơn, Tỉnh Phú Thọ','2026-06-16 00:00:00.000000','2026-06-24 21:24:57.000000','pika@gmail.com','Pika','/uploads/avatars/35ab910f-0158-4869-8d2d-d07a2e627991.png','READ',NULL,'SELLER','ACTIVE','2026-06-24 21:28:32.000000'),('3c45eba9-0d3c-49bc-8509-cfe41507f406','13 Trần Phú, Phường 2, Thành phố Bảo Lộc, Tỉnh Lâm Đồng',NULL,'2026-06-18 12:22:50.000000','abcde@gmail.com','Nguyễn Văn A',NULL,'READ',NULL,'SELLER','ACTIVE','2026-06-22 16:18:21.000000'),('45841b96-6a49-4879-b4ca-13d1cb80b4a2','','2026-05-07 00:00:00.000000','2026-05-08 11:17:08.000000','22130180@st.hcmuaf.edu.vn','Ngân Trần Nguyễn Thu','https://lh3.googleusercontent.com/a/ACg8ocLB6rFKldIkzMmdYLyFdUJrB3mqEyp3vZQ2ozCE-pciWcwNUA=s96-c','READ',NULL,'USER','ACTIVE','2026-06-11 16:40:15.000000'),('6c137f53-6c8c-461d-8477-5917294a474b',NULL,NULL,'2026-06-19 16:09:52.000000','admin1@system.com','Admin Quản lý người dùng',NULL,NULL,NULL,'ADMIN','ACTIVE','2026-06-19 16:09:52.000000'),('78ba2416-158a-4001-80e2-34785504b1a5','123 LInh chiểu Thủ Đứcfg','2026-05-05 00:00:00.000000','2026-05-07 11:08:27.000000','ngantnt05@gmail.com','Nguyễn Thanh Ngân ','/uploads/avatars/78ba2416-158a-4001-80e2-34785504b1a5.JPG','READ',NULL,'SELLER','ACTIVE','2026-06-19 17:10:42.000000'),('8ec9866c-935c-495d-a30d-7f7cf4e5a1cc',NULL,NULL,'2026-06-19 16:18:40.000000','shopmanager@system.com','Quản lý shop',NULL,NULL,NULL,'ADMIN','ACTIVE','2026-06-19 16:18:40.000000'),('928942c5-2566-4ddd-9a7e-65d86c8b1647',NULL,NULL,'2026-06-19 16:18:40.000000','productmanager@system.com','Quản lý sản phẩm',NULL,NULL,NULL,'ADMIN','ACTIVE','2026-06-19 16:18:40.000000'),('9ae5e6ec-3d7b-452b-ac1a-ea01c1d05b31','Thủ Đức','2004-01-01 00:00:00.000000','2026-05-07 11:09:47.000000','annhien@gmail.com','Trần Ngọc An Nhiên','https://res.cloudinary.com/dqghfi8be/image/upload/v1778580381/ogux74s2hv5mw1nrcfjc.jpg','READ',NULL,'SELLER','ACTIVE','2026-06-19 17:10:42.000000'),('a064d764-f66a-41cc-9351-87249e97b105',NULL,NULL,'2026-05-28 22:30:38.000000','admin@system.com','System Admin',NULL,NULL,NULL,'ADMIN','ACTIVE','2026-05-29 08:53:32.000000'),('be5acd90-0505-4abd-a243-8d27a21e51c8','Thu Duc',NULL,'2026-06-11 18:50:31.000000','cashier0508@gmail.com','Ngan Tran',NULL,'READ',NULL,'SELLER','ACTIVE','2026-06-19 17:10:42.000000'),('bed931db-1d1c-40b7-b84c-c4d146de6a09','13 Phan Văn Hớn',NULL,'2026-06-04 21:43:02.000000','vanthiet@gmail.com','Văn Thị Thiệt',NULL,'READ',NULL,'USER','ACTIVE','2026-06-04 21:43:02.000000'),('c41636a7-61fe-4f6f-9456-ae1d99550945','12 Chương Dương','2026-05-22 00:00:00.000000','2026-05-07 22:59:59.000000','thungan0@gmail.com','Võ Thu',NULL,'READ',NULL,'USER','ACTIVE','2026-05-08 00:12:45.000000'),('d03dc9ef-6f39-4e3b-8794-22c2ece4406a','13 Phan Văn Hớn',NULL,'2026-06-19 17:11:45.000000','bts@gmail.com','BTS',NULL,'READ',NULL,'USER','ACTIVE','2026-06-23 17:47:23.000000'),('e5ce55f2-f8f5-4b6a-a416-ec4c6f2480b4','',NULL,'2026-06-04 23:11:43.000000','hangng@gmail.com','TRan Thi Hang',NULL,'READ',NULL,'SELLER','ACTIVE','2026-06-19 17:10:42.000000'),('e9eb5b42-14e9-47c2-854a-562fa8579bc2','133 Bà Gia',NULL,'2026-06-22 16:40:25.000000','exo@gmail.com','EXO',NULL,'READ',NULL,'SELLER','ACTIVE','2026-06-24 22:42:50.000000'),('f9efffc5-f4ac-4182-9107-926103220452',NULL,NULL,'2026-06-19 16:09:53.000000','admin2@system.com','Admin Quản lý shop',NULL,NULL,NULL,'ADMIN','ACTIVE','2026-06-19 16:09:53.000000');
/*!40000 ALTER TABLE `user` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `user_wallet`
--

DROP TABLE IF EXISTS `user_wallet`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `user_wallet` (
  `id` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `available_balance` double DEFAULT NULL,
  `created_at` datetime(6) DEFAULT NULL,
  `total_received` double DEFAULT NULL,
  `update_at` datetime(6) DEFAULT NULL,
  `user_id` varchar(50) COLLATE utf8mb4_general_ci DEFAULT NULL,
  PRIMARY KEY (`id`) USING BTREE,
  UNIQUE KEY `UKsmlynan5580w2445atlq9aaom` (`user_id`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci ROW_FORMAT=DYNAMIC;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `user_wallet`
--

LOCK TABLES `user_wallet` WRITE;
/*!40000 ALTER TABLE `user_wallet` DISABLE KEYS */;
INSERT INTO `user_wallet` VALUES ('343a8086-c350-4a30-8c07-a11d9a23cf67',0,'2026-06-22 16:17:14.000000',0,'2026-06-22 16:17:14.000000','3c45eba9-0d3c-49bc-8509-cfe41507f406'),('414108e5-6bf1-4332-8f79-a761675fcad0',0,'2026-06-24 21:25:07.000000',0,'2026-06-24 21:25:07.000000','35ab910f-0158-4869-8d2d-d07a2e627991'),('5beaf0ca-e4e5-4deb-8975-4435268d7bb0',0,'2026-07-11 21:41:40.000000',0,'2026-07-11 21:41:40.000000','048ee526-036f-4cc2-a95c-4ac64f5c8204'),('61b38a62-f69a-4ac6-9cd2-b6780c7df20c',0,'2026-06-22 16:40:34.000000',0,'2026-06-22 16:40:34.000000','e9eb5b42-14e9-47c2-854a-562fa8579bc2'),('6a6274b0-6923-4b2b-b3c5-4f74ce99a511',0,'2026-07-11 11:44:38.000000',0,'2026-07-11 11:44:38.000000','c41636a7-61fe-4f6f-9456-ae1d99550945'),('96c5698c-86f6-480b-a18e-b0b8e264a470',529000,'2026-06-19 00:18:37.000000',529000,'2026-06-19 00:18:37.000000','9ae5e6ec-3d7b-452b-ac1a-ea01c1d05b31'),('cce10e6a-9e55-44a0-ab9c-cc96db5b365f',3676190,'2026-06-18 23:17:46.000000',3676190,'2026-06-18 23:17:46.000000','20d428c7-bc91-49de-b321-17d40dae8a68'),('fd1fb65f-2198-43d1-9ac5-98ccb92fa3b4',0,'2026-06-19 17:11:55.000000',0,'2026-06-19 17:11:55.000000','d03dc9ef-6f39-4e3b-8794-22c2ece4406a');
/*!40000 ALTER TABLE `user_wallet` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping routines for database 'usersdb'
--
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-07-15  9:36:37
