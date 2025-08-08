package com.routemax.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class FeedbackDto {

    private String trackingNumber;
    private String userName;
    private int rating;
    private String comment;
    private LocalDateTime timestamp;
}
