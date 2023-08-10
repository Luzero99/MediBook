package com.example.medibook.service;

import com.example.medibook.config.JwtService;
import com.example.medibook.model.*;
import com.example.medibook.repository.DoctorRepository;
import com.example.medibook.repository.PatientRepository;
import com.example.medibook.repository.TokenRepository;
import com.example.medibook.repository.UserRepository;
import com.example.medibook.response.AuthResponse;
import com.example.medibook.response.DoctorResponse;
import com.example.medibook.response.ErrorResponse;
import com.example.medibook.response.PatientResponse;
import jakarta.transaction.Transactional;
import lombok.AllArgsConstructor;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import javax.naming.AuthenticationException;
import java.util.HashMap;
import java.util.Map;
import java.util.Optional;
import java.util.UUID;

@Service
@AllArgsConstructor
public class UserService {
    private final UserRepository userRepository;
    private final TokenRepository tokenRepository;
    private final PatientRepository patientRepository;
    private final DoctorRepository doctorRepository;
    private final BCryptPasswordEncoder bcryptPasswordEncoder;
    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;

    @Transactional
    public AuthResponse createUser(String email, String password, String firstName, String lastName) throws DataIntegrityViolationException {
        if (userRepository.existsByEmail(email)) {
            throw new DataIntegrityViolationException("User already exists");
        }

        User user = new User();
        user.setEmail(email);
        user.setLastName(lastName);
        user.setFirstName(firstName);
        user.setRole(Role.ROLE_USER);
        user.setPassword(bcryptPasswordEncoder.encode(password));

        var savedUser = userRepository.save(user);

        return getAuthResponse(savedUser);
    }

    @Transactional
    public AuthResponse login(String email, String password) throws AuthenticationException {
        try {
            Authentication authentication = authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(email, password));
            User user = (User) authentication.getPrincipal();

            return getAuthResponse(user);
        } catch (UsernameNotFoundException e) {
            throw new AuthenticationException("User not found");
        } catch (BadCredentialsException e) {
            throw new AuthenticationException("Invalid username or password");
        }
    }

    public ResponseEntity<?> getProfile(UUID id) {
        Optional<User> user = userRepository.findById(id);

        if (user.isEmpty()) {
            return new ResponseEntity<>(ErrorResponse.builder().error("User not found").build(), HttpStatus.NOT_FOUND);
        }

        switch (user.get().getRole()) {
            case ROLE_USER -> {
                return ResponseEntity.badRequest().body(ErrorResponse.builder().error("Account type not selected").build());
            }

            case ROLE_PATIENT -> {
                Patient patient = patientRepository.findByUser(user.get());

                if (patient != null) {
                    PatientResponse patientResponse = PatientResponse.getPatientResponse(user.get(), patient);
                    return new ResponseEntity<>(patientResponse, HttpStatus.OK);
                }

                return new ResponseEntity<>(ErrorResponse.builder().error("Patient not found"), HttpStatus.NOT_FOUND);
            }

            case ROLE_DOCTOR -> {
                Doctor doctor = doctorRepository.findByUser(user.get());

                if (doctor != null) {
                    DoctorResponse doctorResponse = DoctorResponse.getDoctorResponse(user.get(), doctor);
                    return new ResponseEntity<>(doctorResponse, HttpStatus.OK);
                }

                return new ResponseEntity<>(ErrorResponse.builder().error("Doctor not found"), HttpStatus.NOT_FOUND);
            }

            default -> {
                return ResponseEntity.internalServerError().build();
            }
        }
    }
    
    public AuthResponse updateRole(String id, String role) throws Exception {
        Optional<User> userOptional = userRepository.findById(UUID.fromString(id));

        if (userOptional.isEmpty()) {
            throw new Exception("User not found");
        }

        User user = userOptional.get();
        user.setRole(Role.valueOf(role));
        userRepository.save(user);

        switch (role) {
            case "ROLE_DOCTOR" -> {
                Doctor doctor = new Doctor();
                doctor.setUser(user);
                doctorRepository.save(doctor);
            }
            case "ROLE_PATIENT" -> {
                Patient patient = new Patient();
                patient.setUser(user);
                patientRepository.save(patient);
            }
            default -> {
                break;
            }
        }


        return getAuthResponse(user);
    }

    private AuthResponse getAuthResponse(User user) {
        Map<String, Object> extraClaims = new HashMap<>();
        extraClaims.put("role", user.getRole());
        extraClaims.put("id", user.getId());

        String jwtToken = jwtService.generateToken(extraClaims, user);
        String refreshToken = jwtService.generateRefreshToken(extraClaims, user);

        saveUserToken(user, jwtToken);

        return AuthResponse.builder().accessToken(jwtToken).refreshToken(refreshToken).build();
    }

    private void saveUserToken(User user, String jwtToken) {
        Token token = Token.builder().user(user).token(jwtToken).tokenType(TokenType.BEARER).expired(false).revoked(false).build();
        tokenRepository.save(token);
    }
}
