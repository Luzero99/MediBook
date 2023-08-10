package com.example.medibook.response;

import com.example.medibook.model.Patient;
import com.example.medibook.model.User;
import lombok.Data;

import java.util.Date;
import java.util.UUID;

@Data
public class PatientResponse {
    private UUID id;
    private String firstName;
    private String lastName;
    private String contactNumber;
    private String address;
    private Date dateOfBirth;

    public static PatientResponse getPatientResponse(User user, Patient patient) {
        PatientResponse patientResponse = new PatientResponse();
        patientResponse.setId(user.getId());
        patientResponse.setFirstName(user.getFirstName());
        patientResponse.setLastName(user.getLastName());
        patientResponse.setContactNumber(patient.getContactNumber());
        patientResponse.setAddress(patient.getAddress());
        patientResponse.setDateOfBirth(patient.getDateOfBirth());
        return patientResponse;
    }
}
