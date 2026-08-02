package com.bloom.Notification_service.controller;

import com.bloom.Notification_service.model.FcmToken;
import com.bloom.Notification_service.repository.FcmTokenRepository;
import com.bloom.Notification_service.service.ReminderScheduler;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/api/notifications")
@CrossOrigin(origins = "*")
@RequiredArgsConstructor

public class NotificationController {

    private final FcmTokenRepository fcmTokenRepository;
    private final ReminderScheduler reminderScheduler;

    @PostMapping("/register-token")
    public ResponseEntity<Void> registerToken(
            @RequestBody TokenRequest request,
            @RequestHeader("X-User-Id") String userId) {

        UUID uid = UUID.fromString(userId);
        FcmToken fcmToken = fcmTokenRepository.findByUserId(uid).orElse(new FcmToken());
        fcmToken.setUserId(uid);
        fcmToken.setToken(request.getToken());
        fcmTokenRepository.save(fcmToken);

        return ResponseEntity.ok().build();
    }

 @PostMapping("/test-trigger")
    public ResponseEntity<String> testTrigger(){
        reminderScheduler.sendPeriodReminders();
        return ResponseEntity.ok("Triggered");
        
    }

    public static class TokenRequest {
        private String token;
        public String getToken() { return token; }
        public void setToken(String token) { this.token = token; }
    }
}