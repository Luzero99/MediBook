package com.example.medibook.repository;

import com.example.medibook.dto.DoctorWithUser;
import com.example.medibook.model.Doctor;
import com.example.medibook.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.UUID;

public interface DoctorRepository extends JpaRepository<Doctor, UUID> {
    Doctor findByUser(User user);

    @Query("SELECT d.id AS id, d.speciality AS speciality, d.bio AS bio, d.profilePicture AS profilePicture, d.user.firstName AS userFirstName, d.user.lastName AS userLastName FROM Doctor d")
    List<DoctorWithUser> findAllDoctorsWithUser();
}
