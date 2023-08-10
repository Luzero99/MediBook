CREATE TABLE doctor (
                        id              BINARY(16) NOT NULL,
                        speciality      VARCHAR(255),
                        bio             VARCHAR(1000),
                        profile_picture VARCHAR(255),
                        user_id         BINARY(16),
                        PRIMARY KEY (id),
                        FOREIGN KEY (user_id) REFERENCES user (id)
);
