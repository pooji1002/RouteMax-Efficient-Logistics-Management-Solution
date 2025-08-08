package com.routemax.service;

import com.routemax.model.Notification;
import com.routemax.model.User;
import com.routemax.repository.NotificationRepository;
import com.routemax.repository.UserRepository;
import jakarta.mail.internet.MimeMessage;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class NotificationService {

    private static final Logger logger = LoggerFactory.getLogger(NotificationService.class);

    private final JavaMailSender mailSender;
    private final SimpMessagingTemplate messagingTemplate;
    private final NotificationRepository notificationRepository;
    private final UserRepository userRepository;

    public void sendStatusUpdate(String recipientEmail, String trackingNumber, String status) {
        // --- 1. Send Email (Existing Logic) ---
        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setTo(recipientEmail);
            message.setSubject("Parcel Status Update");
            message.setText("Hello,\n\nYour parcel with tracking number " + trackingNumber +
                    " has been updated to status: '" + status + "'.\n\nThank you,\nRouteMax Team");

            logger.info("Attempting to send single-parcel email to: {}", recipientEmail);
            mailSender.send(message);
            logger.info("Successfully sent single-parcel email to: {}", recipientEmail);

        } catch (Exception e) {
            logger.error("Failed to send single-parcel email to {}: {}", recipientEmail, e.getMessage());
        }

        // --- 2. Send Real-time WebSocket Notification (New Logic) ---
        Optional<User> userOptional = userRepository.findByEmail(recipientEmail);
        if (userOptional.isPresent()) {
            User user = userOptional.get();

            // Create the notification message content
            String notificationMessageContent = "Your parcel " + trackingNumber + " is now " + status + ".";

            // Create and save the notification to the database
            Notification notification = new Notification();
            notification.setUser(user);
            notification.setMessage(notificationMessageContent);
            Notification savedNotification = notificationRepository.save(notification);

            // ✅ FIX: Use recipientEmail as the user identifier for WebSocket, not user.getUsername()
            logger.info("Sending real-time notification to user email: {} with content: {}", recipientEmail, notificationMessageContent);
            messagingTemplate.convertAndSendToUser(
                    recipientEmail, // Use the recipient's email directly
                    "/topic/notifications", // The topic for user-specific notifications
                    savedNotification // Send the saved Notification object
            );
        } else {
            logger.warn("Could not send real-time notification because no user was found with email: {}", recipientEmail);
        }
    }

    public void sendMultipleStatusUpdate(String recipientEmail, List<String> trackingNumbers, String status) {
        // --- 1. Send Email (Existing Logic) ---
        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true);

            helper.setTo(recipientEmail);
            helper.setSubject("Multiple Parcel Status Update");

            StringBuilder emailBody = new StringBuilder();
            emailBody.append("Hello,\n\n");
            emailBody.append("The status of your parcels has been updated to: '").append(status).append("'.\n\n");
            emailBody.append("Here are your tracking numbers:\n");

            for (String trackingNumber : trackingNumbers) {
                emailBody.append("- ").append(trackingNumber).append("\n");
            }

            emailBody.append("\nThank you,\nRouteMax Team");

            helper.setText(emailBody.toString(), false);

            logger.info("Attempting to send multi-parcel email to: {}", recipientEmail);
            mailSender.send(message);
            logger.info("Successfully sent multi-parcel email to: {}", recipientEmail);

        } catch (Exception e) {
            logger.error("Failed to send multi-parcel email to {}: {}", recipientEmail, e.getMessage());
        }

        // --- 2. Send Real-time WebSocket Notification (New Logic) ---
        Optional<User> userOptional = userRepository.findByEmail(recipientEmail);
        if (userOptional.isPresent()) {
            User user = userOptional.get();

            String trackingList = trackingNumbers.stream().collect(Collectors.joining(", "));
            String notificationMessageContent = "The status of your parcels (" + trackingList + ") has been updated to: '" + status + "'.";

            // Create and save the notification to the database
            Notification notification = new Notification();
            notification.setUser(user);
            notification.setMessage(notificationMessageContent);
            Notification savedNotification = notificationRepository.save(notification);

            // ✅ FIX: Use recipientEmail as the user identifier for WebSocket, not user.getUsername()
            logger.info("Sending real-time notification to user email: {} with content: {}", recipientEmail, notificationMessageContent);
            messagingTemplate.convertAndSendToUser(
                    recipientEmail, // Use the recipient's email directly
                    "/topic/notifications",
                    savedNotification
            );
        } else {
            logger.warn("Could not send real-time notification because no user was found with email: {}", recipientEmail);
        }
    }
}
