package com.example.medibook.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;

import java.util.Date;

@Data
public class PatientUpdateRequest {
    @NotBlank(message = "The id of the patient is empty!")
    private String id;

    @NotBlank(message = "The firstName of the patient is empty!")
    private String firstName;

    @NotBlank(message = "The lastName of the patient is empty!")
    private String lastName;

    @NotBlank(message = "The contact number is empty!")
    @Size(min = 9, max = 9, message = "The contact number must be 9 characters.")
    private String contactNumber;

    @NotBlank(message = "The address is empty!")
    private String address;

    private Date dateOfBirth;
}
