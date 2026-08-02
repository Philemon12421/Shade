package com.bloom.Tracking_service.model;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDate;
import java.util.UUID;

@Entity
@Table(name = "symptoms")
@Data
public class Symptom {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    private UUID userId;
    private LocalDate logDate;

    // Scores from 1-5
    private Integer cramps;
    private Integer mood;
    private Integer energy;

    private Boolean bloating;
    private Boolean headache;
    private String notes;
}
