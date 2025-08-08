package com.routemax.repository;

import com.routemax.model.Parcel;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface ParcelRepository extends JpaRepository<Parcel, Long> {

    List<Parcel> findByTrackingNumber(String trackingNumber);

    List<Parcel> findAllByRecipientEmail(String recipientEmail);
}
