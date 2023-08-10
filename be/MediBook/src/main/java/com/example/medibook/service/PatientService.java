package com.example.medibook.service;

import com.example.medibook.model.Patient;
import com.example.medibook.model.User;
import com.example.medibook.repository.PatientRepository;
import com.example.medibook.repository.UserRepository;
import com.example.medibook.request.PatientUpdateRequest;
import com.example.medibook.response.SuccessResponse;
import jakarta.transaction.Transactional;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.Optional;
import java.util.UUID;

@Service
@AllArgsConstructor
public class PatientService {
    private final PatientRepository patientRepository;
    private final UserRepository userRepository;

    @Transactional
    public SuccessResponse update(PatientUpdateRequest patientBody) throws Exception {
        Optional<User> userOptional = userRepository.findById(UUID.fromString(patientBody.getId()));

        if (userOptional.isEmpty()) {
            throw new Exception("User not found");
        }

        User user = userOptional.get();


        Optional<Patient> patientOptional = Optional.ofNullable(patientRepository.findByUser(user));

        if (patientOptional.isEmpty()) {
            throw new Exception("Patient not found");
        }

        Patient patient = patientOptional.get();
        patient.setAddress(patientBody.getAddress());
        patient.setContactNumber(patientBody.getContactNumber());
        patient.setDateOfBirth(patientBody.getDateOfBirth());
        patientRepository.save(patient);
        
        user.setFirstName(patientBody.getFirstName());
        user.setLastName(patientBody.getLastName());
        userRepository.save(user);

        return SuccessResponse.builder().message("Patient updated successfully").build();
    }
}
