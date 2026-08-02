package com.bloom.Notification_service.service;

import com.bloom.Notification_service.model.FcmToken;
import com.bloom.Notification_service.repository.FcmTokenRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestTemplate;

import java.util.List;
import java.util.UUID;

@Component
@RequiredArgsConstructor
public class ReminderScheduler {

    private final RestTemplate restTemplate;
    private final FcmTokenRepository fcmTokenRepository;
    private final NotificationService notificationService;

    // The tracking-service base URL. Overridable via application.properties
    // (tracking.service.url=...) so it works both locally and in Docker,
    // where the hostname is the docker-compose service name.
    @Value("${tracking.service.url:http://localhost:8082}")
    private String trackingServiceUrl;

    private static final int REMINDER_WINDOW_DAYS = 3;

    // Runs every day at 9:00 AM
    @Scheduled(cron = "0 0 9 * * *")
    public void sendPeriodReminders() {
        System.out.println("Running daily reminder check...");

        UUID[] dueUserIds;
        try {
            dueUserIds = restTemplate.getForObject(
                trackingServiceUrl + "/api/cycles/predictions-due?withinDays=" + REMINDER_WINDOW_DAYS,
                UUID[].class
            );
        } catch (Exception e) {
            System.err.println("Could not reach tracking-service: " + e.getMessage());
            return;
        }

        if (dueUserIds == null || dueUserIds.length == 0) {
            System.out.println("No reminders due today.");
            return;
        }

        for (UUID userId : dueUserIds) {
            fcmTokenRepository.findByUserId(userId).ifPresentOrElse(
                (FcmToken fcmToken) -> notificationService.sendPeriodReminder(fcmToken.getToken(), REMINDER_WINDOW_DAYS),
                () -> System.out.println("No push token on file for user " + userId)
            );
        }
    }
}
