package com.routemax.repository;

import com.routemax.model.Parcel;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ParcelRepository extends JpaRepository<Parcel, Long> {
    Parcel findByTrackingNumber(String trackingNumber);

    // ✅ New: Find parcel by recipient email
    Parcel findByRecipientEmail(String recipientEmail);
}

