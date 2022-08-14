
USE files

CREATE TABLE files.users (
    id varchar(255) PRIMARY KEY,
    name varchar(255) NOT NULL,
    password_hash varchar(255) NOT NULL,
    created_at timestamp,
    updated_at timestamp
);

CREATE TRIGGER files.users_update_timestamp_trg
    BEFORE UPDATE
    ON files.users
    FOR EACH ROW SET NEW.updated_at = CURRENT_TIMESTAMP;
    

CREATE TRIGGER files.users_insert_timestamp_trg
    BEFORE INSERT
    ON files.users
    FOR EACH ROW SET NEW.created_at = CURRENT_TIMESTAMP;
 

CREATE TABLE files.refresh_token(
    refresh_token varchar(255) PRIMARY KEY,
    user_id varchar(255) NOT NULL,
    expires_at timestamp,
    created_at timestamp,
    updated_at timestamp,
    FOREIGN KEY (user_id) REFERENCES files.users(id) ON DELETE CASCADE
);

CREATE TRIGGER files.refresh_token_update_timestamp_trg
    BEFORE UPDATE
    ON files.refresh_token
    FOR EACH ROW SET NEW.updated_at = CURRENT_TIMESTAMP;
 

CREATE TRIGGER files.refresh_token_insert_timestamp_trg 
    BEFORE INSERT
    ON files.refresh_token
    FOR EACH ROW SET NEW.created_at = CURRENT_TIMESTAMP;
   

CREATE TABLE files.files_data(
    id varchar(255) PRIMARY KEY,
    name varchar(255) NOT NULL,
    mimetype varchar(255) NOT NULL,
    extension varchar(255) NOT NULL,
    size int NOT NULL,
    created_at timestamp,
    updated_at timestamp
);


CREATE TRIGGER files.files_data_update_timestamp_trg 
    BEFORE UPDATE
    ON files.files_data
    FOR EACH ROW SET NEW.updated_at = CURRENT_TIMESTAMP;
    

CREATE TRIGGER files.files_data_insert_timestamp_trg 
    BEFORE INSERT
    ON files.files_data
    FOR EACH ROW SET NEW.created_at = CURRENT_TIMESTAMP;
   
