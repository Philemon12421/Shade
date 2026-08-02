package com.bloom.bloom_user_service.dto;
import lombok.Data;
@Data

public class LoginRequest {
    private String email;
    private String password;   
}
