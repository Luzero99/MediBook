package com.example.medibook.request;

import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class LoginRequest {
    @NotNull()
    private String email;

    @NotNull()
    private String password;
}
