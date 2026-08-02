package com.bloom.bloom_user_service.dto;
import lombok.Data;
import java.time.LocalDate;

@Data 
public class RegisterRequest {
    private String email;
    private String password;
    private String displayName;
    private String username; // optional - unique handle, e.g. "duke_t"
    private LocalDate dateOfBirth; // optional - format "YYYY-MM-DD", can be omitted
}
