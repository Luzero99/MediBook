package com.example.medibook.controller;

import com.example.medibook.request.AppointmentCreateRequest;
import com.example.medibook.service.AppointmentService;
import com.example.medibook.utils.Validation;
import jakarta.validation.Valid;
import lombok.AllArgsConstructor;
import org.springframework.beans.propertyeditors.StringTrimmerEditor;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.WebDataBinder;
import org.springframework.web.bind.annotation.*;

@RestController
@AllArgsConstructor
@RequestMapping("/appointment")
public class AppointmentController {
    private final AppointmentService appointmentService;

    @InitBinder
    public void initBinder(WebDataBinder webDataBinder) {
        StringTrimmerEditor stringTrimmerEditor = new StringTrimmerEditor(true);
        webDataBinder.registerCustomEditor(String.class, stringTrimmerEditor);
    }


    @GetMapping("/{id}")
    public ResponseEntity<?> findAllByUserId(@PathVariable String id) {
        return appointmentService.findByUserId(id);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteById(@PathVariable String id) {
        return appointmentService.deleteById(id);
    }

    @PostMapping()
    public ResponseEntity<?> create(@Valid @RequestBody AppointmentCreateRequest body, BindingResult bindingResult) {
        ResponseEntity<?> validationResponse = Validation.handleValidationErrors(bindingResult);

        if (validationResponse != null) {
            return validationResponse;
        }

        return appointmentService.create(body.getUserId(), body.getDoctorId(), body.getDate());
    }
}
