package com.routemax.service;

import com.routemax.model.Parcel;
import com.routemax.model.ParcelRequest;
import com.routemax.repository.ParcelRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class ParcelService {

    private final ParcelRepository parcelRepository;
    private final NotificationService notificationService; // ✅ Injected for email

    public Parcel addParcel(ParcelRequest request) {
        Parcel parcel = Parcel.builder()
                .senderName(request.getSenderName())
                .recipientName(request.getRecipientName())
                .description(request.getDescription())
                .status(request.getStatus())
                .trackingNumber(request.getTrackingNumber())
                .recipientEmail(request.getRecipientEmail()) // ✅ Optional: if available in DTO
                .build();

        return parcelRepository.save(parcel);
    }

    public Parcel updateParcel(Long id, ParcelRequest request) {
        Optional<Parcel> optionalParcel = parcelRepository.findById(id);
        if (optionalParcel.isPresent()) {
            Parcel parcel = optionalParcel.get();
            parcel.setSenderName(request.getSenderName());
            parcel.setRecipientName(request.getRecipientName());
            parcel.setDescription(request.getDescription());
            parcel.setStatus(request.getStatus());
            parcel.setTrackingNumber(request.getTrackingNumber());
            parcel.setRecipientEmail(request.getRecipientEmail()); // ✅ Optional

            Parcel updatedParcel = parcelRepository.save(parcel);

            // ✅ Send email after status update
            if (updatedParcel.getRecipientEmail() != null) {
                notificationService.sendStatusUpdate(
                        updatedParcel.getRecipientEmail(),
                        updatedParcel.getTrackingNumber(),
                        updatedParcel.getStatus()
                );
            }

            return updatedParcel;
        }
        return null;
    }

    public List<Parcel> getAllParcels() {
        return parcelRepository.findAll();
    }

    public Parcel getParcelById(Long id) {
        return parcelRepository.findById(id).orElse(null);
    }

    // ✅ New: Fetch parcel by tracking number
    public Parcel getParcelByTrackingNumber(String trackingNumber) {
        return parcelRepository.findByTrackingNumber(trackingNumber);
    }

    // ✅ New: Fetch parcel by recipient email
    public Parcel getParcelByRecipientEmail(String email) {
        return parcelRepository.findByRecipientEmail(email);
    }
}
