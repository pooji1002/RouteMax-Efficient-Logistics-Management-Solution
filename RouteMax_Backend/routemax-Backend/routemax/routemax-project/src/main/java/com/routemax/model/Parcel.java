package com.routemax.model;

import jakarta.persistence.*;
import lombok.*;
import java.util.ArrayList;
import java.util.List;

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

    // This now holds the CURRENT status for easy access
    private String status;

    private String trackingNumber;
    private String recipientEmail;

    // ✅ THE FIX: @Builder.Default tells Lombok to always create an empty list.
    @Builder.Default
    @OneToMany(mappedBy = "parcel", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<ParcelStatusUpdate> statusHistory = new ArrayList<>();

}