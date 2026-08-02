package com.bloom.bloom_user_service.dto;

import lombok.Data;
import java.time.LocalDate;

@Data
public class UpdateProfileRequest {
    // Both optional - only the fields the app sends get updated
    private LocalDate dateOfBirth;
    private String profilePicture;
}
