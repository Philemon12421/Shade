package com.bloom.Notification_service.dto;

import lombok.Data;

@Data
public class RegisterTokenRequest {
    private String userId;
    private String token;
}
