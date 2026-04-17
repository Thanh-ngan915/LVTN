-- Migration script to convert anvi_db from UUID to BIGINT user IDs
-- Run this script to update the existing database

-- Step 1: Add new bigint columns
ALTER TABLE `user` ADD COLUMN `id_new` BIGINT AUTO_INCREMENT UNIQUE AFTER `id`;
ALTER TABLE `account` ADD COLUMN `user_id_new` BIGINT AFTER `user_id`;
ALTER TABLE `permission` ADD COLUMN `user_id_new` BIGINT AFTER `user_id`;

-- Step 2: Create mapping table for UUID to BIGINT conversion
CREATE TABLE IF NOT EXISTS `user_id_mapping` (
  `old_uuid` VARCHAR(50) PRIMARY KEY,
  `new_id` BIGINT NOT NULL,
  `username` VARCHAR(100)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Step 3: Populate new IDs (assign sequential IDs to existing users)
SET @counter = 0;
UPDATE `user` SET `id_new` = (@counter := @counter + 1) ORDER BY `created_at`;

-- Step 4: Populate mapping table
INSERT INTO `user_id_mapping` (`old_uuid`, `new_id`, `username`)
SELECT u.id, u.id_new, a.username 
FROM `user` u 
LEFT JOIN `account` a ON a.user_id = u.id;

-- Step 5: Update foreign keys in account table
UPDATE `account` a
INNER JOIN `user_id_mapping` m ON a.user_id = m.old_uuid
SET a.user_id_new = m.new_id;

-- Step 6: Update foreign keys in permission table
UPDATE `permission` p
INNER JOIN `user_id_mapping` m ON p.user_id = m.old_uuid
SET p.user_id_new = m.new_id;

-- Step 7: Drop old columns and rename new ones
ALTER TABLE `user` DROP PRIMARY KEY;
ALTER TABLE `user` DROP COLUMN `id`;
ALTER TABLE `user` CHANGE COLUMN `id_new` `id` BIGINT NOT NULL AUTO_INCREMENT PRIMARY KEY;

ALTER TABLE `account` DROP COLUMN `user_id`;
ALTER TABLE `account` CHANGE COLUMN `user_id_new` `user_id` BIGINT;

ALTER TABLE `permission` DROP COLUMN `user_id`;
ALTER TABLE `permission` CHANGE COLUMN `user_id_new` `user_id` BIGINT;

-- Step 8: Update store_role_id to BIGINT (if needed for consistency)
-- Note: Keeping store_role_id as VARCHAR for now as it's a separate entity

-- Step 9: Add indexes
ALTER TABLE `account` ADD INDEX `idx_user_id` (`user_id`);
ALTER TABLE `permission` ADD INDEX `idx_user_id` (`user_id`);

-- Step 10: Keep mapping table for reference (optional - can drop later)
-- DROP TABLE `user_id_mapping`;

COMMIT;
