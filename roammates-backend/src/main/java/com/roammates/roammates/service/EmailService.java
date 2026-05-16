package com.roammates.roammates.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@Slf4j
public class EmailService {

    private final JavaMailSender mailSender;

    @Value("${spring.mail.username}")
    private String fromEmail;

    public void sendTripInvite(String toEmail, String tripName, String inviteCode) {
        try {
            SimpleMailMessage message = new SimpleMailMessage();
            // Since we might be using Mailtrap, the "from" doesn't matter as much, 
            // but in production it should be a verified domain.
            message.setFrom(fromEmail != null && !fromEmail.isEmpty() ? fromEmail : "noreply@roammates.com");
            message.setTo(toEmail);
            message.setSubject("You've been invited to " + tripName + " on Roammates!");
            
            String text = "Hello!\n\n" +
                    "You have been invited to join the trip: " + tripName + ".\n" +
                    "Use the following invite code to join the trip on the Roammates app:\n\n" +
                    inviteCode + "\n\n" +
                    "Happy travels,\n" +
                    "The Roammates Team";
            
            message.setText(text);
            mailSender.send(message);
            log.info("Invitation email sent to {}", toEmail);
        } catch (Exception e) {
            log.error("Failed to send invitation email to {}", toEmail, e);
            throw new RuntimeException("Failed to send email invitation");
        }
    }
}
