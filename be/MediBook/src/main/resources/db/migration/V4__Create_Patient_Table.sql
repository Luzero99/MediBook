CREATE TABLE patient (
                         id              BINARY(16) NOT NULL,
                         contact_number  VARCHAR(255),
                         address         VARCHAR(255),
                         date_of_birth   DATE,
                         user_id         BINARY(16),
                         PRIMARY KEY (id),
                         FOREIGN KEY (user_id) REFERENCES user (id)
);
