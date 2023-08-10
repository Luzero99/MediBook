package com.example.medibook.controller;

import com.example.medibook.request.PatientUpdateRequest;
import com.example.medibook.response.ErrorResponse;
import com.example.medibook.response.SuccessResponse;
import com.example.medibook.service.PatientService;
import com.example.medibook.utils.Validation;
import jakarta.validation.Valid;
import lombok.AllArgsConstructor;
import org.springframework.beans.propertyeditors.StringTrimmerEditor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.WebDataBinder;
import org.springframework.web.bind.annotation.*;


@RestController
@AllArgsConstructor
@PreAuthorize("hasRole('PATIENT')")
@RequestMapping("/patient")
public class PatientController {
    private final PatientService patientService;

    @InitBinder
    public void initBinder(WebDataBinder webDataBinder) {
        StringTrimmerEditor stringTrimmerEditor = new StringTrimmerEditor(true);
        webDataBinder.registerCustomEditor(String.class, stringTrimmerEditor);
    }

    @PatchMapping
    public ResponseEntity<?> updatePatient(@RequestBody @Valid PatientUpdateRequest patient, BindingResult bindingResult) {
        ResponseEntity<?> validationResponse = Validation.handleValidationErrors(bindingResult);

        if (validationResponse != null) {
            return validationResponse;
        }

        try {
            SuccessResponse response = patientService.update(patient);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            System.out.println(e);
            return new ResponseEntity<>(ErrorResponse.builder().error("Internal server error").build(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}
