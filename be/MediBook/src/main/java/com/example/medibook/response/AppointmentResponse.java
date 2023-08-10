package com.example.medibook.response;

import lombok.AllArgsConstructor;
import lombok.Data;

import java.util.Date;

@Data
@AllArgsConstructor
public class AppointmentResponse {
    private String id;
    private String doctorFirstName;
    private String doctorLastName;
    private String doctorSpeciality;
    private Date date;
}
