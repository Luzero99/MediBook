package com.example.medibook.service;

import com.example.medibook.dto.DoctorWithUser;
import com.example.medibook.model.Doctor;
import com.example.medibook.model.User;
import com.example.medibook.repository.DoctorRepository;
import com.example.medibook.repository.UserRepository;
import com.example.medibook.response.ErrorResponse;
import com.example.medibook.response.SuccessResponse;
import lombok.AllArgsConstructor;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.FileNotFoundException;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
@AllArgsConstructor
public class DoctorService {
    private final DoctorRepository doctorRepository;
    private final UserRepository userRepository;
    private final String uploadDir = "./src/main/profile_images";

    public ResponseEntity<?> update(String id, String firstName, String lastName, String speciality, String bio, MultipartFile profilePicture) throws Exception {
        try {
            if (!profilePicture.getContentType().startsWith("image/")) {
                return ResponseEntity.badRequest().body(ErrorResponse.builder().error("Type of file is not a image!").build());
            }

            String fileName = saveProfilePicture(profilePicture);

            if (fileName == null) {
                return ResponseEntity.badRequest().body(ErrorResponse.builder().error("Error saving profile picture").build());
            }

            Optional<User> userOptional = userRepository.findById(UUID.fromString(id));

            if (userOptional.isEmpty()) {
                return ResponseEntity.badRequest().body(ErrorResponse.builder().error("User not found").build());
            }

            User user = userOptional.get();

            Optional<Doctor> doctorOptional = Optional.ofNullable(doctorRepository.findByUser(user));

            if (doctorOptional.isEmpty()) {
                return ResponseEntity.badRequest().body(ErrorResponse.builder().error("Doctor not found").build());
            }

            Doctor doctor = doctorOptional.get();

            updateDoctorAndUser(user, doctor, firstName, lastName, speciality, bio, fileName);

            return ResponseEntity.ok().body(SuccessResponse.builder().message("Doctor profile was successfully saved").build());
        } catch (Exception e) {
            System.out.println("Error:" + e);
            throw new Exception(e);
        }
    }

    public ResponseEntity<?> getImage(String userId) throws Exception {
        try {
            Optional<User> userOptional = userRepository.findById(UUID.fromString(userId));

            if (userOptional.isEmpty()) {
                return ResponseEntity.badRequest().body(ErrorResponse.builder().error("User not found").build());
            }

            User user = userOptional.get();

            Optional<Doctor> doctorOptional = Optional.ofNullable(doctorRepository.findByUser(user));

            if (doctorOptional.isEmpty()) {
                return ResponseEntity.badRequest().body(ErrorResponse.builder().error("Doctor not found").build());
            }

            Doctor doctor = doctorOptional.get();

            Path filePath = Paths.get(uploadDir, doctor.getProfilePicture());
            byte[] imageBytes = Files.readAllBytes(filePath);
            MediaType mediaType = MediaType.IMAGE_JPEG;
            return ResponseEntity.ok().contentType(mediaType).contentLength(imageBytes.length).body(imageBytes);
        } catch (FileNotFoundException e) {
            throw new Exception(e);
        } catch (Exception e) {
            System.out.println("Error:" + e);
            throw new Exception(e);
        }
    }

    public ResponseEntity<List<DoctorWithUser>> findAll() {
        List<DoctorWithUser> doctors = doctorRepository.findAllDoctorsWithUser();
        return ResponseEntity.ok(doctors);
    }

    private String saveProfilePicture(MultipartFile profilePicture) throws IOException {
        if (profilePicture.isEmpty()) {
            return null;
        }

        String fileName = UUID.randomUUID() + "_" + profilePicture.getOriginalFilename();
        Path filePath = Paths.get(uploadDir, fileName);
        profilePicture.transferTo(filePath);
        return fileName;
    }

    private void updateDoctorAndUser(User user, Doctor doctor, String firstName, String lastName, String speciality, String bio, String fileName) {
        if (doctor.getProfilePicture() != null) {
            Path oldFilePath = Path.of(uploadDir, doctor.getProfilePicture());
            try {
                Files.deleteIfExists(oldFilePath);
            } catch (IOException e) {
                System.out.println("Error deleting old profile picture: " + e);
            }
        }

        user.setFirstName(firstName);
        user.setLastName(lastName);
        userRepository.save(user);

        doctor.setBio(bio);
        doctor.setSpeciality(speciality);
        doctor.setProfilePicture(fileName);
        doctorRepository.save(doctor);
    }
}
