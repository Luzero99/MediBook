package com.example.medibook.response;

import com.example.medibook.model.Doctor;
import com.example.medibook.model.User;
import lombok.Data;

import java.util.UUID;

@Data
public class DoctorResponse {
    private UUID id;
    private String firstName;
    private String lastName;
    private String speciality;
    private String bio;
    private String profilePicture;

    public static DoctorResponse getDoctorResponse(User user, Doctor doctor) {
        DoctorResponse response = new DoctorResponse();
        response.setId(user.getId());
        response.setFirstName(user.getFirstName());
        response.setLastName(user.getLastName());
        response.setSpeciality(doctor.getSpeciality());
        response.setBio(doctor.getBio());
        response.setProfilePicture(doctor.getProfilePicture());
        return response;
    }
}