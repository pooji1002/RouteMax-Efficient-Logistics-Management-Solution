package com.routemax.service;

import lombok.RequiredArgsConstructor;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class NotificationService {

    private final JavaMailSender mailSender;

    public void sendStatusUpdate(String recipientEmail, String trackingNumber, String status) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(recipientEmail); // ✅ Fixed: use the method parameter
        message.setSubject("Parcel Status Update");
        message.setText("Hello,\n\nYour parcel with tracking number " + trackingNumber +
                " has been updated to status: '" + status + "'.\n\nThank you,\nRouteMax Team");
        mailSender.send(message);
    }
}
