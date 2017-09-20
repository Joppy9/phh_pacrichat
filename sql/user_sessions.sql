DROP TABLE IF EXISTS `user_sessions`;
CREATE TABLE `user_sessions`(
  `id` VARCHAR(36) NOT NULL PRIMARY KEY,
  `user_id` INT(11) NOT NULL
);