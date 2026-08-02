package com.bloom.community_service.service;

import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Locale;


@Service
public class ModerationService {

    // Keep this short and demo-appropriate; extend as needed.
    private static final List<String> FLAGGED_KEYWORDS = List.of(
        "kill myself", "suicide", "self harm",
        "abortion pill", "overdose"
    );

    public boolean shouldFlag(String content) {
        if (content == null) return false;
        String lower = content.toLowerCase(Locale.ROOT);
        return FLAGGED_KEYWORDS.stream().anyMatch(lower::contains);
    }
}
