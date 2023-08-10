package com.example.medibook.controller;

import com.example.medibook.response.ErrorResponse;
import com.example.medibook.service.DoctorService;
import lombok.AllArgsConstructor;
import org.springframework.beans.propertyeditors.StringTrimmerEditor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.WebDataBinder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
@AllArgsConstructor
@RequestMapping("/doctor")
public class DoctorController {
    private final DoctorService doctorService;

    @InitBinder
    public void initBinder(WebDataBinder webDataBinder) {
        StringTrimmerEditor stringTrimmerEditor = new StringTrimmerEditor(true);
        webDataBinder.registerCustomEditor(String.class, stringTrimmerEditor);
    }

    @PreAuthorize("hasRole('DOCTOR')")
    @PatchMapping
    public ResponseEntity<?> updateDoctor(@RequestParam("id") String id, @RequestParam("firstName") String firstName, @RequestParam("lastName") String lastName, @RequestParam("speciality") String speciality, @RequestParam("bio") String bio, @RequestParam("profilePicture") MultipartFile profilePicture) {
        try {
            return doctorService.update(id, firstName, lastName, speciality, bio, profilePicture);
        } catch (Exception e) {
            System.out.println(e);
            return new ResponseEntity<>(ErrorResponse.builder().error("Internal server error").build(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @PreAuthorize("hasRole('DOCTOR')")
    @GetMapping("/{id}")
    public ResponseEntity<?> getImage(@PathVariable String id) {
        try {
            return doctorService.getImage(id);
        } catch (Exception e) {
            System.out.println(e);
            return new ResponseEntity<>(ErrorResponse.builder().error("Internal server error").build(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @GetMapping("/all")
    public ResponseEntity<?> findAll() {
        try {
            return doctorService.findAll();
        } catch (Exception e) {
            System.out.println(e);
            return new ResponseEntity<>(ErrorResponse.builder().error("Internal server error").build(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}
