package com.bloom.Notification_service.repository;

import com.bloom.Notification_service.model.FcmToken;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;
import java.util.UUID;

public interface FcmTokenRepository extends JpaRepository<FcmToken, UUID> {
    Optional<FcmToken> findByUserId(UUID userId);
}
