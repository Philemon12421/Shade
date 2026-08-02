package com.bloom.bloom_user_service.model;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "users")
@Data
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(unique = true, nullable = false)
    private String email;

    @Column(nullable = false)
    private String passwordHash;

    private String displayName;

    // Unique handle, separate from displayName (which can be anything,
    // e.g. "Duke T."). Nullable for now so existing/older registration
    // flows that don't send it yet don't break.
    @Column(unique = true)
    private String username;

    private LocalDate dateOfBirth;

    // URL/path to the uploaded profile picture. No upload endpoint yet -
    // this just stores a URL if one is set some other way (e.g. a future
    // image upload feature, or a default avatar picker in the app).
    private String profilePicture;

    @Enumerated(EnumType.STRING)
    private Role role = Role.USER;

    private LocalDateTime createdAt = LocalDateTime.now();

    public enum Role {
        USER, ADMIN
    }
}