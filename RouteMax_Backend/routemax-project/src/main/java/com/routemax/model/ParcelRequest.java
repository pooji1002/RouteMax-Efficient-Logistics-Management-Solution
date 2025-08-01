package com.routemax.model;

import lombok.Data;

@Data
public class ParcelRequest {
    private String senderName;
    private String recipientName;
    private String description;
    private String status;
    private String trackingNumber;

    // ✅ Newly added
    private String recipientEmail;
}

