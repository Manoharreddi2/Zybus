package com.busticketbooking.backend.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
public class EmailService {

    @Autowired(required = false)
    private JavaMailSender mailSender;

    public void sendBookingConfirmation(String toEmail, String bookingId, String busName, String seats, double totalAmount) {
        if (mailSender == null) {
            System.out.println("Email service not configured. Skipping email to: " + toEmail);
            return;
        }

        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setFrom("noreply@neobus.com");
            message.setTo(toEmail);
            message.setSubject("Booking Confirmation - " + bookingId);
            message.setText(
                "Dear Customer,\n\n" +
                "Your bus ticket has been booked successfully!\n\n" +
                "Booking ID: " + bookingId + "\n" +
                "Bus: " + busName + "\n" +
                "Seats: " + seats + "\n" +
                "Total Amount: ₹" + totalAmount + "\n\n" +
                "Thank you for choosing Zybus!\n" +
                "Have a safe journey."
            );

            mailSender.send(message);
            System.out.println("Confirmation email sent to: " + toEmail);
        } catch (Exception e) {
            System.err.println("Failed to send email: " + e.getMessage());
        }
    }

    public void sendOtpEmail(String toEmail, String otp) {
        if (mailSender == null) {
            System.out.println("Email service not configured. OTP for " + toEmail + ": " + otp);
            throw new RuntimeException("Email service not configured");
        }

        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setFrom("noreply@neobus.com");
            message.setTo(toEmail);
            message.setSubject("Zybus - Password Reset OTP");
            message.setText(
                "Dear Customer,\n\n" +
                "Your OTP for password reset is:\n\n" +
                "    " + otp + "\n\n" +
                "This OTP is valid for 10 minutes.\n" +
                "If you did not request this, please ignore this email.\n\n" +
                "Thank you,\n" +
                "Zybus Team"
            );

            mailSender.send(message);
            System.out.println("OTP email sent to: " + toEmail);
        } catch (Exception e) {
            System.err.println("Failed to send OTP email: " + e.getMessage());
            throw e;
        }
    }
}

