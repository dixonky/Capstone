DROP TABLE IF EXISTS `records`;
DROP TABLE IF EXISTS `user`;
DROP TABLE IF EXISTS `questions`;

CREATE TABLE `user`(
	`id` int NOT NULL AUTO_INCREMENT,
    `user_name` varchar(50) NOT NULL unique,
    `user_password` varchar(50) NOT NULL,
    `user_email` varchar(50) NOT NULL,
    `user_super` int,
    PRIMARY KEY (`id`)
);

CREATE TABLE `records`(
	`record_id` int NOT NULL AUTO_INCREMENT,
    `record_name` varchar(100) NOT NULL,
    `record_data` varchar(100) NOT NULL,
    `record_URL` varchar(100),
    `user` int,
    PRIMARY KEY (`record_id`),
    FOREIGN KEY (`user`) REFERENCES `user`(`id`) ON DELETE SET NULL
);

CREATE TABLE `questions`(
	`record_id` int NOT NULL AUTO_INCREMENT,
    `record_data` varchar(401) NOT NULL,
    `record_response` varchar(401) NOT NULL,
    PRIMARY KEY (`record_id`),
);

INSERT INTO `user`(`user_name`,`user_password`,`user_email`,`user_super`)
VALUES
('Admin', 'password', 'admin@fake.com', 1),
('Kyle', '12345', 'kdixon@fake.com' , 0),
('Katie', 'secret', 'kyoung@fake.com', 0),
('John', '1q2w3e', 'jdoe@fake.com', 0),
('Jane', 'password1', 'jdoe@fake.com', 0);

INSERT INTO `records`(`record_name`, `record_data`, `record_URL`,`user`)
VALUES
('USBank', '123456789', 'USBank.com',(SELECT id FROM user WHERE user_name='Kyle')),
('Twitter', 'montana', 'Twitter.com',(SELECT id FROM user WHERE user_name='Kyle')),
('IRS', 'supersecret', 'USA.gov',(SELECT id FROM user WHERE user_name='Kyle')),
('OffShoreBank', '987654321', 'OffShoreBank.com',(SELECT id FROM user WHERE user_name='Katie')),
('OSU', 'banana', 'oregonstate.edu',(SELECT id FROM user WHERE user_name='Katie')),
('Xfinity', 'secrets', 'xfinity.com',(SELECT id FROM user WHERE user_name='Katie'));

INSERT INTO `questions`(`record_data`, `record_response`)
VALUES
('How do I know that my information is secure?', 'We have taken measures to ensure data security. Please review our README for more information.'),
('Why did you choose the name Secret Keeper?', 'Our site is indended as a safe space for users to store data (i.e., secrets)!');