package com.bloom.bloom_user_service.controller;

import com.bloom.bloom_user_service.dto.UpdateProfileRequest;
import com.bloom.bloom_user_service.dto.UserProfileResponse;
import com.bloom.bloom_user_service.model.User;
import com.bloom.bloom_user_service.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/api/users")
@CrossOrigin(origins = "*")
@RequiredArgsConstructor
public class UserController {

    private final UserRepository userRepository;

    // Get a user's full profile (dateOfBirth, profilePicture, role, etc.)
    // The login/register responses only return the JWT + displayName + id,
    // so the app calls this afterward if it needs the fuller profile.
    @GetMapping("/{id}")
    public ResponseEntity<UserProfileResponse> getProfile(@PathVariable UUID id) {
        User user = userRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("User not found"));

        return ResponseEntity.ok(new UserProfileResponse(
            user.getId().toString(),
            user.getEmail(),
            user.getDisplayName(),
            user.getUsername(),
            user.getDateOfBirth(),
            user.getProfilePicture(),
            user.getRole().name()
        ));
    }

    // Update dateOfBirth and/or profilePicture. Only sends the fields
    // present in the request - omit a field to leave it unchanged.
    @PatchMapping("/{id}")
    public ResponseEntity<UserProfileResponse> updateProfile(
            @PathVariable UUID id,
            @RequestBody UpdateProfileRequest req) {

        User user = userRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("User not found"));

        if (req.getDateOfBirth() != null) {
            user.setDateOfBirth(req.getDateOfBirth());
        }
        if (req.getProfilePicture() != null) {
            user.setProfilePicture(req.getProfilePicture());
        }
        userRepository.save(user);

        return ResponseEntity.ok(new UserProfileResponse(
            user.getId().toString(),
            user.getEmail(),
            user.getDisplayName(),
            user.getUsername(),
            user.getDateOfBirth(),
            user.getProfilePicture(),
            user.getRole().name()
        ));
    }
}
