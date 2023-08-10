CREATE TABLE appointment (
                             id                BINARY(16) NOT NULL,
                             doctor_id         BINARY(16),
                             patient_id        BINARY(16),
                             appointment_date  DATETIME,
                             notes             VARCHAR(1000),
                             PRIMARY KEY (id),
                             FOREIGN KEY (doctor_id) REFERENCES doctor (id),
                             FOREIGN KEY (patient_id) REFERENCES patient (id)
);
