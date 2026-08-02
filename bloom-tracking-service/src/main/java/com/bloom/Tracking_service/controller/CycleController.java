package com.bloom.Tracking_service.controller;

import com.bloom.Tracking_service.model.CycleLog;
import com.bloom.Tracking_service.service.CycleService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/cycles")
@CrossOrigin(origins = "*")
@RequiredArgsConstructor
public class CycleController {

    private final CycleService cycleService;

    @PostMapping("/log")
    public ResponseEntity<CycleLog> logCycle(
            @RequestBody CycleLog cycleLog,
            @RequestHeader("X-User-Id") String userId) {
        cycleLog.setUserId(UUID.fromString(userId));
        return ResponseEntity.ok(cycleService.save(cycleLog));
    }

    @GetMapping("/history")
    public ResponseEntity<List<CycleLog>> getHistory(
            @RequestHeader("X-User-Id") String userId) {
        return ResponseEntity.ok(cycleService.getHistory(UUID.fromString(userId)));
    }

    @GetMapping("/predict")
    public ResponseEntity<Map<String, String>> predict(
            @RequestHeader("X-User-Id") String userId) {
        return ResponseEntity.ok(cycleService.predict(UUID.fromString(userId)));
    }

    // Internal endpoint used by the notification service's daily reminder job.
    // Not user-facing - no X-User-Id header needed.
    @GetMapping("/predictions-due")
    public ResponseEntity<List<UUID>> getUsersWithUpcomingPeriod(
            @RequestParam(defaultValue = "3") int withinDays) {
        return ResponseEntity.ok(cycleService.getUsersWithUpcomingPeriod(withinDays));
    }
}
