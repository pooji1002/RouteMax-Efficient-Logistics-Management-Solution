package com.routemax.controller;

import com.routemax.model.Parcel;
import com.routemax.model.ParcelRequest;
import com.routemax.service.NotificationService;
import com.routemax.service.ParcelService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin/parcels")
@RequiredArgsConstructor
public class ParcelController {

    private final ParcelService parcelService;
    private final NotificationService notificationService;

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Parcel> addParcel(@RequestBody ParcelRequest request) {
        return ResponseEntity.ok(parcelService.addParcel(request));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Parcel> updateParcel(@PathVariable Long id, @RequestBody ParcelRequest request) {
        return ResponseEntity.ok(parcelService.updateParcel(id, request));
    }

    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<Parcel>> getAllParcels() {
        return ResponseEntity.ok(parcelService.getAllParcels());
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Parcel> getParcel(@PathVariable Long id) {
        return ResponseEntity.ok(parcelService.getParcelById(id));
    }

    @GetMapping("/track/{trackingNumber}")
    public ResponseEntity<Parcel> trackParcel(@PathVariable String trackingNumber) {
        return ResponseEntity.ok(parcelService.getParcelByTrackingNumber(trackingNumber));
    }

    // ✅ Tracks by email & sends status update via email
    @GetMapping("/track/email")
    public ResponseEntity<String> trackParcelByEmail(@RequestParam String email) {
        Parcel parcel = parcelService.getParcelByRecipientEmail(email);
        if (parcel != null) {
            notificationService.sendStatusUpdate(
                    parcel.getRecipientEmail(),
                    parcel.getTrackingNumber(),
                    parcel.getStatus()
            );
            return ResponseEntity.ok("Email sent to " + parcel.getRecipientEmail());
        } else {
            return ResponseEntity.status(404).body("No parcel found for email: " + email);
        }
    }
}
