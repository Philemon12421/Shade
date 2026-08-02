package com.bloom.bloom_user_service.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import java.time.LocalDate;

@Data
@AllArgsConstructor
public class UserProfileResponse {
    private String userId;
    private String email;
    private String displayName;
    private String username;
    private LocalDate dateOfBirth;
    private String profilePicture;
    private String role;
}
