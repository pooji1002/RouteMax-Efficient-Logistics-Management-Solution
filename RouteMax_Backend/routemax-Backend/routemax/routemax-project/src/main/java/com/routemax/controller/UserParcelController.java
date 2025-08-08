package com.routemax.controller;

import com.routemax.model.Parcel;
import com.routemax.model.User;
import com.routemax.repository.UserRepository;
import com.routemax.service.ParcelService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/parcels")
@RequiredArgsConstructor
public class UserParcelController {

    private final ParcelService parcelService;
    private final UserRepository userRepository;

    @GetMapping("/history")
    @PreAuthorize("hasAnyAuthority('ROLE_USER', 'ROLE_ADMIN')") // ✅ CORRECTED: Use specific role checks
    public ResponseEntity<List<Parcel>> getMyParcelHistory(Authentication authentication) {
        String userEmail = authentication.getName();

        // 1. Find the user by their email, which is the username from the token
        // Use findByEmail instead of findByUsername
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new RuntimeException("User not found with email: " + userEmail));

        // 2. Now use this email to find the parcels
        List<Parcel> parcels = parcelService.getParcelsByRecipientEmail(userEmail);

        if (parcels.isEmpty()) {
            return ResponseEntity.noContent().build();
        }

        return ResponseEntity.ok(parcels);
    }
}
