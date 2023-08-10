package com.example.medibook.model;

import jakarta.persistence.*;
import lombok.Data;

import java.util.Date;
import java.util.UUID;

@Entity
@Data
public class Appointment {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @ManyToOne()
    @JoinColumn(name = "doctor_id")
    private Doctor doctor;

    @ManyToOne()
    @JoinColumn(name = "patient_id")
    private Patient patient;

    @Column(name = "appointment_date")
    private Date date;

    @Column(name = "notes")
    private String notes;
}
