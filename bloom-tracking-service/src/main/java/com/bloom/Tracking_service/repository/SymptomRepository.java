package com.bloom.Tracking_service.repository;

import com.bloom.Tracking_service.model.Symptom;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.UUID;

public interface SymptomRepository extends JpaRepository<Symptom, UUID> {
    List<Symptom> findByUserIdOrderByLogDateDesc(UUID userId);
}