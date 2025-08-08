package com.routemax.service;

import com.routemax.model.Parcel;
import com.routemax.model.ParcelRequest;
import com.routemax.model.ParcelStatusUpdate;
import com.routemax.repository.ParcelRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ParcelService {

    private final ParcelRepository parcelRepository;
    private final NotificationService notificationService;
    private final SimpMessagingTemplate messagingTemplate;

    public void deleteParcel(Long id) {
        if (!parcelRepository.existsById(id)) {
            throw new RuntimeException("Parcel with ID " + id + " not found.");
        }
        parcelRepository.deleteById(id);
    }

    public Parcel addParcel(ParcelRequest request) {
        Parcel parcel = Parcel.builder()
                .senderName(request.getSenderName())
                .recipientName(request.getRecipientName())
                .description(request.getDescription())
                .status(request.getStatus())
                .trackingNumber(request.getTrackingNumber())
                .recipientEmail(request.getRecipientEmail())
                .build();

        addStatusToHistory(parcel, request.getStatus());
        Parcel savedParcel = parcelRepository.save(parcel);

        // Send real-time notification
        String notificationMessage = "New parcel added with tracking ID: " + savedParcel.getTrackingNumber();
        messagingTemplate.convertAndSendToUser(
                savedParcel.getRecipientEmail(),
                "/topic/notifications",
                notificationMessage
        );

        return savedParcel;
    }

    public Parcel updateParcel(Long id, ParcelRequest request) {
        Optional<Parcel> optionalParcel = parcelRepository.findById(id);
        if (optionalParcel.isPresent()) {
            Parcel parcel = optionalParcel.get();
            String oldStatus = parcel.getStatus();

            parcel.setSenderName(request.getSenderName());
            parcel.setRecipientName(request.getRecipientName());
            parcel.setDescription(request.getDescription());
            parcel.setStatus(request.getStatus());
            parcel.setTrackingNumber(request.getTrackingNumber());
            parcel.setRecipientEmail(request.getRecipientEmail());

            // Add to history only if status has changed
            if (!oldStatus.equals(request.getStatus())) {
                addStatusToHistory(parcel, request.getStatus());
            }

            Parcel updatedParcel = parcelRepository.save(parcel);

            if (updatedParcel.getRecipientEmail() != null) {
                notificationService.sendStatusUpdate(
                        updatedParcel.getRecipientEmail(),
                        updatedParcel.getTrackingNumber(),
                        updatedParcel.getStatus()
                );

                // Send real-time notification
                String notificationMessage = "Parcel " + updatedParcel.getTrackingNumber() + " status updated to " + updatedParcel.getStatus();
                messagingTemplate.convertAndSendToUser(
                        updatedParcel.getRecipientEmail(),
                        "/topic/notifications",
                        notificationMessage
                );
            }

            return updatedParcel;
        }
        return null;
    }

    private void addStatusToHistory(Parcel parcel, String status) {
        ParcelStatusUpdate statusUpdate = new ParcelStatusUpdate();
        statusUpdate.setStatus(status);
        statusUpdate.setTimestamp(LocalDateTime.now());
        statusUpdate.setParcel(parcel);
        parcel.getStatusHistory().add(statusUpdate);
    }

    public List<Parcel> getAllParcels() {
        return parcelRepository.findAll();
    }

    public Parcel getParcelById(Long id) {
        return parcelRepository.findById(id).orElse(null);
    }

    // This method has been updated to handle the List<Parcel> from the repository.
    public Parcel getParcelByTrackingNumber(String trackingNumber) {
        List<Parcel> parcels = parcelRepository.findByTrackingNumber(trackingNumber);
        // Assuming tracking numbers are unique, return the first one found, or null if the list is empty.
        return parcels.isEmpty() ? null : parcels.get(0);
    }

    public List<Parcel> getParcelsByRecipientEmail(String email) {
        return parcelRepository.findAllByRecipientEmail(email);
    }

    public void sendConsolidatedStatusUpdate(String recipientEmail, List<Parcel> parcels) {
        if (parcels == null || parcels.isEmpty()) {
            return;
        }

        List<String> trackingNumbers = parcels.stream()
                .map(Parcel::getTrackingNumber)
                .collect(Collectors.toList());

        String latestStatus = parcels.get(parcels.size() - 1).getStatus();
        notificationService.sendMultipleStatusUpdate(recipientEmail, trackingNumbers, latestStatus);
    }
}
