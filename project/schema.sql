CREATE TABLE `users` (
	`id` INT NOT NULL AUTO_INCREMENT,
	`login` varchar(64) NOT NULL UNIQUE,
	`email` varchar(256) NOT NULL UNIQUE,
	`password` varchar(512) NOT NULL,
	`roleId` INT NOT NULL,
	PRIMARY KEY (`id`)
);

CREATE TABLE `roles` (
	`id` INT NOT NULL AUTO_INCREMENT,
	`role` varchar(32) NOT NULL UNIQUE,
	`privileges` TEXT,
	PRIMARY KEY (`id`)
);

CREATE TABLE `pages` (
	`id` INT NOT NULL AUTO_INCREMENT,
	`creator` INT NOT NULL,
	`date` DATETIME NOT NULL,
	`url` varchar(255) NOT NULL UNIQUE,
	`title` varchar(512) NOT NULL,
	`lead` varchar(1024),
	`content` TEXT NOT NULL,
	`modified` TIMESTAMP NOT NULL,
	`blog` varchar(1) NOT NULL DEFAULT 'N',
	PRIMARY KEY (`id`)
);

CREATE TABLE `posts` (
	`id` INT NOT NULL AUTO_INCREMENT,
	`pageId` INT NOT NULL,
	`creator` INT NOT NULL,
	`date` DATETIME NOT NULL,
	`title` varchar(512) NOT NULL,
	`content` TEXT NOT NULL,
	`modified` TIMESTAMP NOT NULL,
	PRIMARY KEY (`id`)
);

CREATE TABLE `media` (
	`id` INT NOT NULL AUTO_INCREMENT,
	`addedBy` INT NOT NULL,
	`path` varchar(512) NOT NULL UNIQUE,
	`filename` varchar(512) NOT NULL UNIQUE,
	PRIMARY KEY (`id`)
);

CREATE TABLE `settings` (
	`name` varchar(255) NOT NULL,
	`value` TEXT NOT NULL,
	PRIMARY KEY (`name`)
);

ALTER TABLE `users` ADD CONSTRAINT `users_fk0` FOREIGN KEY (`roleId`) REFERENCES `roles`(`id`);

ALTER TABLE `pages` ADD CONSTRAINT `pages_fk0` FOREIGN KEY (`creator`) REFERENCES `users`(`id`);

ALTER TABLE `posts` ADD CONSTRAINT `posts_fk0` FOREIGN KEY (`pageId`) REFERENCES `pages`(`id`);

ALTER TABLE `posts` ADD CONSTRAINT `posts_fk1` FOREIGN KEY (`creator`) REFERENCES `users`(`id`);

ALTER TABLE `media` ADD CONSTRAINT `media_fk0` FOREIGN KEY (`addedBy`) REFERENCES `users`(`id`);

