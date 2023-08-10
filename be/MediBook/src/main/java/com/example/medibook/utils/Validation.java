package com.example.medibook.utils;

import com.example.medibook.response.ErrorResponse;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.BindingResult;
import org.springframework.validation.FieldError;

public class Validation {
    public static ResponseEntity<?> handleValidationErrors(BindingResult bindingResult) {
        if (bindingResult.hasErrors()) {
            FieldError error = bindingResult.getFieldErrors().get(0);
            return ResponseEntity.badRequest().body(ErrorResponse.builder().error(error.getDefaultMessage()).build());
        }

        return null;
    }
}
