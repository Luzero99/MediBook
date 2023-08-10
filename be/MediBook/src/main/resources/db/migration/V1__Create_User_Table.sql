CREATE TABLE user
(
    id         BINARY(16) PRIMARY KEY,
    email      VARCHAR(255) UNIQUE,
    password   VARCHAR(255) NOT NULL,
    role       VARCHAR(50),
    first_name VARCHAR(50)  NOT NULL,
    last_name  VARCHAR(50)  NOT NULL
);