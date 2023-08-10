package com.example.medibook.request;

import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class UpdateRoleRequest {
    @NotNull
    private String id;

    @NotNull
    private String role;
}
