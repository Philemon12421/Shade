package com.bloom.Tracking_service.repository;

import com.bloom.Tracking_service.model.CycleLog;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import java.util.List;
import java.util.UUID;

public interface CycleLogRepository extends JpaRepository<CycleLog, UUID> {
    List<CycleLog> findByUserIdOrderByStartDateDesc(UUID userId);
    List<CycleLog> findByUserIdOrderByStartDateAsc(UUID userId);

    @Query("SELECT DISTINCT c.userId FROM CycleLog c")
    List<UUID> findDistinctUserIds();
}