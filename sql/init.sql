-- DROP DATABASE IF EXISTS files;
-- CREATE DATABASE files;

use files

CREATE TABLE files.users (
    id varchar(255) PRIMARY KEY,
    name varchar(255) NOT NULL,
    password_hash varchar(255) NOT NULL,
    created_at timestamp DEFAULT NOW(),
    updated_at timestamp
);

DELIMITER $$
CREATE
    TRIGGER files.update_timestamp_trg BEFORE UPDATE
    ON files.users
    FOR EACH ROW BEGIN
        UPDATE users SET updated_at = CURRENT_TIMESTAMP WHERE id = OLD.id;
    END$$
DELIMITER ;

DELIMITER $$
CREATE
    TRIGGER files.insert_timestamp_trg BEFORE UPDATE
    ON files.users
    FOR EACH ROW BEGIN
        UPDATE users SET updated_at = CURRENT_TIMESTAMP WHERE id = OLD.id;
    END$$
DELIMITER ;

CREATE TABLE files.refresh_token(
    refresh_token varchar(255) PRIMARY KEY,
    user_id varchar(255) NOT NULL,
    expires_at timestamp,
    created_at timestamp DEFAULT NOW(),
    updated_at timestamp,
    FOREIGN KEY (user_id) REFERENCES files.users(id) ON DELETE CASCADE
);
