package com.example.medibook.dto;

import java.util.UUID;

public interface DoctorWithUser {
    UUID getId();

    String getSpeciality();

    String getBio();

    String getProfilePicture();

    String getUserFirstName();

    String getUserLastName();
}
