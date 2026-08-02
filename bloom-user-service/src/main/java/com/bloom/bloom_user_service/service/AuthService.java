package com.bloom.bloom_user_service.service;

import com.bloom.bloom_user_service.dto.*;
import com.bloom.bloom_user_service.model.User;
import com.bloom.bloom_user_service.repository.UserRepository;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import javax.crypto.SecretKey;
import java.util.Date;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();

    private final String SECRET = "bloom-super-secret-key-at-least-256-bits-long";

    public AuthResponse register(RegisterRequest req) {
        User user = new User();
        user.setEmail(req.getEmail());
        user.setPasswordHash(encoder.encode(req.getPassword()));
        user.setDisplayName(req.getDisplayName());
        user.setUsername(req.getUsername()); // may be null - that's fine
        user.setDateOfBirth(req.getDateOfBirth()); // may be null - that's fine
        userRepository.save(user);
        String token = generateToken(user.getId().toString());
        return new AuthResponse(token, user.getDisplayName(), user.getId().toString());
    }

    public AuthResponse login(LoginRequest req) {
        User user = userRepository.findByEmail(req.getEmail())
            .orElseThrow(() -> new RuntimeException("User not found"));
        if (!encoder.matches(req.getPassword(), user.getPasswordHash())) {
            throw new RuntimeException("Invalid password");
        }
        String token = generateToken(user.getId().toString());
        return new AuthResponse(token, user.getDisplayName(), user.getId().toString());
    }

    private String generateToken(String userId) {
        SecretKey key = Keys.hmacShaKeyFor(SECRET.getBytes());
        return Jwts.builder()
            .subject(userId)
            .issuedAt(new Date())
            .expiration(new Date(System.currentTimeMillis() + 86400000))
            .signWith(key)
            .compact();
    }
}
