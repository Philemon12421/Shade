package com.bloom.Tracking_service.controller;

import com.bloom.Tracking_service.model.Symptom;
import com.bloom.Tracking_service.repository.SymptomRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/symptoms")
@CrossOrigin(origins = "*")
@RequiredArgsConstructor
public class SymptomController {

    private final SymptomRepository symptomRepo;

    @PostMapping("/log")
    public ResponseEntity<Symptom> logSymptom(
            @RequestBody Symptom symptom,
            @RequestHeader("X-User-Id") String userId) {
        symptom.setUserId(UUID.fromString(userId));
        return ResponseEntity.ok(symptomRepo.save(symptom));
    }

    @GetMapping("/history")
    public ResponseEntity<List<Symptom>> getHistory(
            @RequestHeader("X-User-Id") String userId) {
        return ResponseEntity.ok(symptomRepo.findByUserIdOrderByLogDateDesc(UUID.fromString(userId)));
    }
}
