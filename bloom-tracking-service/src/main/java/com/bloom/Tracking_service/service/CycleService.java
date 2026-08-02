package com.bloom.Tracking_service.service;

import com.bloom.Tracking_service.model.CycleLog;
import com.bloom.Tracking_service.repository.CycleLogRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.temporal.ChronoUnit;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class CycleService {

    private final CycleLogRepository cycleRepo;

    public CycleLog save(CycleLog log) {
        return cycleRepo.save(log);
    }

    public List<CycleLog> getHistory(UUID userId) {
        return cycleRepo.findByUserIdOrderByStartDateDesc(userId);
    }

    public Map<String, String> predict(UUID userId) {
        List<CycleLog> logs = cycleRepo.findByUserIdOrderByStartDateAsc(userId);
        Map<String, String> result = new HashMap<>();

        if (logs.isEmpty()) {
            result.put("message", "No cycle data yet. Log your first period to get predictions.");
            return result;
        }

        int avgCycleLength = 28;

        if (logs.size() >= 2) {
            long totalDays = 0;
            for (int i = 1; i < logs.size(); i++) {
                totalDays += ChronoUnit.DAYS.between(
                    logs.get(i - 1).getStartDate(),
                    logs.get(i).getStartDate()
                );
            }
            avgCycleLength = (int) (totalDays / (logs.size() - 1));
        }

        LocalDate lastPeriod = logs.get(logs.size() - 1).getStartDate();
        LocalDate nextPeriod = lastPeriod.plusDays(avgCycleLength);
        LocalDate fertileStart = nextPeriod.minusDays(14);
        LocalDate fertileEnd = fertileStart.plusDays(5);

        result.put("nextPeriod", nextPeriod.toString());
        result.put("fertileWindowStart", fertileStart.toString());
        result.put("fertileWindowEnd", fertileEnd.toString());
        result.put("averageCycleLength", avgCycleLength + " days");
        return result;
    }

    /**
     * Returns the IDs of users whose predicted next period falls within
     * the given number of days from today. Used by the notification
     * service's daily reminder job.
     */
    public List<UUID> getUsersWithUpcomingPeriod(int withinDays) {
        List<UUID> dueUsers = new ArrayList<>();
        LocalDate today = LocalDate.now();

        for (UUID userId : cycleRepo.findDistinctUserIds()) {
            Map<String, String> prediction = predict(userId);
            String nextPeriodStr = prediction.get("nextPeriod");
            if (nextPeriodStr == null) continue; // not enough data yet

            LocalDate nextPeriod = LocalDate.parse(nextPeriodStr);
            long daysUntil = ChronoUnit.DAYS.between(today, nextPeriod);

            if (daysUntil >= 0 && daysUntil <= withinDays) {
                dueUsers.add(userId);
            }
        }
        return dueUsers;
    }
}
