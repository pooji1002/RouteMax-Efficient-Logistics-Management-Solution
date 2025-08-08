package com.routemax.controller;

import com.routemax.dto.FeedbackDto;
import com.routemax.service.FeedbackService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.security.core.Authentication;

import java.util.List;

@RestController
@RequestMapping("/api/feedback")
@RequiredArgsConstructor
public class FeedbackController {

    private final FeedbackService feedbackService;

    @PostMapping("/submit")
    public ResponseEntity<String> submitFeedback(
            Authentication authentication,
            @RequestParam String trackingNumber,
            @RequestParam int rating,
            @RequestParam String comment
    ) {
        // Retrieve the username from the authenticated user
        String username = authentication.getName();

        String response = feedbackService.submitFeedback(trackingNumber, username, rating, comment);
        if (response.contains("successfully")) {
            return ResponseEntity.ok(response);
        } else {
            return ResponseEntity.badRequest().body(response);
        }
    }

    /**
     * This method is updated to return a list of FeedbackDto objects.
     * The FeedbackService will now be responsible for converting
     * the Feedback entities into DTOs before sending them.
     */
    @GetMapping("/all")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<FeedbackDto>> getAllFeedback() {
        return ResponseEntity.ok(feedbackService.getAllFeedbackDto());
    }
}
