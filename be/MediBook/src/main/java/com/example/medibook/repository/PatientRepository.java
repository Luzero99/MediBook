package com.example.medibook.repository;

import com.example.medibook.model.Patient;
import com.example.medibook.model.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.UUID;

public interface PatientRepository extends JpaRepository<Patient, UUID> {
    Patient findByUser(User user);
}
