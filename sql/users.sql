DROP TABLE IF EXISTS `users`;
CREATE TABLE `users`(
  `id` INT (11) NOT NULL PRIMARY KEY AUTO_INCREMENT,
  `email` VARCHAR(255) NOT NULL,
  `nickname` VARCHAR(120) NOT NULL,
  `password` VARCHAR(255) NOT NULL,
  `salt` VARCHAR(255) NOT NULL,
  UNIQUE KEY `idx_nickname`(`nickname`),
  UNIQUE KEY `uk_email`(`email`)
);