package com.routemax.model;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Parcel {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String senderName;
    private String recipientName;
    private String description;
    private String status; // e.g., "Pending", "Dispatched", "Delivered"
    private String trackingNumber;

    // ✅ Newly added
    private String recipientEmail;  // No @Column needed

}
