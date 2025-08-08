package com.routemax.controller;

import com.routemax.model.Parcel;
import com.routemax.model.ParcelRequest;
import com.routemax.service.NotificationService;
import com.routemax.service.ParcelService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/parcels") // ✅ MODIFIED: Changed the base path to a public one
@RequiredArgsConstructor
public class ParcelController {

    private final ParcelService parcelService;
    private final NotificationService notificationService;

    @Autowired
    private SimpMessagingTemplate messagingTemplate;

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')") // ✅ ADDED: Explicitly protect this method
    public ResponseEntity<Parcel> addParcel(@RequestBody ParcelRequest request) {
        return ResponseEntity.ok(parcelService.addParcel(request));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')") // ✅ ADDED: Explicitly protect this method
    public ResponseEntity<Parcel> updateParcel(@PathVariable Long id, @RequestBody ParcelRequest request) {
        return ResponseEntity.ok(parcelService.updateParcel(id, request));
    }

    @GetMapping
    @PreAuthorize("hasRole('ADMIN')") // ✅ ADDED: Explicitly protect this method
    public ResponseEntity<List<Parcel>> getAllParcels() {
        return ResponseEntity.ok(parcelService.getAllParcels());
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')") // ✅ ADDED: Explicitly protect this method
    public ResponseEntity<Parcel> getParcel(@PathVariable Long id) {
        return ResponseEntity.ok(parcelService.getParcelById(id));
    }

    @GetMapping("/track/{trackingNumber}")
    // ❌ NO PreAuthorize: This endpoint is now public
    public ResponseEntity<Parcel> trackParcel(@PathVariable String trackingNumber) {
        return ResponseEntity.ok(parcelService.getParcelByTrackingNumber(trackingNumber));
    }

    @GetMapping("/track/email")
    @PreAuthorize("hasRole('ADMIN')") // ✅ ADDED: Explicitly protect this method
    public ResponseEntity<String> sendParcelEmailToRecipient(@RequestParam String email) {
        List<Parcel> parcels = parcelService.getParcelsByRecipientEmail(email);

        if (parcels != null && !parcels.isEmpty()) {
            parcelService.sendConsolidatedStatusUpdate(email, parcels);
            String notificationMessage = "Your parcel status has been updated!";
            messagingTemplate.convertAndSend("/topic/notifications/" + email, notificationMessage);
            return ResponseEntity.ok("Email and notification sent successfully!");
        } else {
            return ResponseEntity.status(404).body("No parcels found for the specified email.");
        }
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')") // ✅ ADDED: Explicitly protect this method
    public ResponseEntity<String> deleteParcel(@PathVariable Long id) {
        try {
            parcelService.deleteParcel(id);
            return ResponseEntity.ok("Parcel with ID " + id + " deleted successfully.");
        } catch (Exception e) {
            return ResponseEntity.status(404).body("Parcel with ID " + id + " not found.");
        }
    }
}
