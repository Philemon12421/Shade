package com.bloom.Notification_service.service;

import com.google.firebase.messaging.FirebaseMessaging;
import com.google.firebase.messaging.FirebaseMessagingException;
import com.google.firebase.messaging.Message;
import com.google.firebase.messaging.Notification;
import org.springframework.stereotype.Service;

@Service
public class NotificationService {

    public void sendPeriodReminder(String fcmToken, int daysUntil) {
        try {
            String title = "Bloom Reminder 🌸";
            String body = daysUntil <= 0
                ? "Your period is expected today"
                : "Your period is expected in " + daysUntil + " day" + (daysUntil == 1 ? "" : "s");

            Message message = Message.builder()
                .setToken(fcmToken)
                .setNotification(
                    Notification.builder()
                        .setTitle(title)
                        .setBody(body)
                        .build()
                )
                .build();

            String response = FirebaseMessaging.getInstance().send(message);
            System.out.println("Successfully sent notification: " + response);

        } catch (FirebaseMessagingException e) {
            System.err.println("Failed to send notification: " + e.getMessage());
        }
    }
}