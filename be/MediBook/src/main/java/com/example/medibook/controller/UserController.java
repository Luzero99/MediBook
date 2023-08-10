package com.example.medibook.controller;

import com.example.medibook.model.User;
import com.example.medibook.request.LoginRequest;
import com.example.medibook.request.UpdateRoleRequest;
import com.example.medibook.response.AuthResponse;
import com.example.medibook.response.ErrorResponse;
import com.example.medibook.service.UserService;
import com.example.medibook.utils.Validation;
import jakarta.validation.Valid;
import lombok.AllArgsConstructor;
import org.springframework.beans.propertyeditors.StringTrimmerEditor;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.WebDataBinder;
import org.springframework.web.bind.annotation.*;

import javax.naming.AuthenticationException;
import java.util.IllegalFormatException;
import java.util.UUID;

@RestController
@AllArgsConstructor
@RequestMapping("/user")
public class UserController {
    private final UserService userService;

    @InitBinder
    public void initBinder(WebDataBinder webDataBinder) {
        StringTrimmerEditor stringTrimmerEditor = new StringTrimmerEditor(true);
        webDataBinder.registerCustomEditor(String.class, stringTrimmerEditor);
    }

    @PostMapping("/register")
    public ResponseEntity<?> register(@Valid @RequestBody User user, BindingResult bindingResult) {
        ResponseEntity<?> validationResponse = Validation.handleValidationErrors(bindingResult);

        if (validationResponse != null) {
            return validationResponse;
        }

        try {
            AuthResponse response = userService.createUser(user.getEmail(), user.getPassword(), user.getFirstName(), user.getLastName());
            return ResponseEntity.ok(response);
        } catch (DataIntegrityViolationException e) {
            return new ResponseEntity<>(ErrorResponse.builder().error("The email address is already taken!").build(), HttpStatus.CONFLICT);
        } catch (Exception e) {
            System.out.println(e);
            return new ResponseEntity<>(ErrorResponse.builder().error("Internal server error").build(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@Valid @RequestBody LoginRequest body, BindingResult bindingResult) {
        ResponseEntity<?> validationResponse = Validation.handleValidationErrors(bindingResult);

        if (validationResponse != null) {
            return validationResponse;
        }

        try {
            AuthResponse response = userService.login(body.getEmail(), body.getPassword());
            return ResponseEntity.ok(response);
        } catch (AuthenticationException e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(ErrorResponse.builder().error("Invalid username or password").build());
        } catch (Exception e) {
            System.out.println(e);
            return new ResponseEntity<>(ErrorResponse.builder().error("Internal server error").build(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @PostMapping("/role")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<?> updateRole(@RequestBody UpdateRoleRequest updateRoleRequest, BindingResult bindingResult) {
        ResponseEntity<?> validationResponse = Validation.handleValidationErrors(bindingResult);

        if (validationResponse != null) {
            return validationResponse;
        }


        if (!updateRoleRequest.getRole().equals("ROLE_PATIENT") && !updateRoleRequest.getRole().equals("ROLE_DOCTOR")) {
            return new ResponseEntity<>(ErrorResponse.builder().error("Invalid role!").build(), HttpStatus.BAD_REQUEST);
        }

        try {
            AuthResponse response = userService.updateRole(updateRoleRequest.getId(), updateRoleRequest.getRole());
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            System.out.println(e);
            return new ResponseEntity<>(ErrorResponse.builder().error("Internal server error").build(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }


    @GetMapping("/profile/{id}")
    public ResponseEntity<?> getProfile(@PathVariable String id) {
        try {
            UUID uuid = UUID.fromString(id);
            return userService.getProfile(uuid);
        } catch (IllegalFormatException e) {
            return new ResponseEntity<>(ErrorResponse.builder().error("User not found").build(), HttpStatus.NOT_FOUND);
        }
    }
}
