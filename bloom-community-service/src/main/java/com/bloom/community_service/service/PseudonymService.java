package com.bloom.community_service.service;

import org.springframework.stereotype.Service;

import java.util.Random;

@Service
public class PseudonymService {

    private static final String[] COLORS = {
        "Purple", "Rose", "Coral", "Ivory", "Jade",
        "Amber", "Indigo", "Crimson", "Teal", "Silver"
    };

    private static final String[] FLOWERS = {
        "Orchid", "Lotus", "Dahlia", "Fern", "Lily",
        "Jasmine", "Violet", "Iris", "Poppy", "Zinnia"
    };


    public String generate() {
        Random random = new Random();
        String color = COLORS[random.nextInt(COLORS.length)];
        String flower = FLOWERS[random.nextInt(FLOWERS.length)];
        int number = random.nextInt(99) + 1;
        return color + flower + number; 
    }
}
