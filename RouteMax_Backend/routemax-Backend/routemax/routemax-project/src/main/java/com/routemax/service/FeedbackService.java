package com.routemax.service;

import com.routemax.dto.FeedbackDto;
import com.routemax.model.Feedback;
import com.routemax.model.Parcel;
import com.routemax.model.User;
import com.routemax.repository.FeedbackRepository;
import com.routemax.repository.ParcelRepository;
import com.routemax.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class FeedbackService {

    private final FeedbackRepository feedbackRepository;
    private final ParcelRepository parcelRepository;
    private final UserRepository userRepository;

    public String submitFeedback(String trackingNumber, String username, int rating, String comment) {
        // CORRECTED: findByUsername has been changed to findByEmail
        Optional<User> userOptional = userRepository.findByEmail(username);
        if (userOptional.isEmpty()) {
            return "User not found with email: " + username;
        }
        User user = userOptional.get();

        List<Parcel> parcels = parcelRepository.findByTrackingNumber(trackingNumber);

        if (parcels.isEmpty()) {
            return "Parcel not found with tracking number: " + trackingNumber;
        }

        Parcel parcel = parcels.get(0);

        if (feedbackRepository.findByParcel(parcel).isPresent()) {
            return "Feedback has already been submitted for this parcel.";
        }

        Feedback feedback = new Feedback();
        feedback.setRating(rating);
        feedback.setComment(comment);
        feedback.setParcel(parcel);
        feedback.setUser(user);

        feedbackRepository.save(feedback);
        return "Feedback submitted successfully.";
    }

    /**
     * This is the new method that resolves the error.
     * It retrieves all feedback and maps it to a list of DTOs for the frontend.
     * The `FeedbackDto` contains the tracking number, user name, and timestamp.
     *
     * @return A list of `FeedbackDto` objects.
     */
    public List<FeedbackDto> getAllFeedbackDto() {
        List<Feedback> feedbackList = feedbackRepository.findAll();

        return feedbackList.stream().map(feedback -> {
            FeedbackDto dto = new FeedbackDto();
            dto.setRating(feedback.getRating());
            dto.setComment(feedback.getComment());

            if (feedback.getParcel() != null) {
                dto.setTrackingNumber(feedback.getParcel().getTrackingNumber());
            }

            if (feedback.getUser() != null) {
                dto.setUserName(feedback.getUser().getUsername());
            }

            dto.setTimestamp(feedback.getTimestamp());

            return dto;
        }).collect(Collectors.toList());
    }
}
