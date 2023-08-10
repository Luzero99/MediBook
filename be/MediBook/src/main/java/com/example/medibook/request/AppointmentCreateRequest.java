package com.example.medibook.request;

import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.util.Date;

@Data
public class AppointmentCreateRequest {
    @NotNull
    private String userId;

    @NotNull
    private String doctorId;

    @NotNull
    private Date date;
}
