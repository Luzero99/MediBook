package com.example.medibook.service;

import com.example.medibook.model.Appointment;
import com.example.medibook.model.Doctor;
import com.example.medibook.model.Patient;
import com.example.medibook.model.User;
import com.example.medibook.repository.AppointmentRepository;
import com.example.medibook.repository.DoctorRepository;
import com.example.medibook.repository.PatientRepository;
import com.example.medibook.repository.UserRepository;
import com.example.medibook.response.AppointmentResponse;
import com.example.medibook.response.SuccessResponse;
import lombok.AllArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.util.*;

@Service
@AllArgsConstructor
public class AppointmentService {
    private final AppointmentRepository appointmentRepository;
    private final DoctorRepository doctorRepository;
    private final UserRepository userRepository;
    private final PatientRepository patientRepository;

    private static List<AppointmentResponse> getAppointmentResponses(List<Appointment> appointments) {
        List<AppointmentResponse> response = new ArrayList<>();

        for (Appointment appointment : appointments) {
            Doctor doctor = appointment.getDoctor();
            User doctorUser = doctor.getUser();

            String doctorFirstName = doctorUser.getFirstName();
            String doctorLastName = doctorUser.getLastName();
            String doctorSpeciality = doctor.getSpeciality();
            Date date = appointment.getDate();

            AppointmentResponse appointmentResponse = new AppointmentResponse(appointment.getId().toString(), doctorFirstName, doctorLastName, doctorSpeciality, date);
            response.add(appointmentResponse);
        }
        return response;
    }

    public ResponseEntity<?> findByUserId(String userId) {
        Optional<User> user = userRepository.findById(UUID.fromString(userId));

        if (user.isEmpty()) {
            return ResponseEntity.badRequest().body("User not found!");
        }

        List<Appointment> appointments;

        switch (user.get().getRole()) {
            case ROLE_PATIENT -> {
                Patient patient = patientRepository.findByUser(user.get());
                appointments = appointmentRepository.findByPatientId(patient.getId());
            }
            case ROLE_DOCTOR -> {
                Doctor doctor = doctorRepository.findByUser(user.get());
                appointments = appointmentRepository.findByDoctorId(doctor.getId());
            }
            default -> {
                return ResponseEntity.badRequest().body("You must take role!");
            }
        }

        List<AppointmentResponse> response = getAppointmentResponses(appointments);

        return ResponseEntity.ok().body(response);
    }

    public ResponseEntity<?> deleteById(String id) {
        appointmentRepository.deleteById(UUID.fromString(id));
        return ResponseEntity.ok().body(SuccessResponse.builder().message("Deleted appointment").build());
    }

    public ResponseEntity<?> create(String userId, String doctorId, Date date) {
        Optional<Doctor> doctor = doctorRepository.findById(UUID.fromString(doctorId));
        Optional<User> user = userRepository.findById(UUID.fromString(userId));

        if (doctor.isEmpty() || user.isEmpty()) {
            return ResponseEntity.badRequest().body("Patient or doctor not found!");
        }

        Patient patient = patientRepository.findByUser(user.get());


        Appointment appointment = new Appointment();
        appointment.setPatient(patient);
        appointment.setDoctor(doctor.get());
        appointment.setDate(date);

        appointmentRepository.save(appointment);

        return ResponseEntity.ok().body("Created appointment");
    }
}
