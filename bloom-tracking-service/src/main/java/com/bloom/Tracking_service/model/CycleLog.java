package com.bloom.Tracking_service.model;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDate;
import java.util.UUID;

@Entity
@Table(name = "cycle_logs")
@Data
public class CycleLog {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(nullable = false)
    private UUID userId;

    @Column(nullable = false)
    private LocalDate startDate;

    private LocalDate endDate;

    // "light", "medium", "heavy", or "spotting"
    private String flowLevel;
}
