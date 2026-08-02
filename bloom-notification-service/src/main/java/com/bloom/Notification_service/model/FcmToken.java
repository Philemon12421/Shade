package com.bloom.Notification_service.model;

import jakarta.persistence.*;
import lombok.Data;


import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "fcm_tokens")
@Data
public class FcmToken {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(nullable = false)
    private UUID userId;

    @Column(nullable = false)
    private String token;

    private LocalDateTime updatedAt = LocalDateTime.now();
}
