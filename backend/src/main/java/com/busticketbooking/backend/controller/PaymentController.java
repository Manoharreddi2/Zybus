package com.busticketbooking.backend.controller;

import com.busticketbooking.backend.service.PaymentService;
import com.razorpay.RazorpayException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Collections;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/payments")
@CrossOrigin(origins = "*")
public class PaymentController {

    @Autowired
    private PaymentService paymentService;

    /**
     * Create a payment order
     * Request body: { "amount": 100 } (amount in INR)
     */
    @PostMapping("/create-order")
    public ResponseEntity<?> createOrder(@RequestBody Map<String, Object> request) {
        try {
            double amount = Double.parseDouble(request.get("amount").toString());
            String receipt = "rcpt_" + UUID.randomUUID().toString().substring(0, 8);
            
            Map<String, Object> orderDetails = paymentService.createOrder(amount, receipt);
            return ResponseEntity.ok(orderDetails);
            
        } catch (RazorpayException e) {
            System.err.println("Razorpay error: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Collections.singletonMap("error", "Failed to create payment order: " + e.getMessage()));
        } catch (Exception e) {
            System.err.println("Error creating order: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Collections.singletonMap("error", "Invalid request"));
        }
    }

    /**
     * Verify payment after completion
     * Request body: { "orderId": "...", "paymentId": "...", "signature": "..." }
     */
    @PostMapping("/verify")
    public ResponseEntity<?> verifyPayment(@RequestBody Map<String, String> request) {
        String orderId = request.get("orderId");
        String paymentId = request.get("paymentId");
        String signature = request.get("signature");

        if (orderId == null || paymentId == null || signature == null) {
            return ResponseEntity.badRequest()
                    .body(Collections.singletonMap("error", "Missing required fields"));
        }

        boolean isValid = paymentService.verifyPayment(orderId, paymentId, signature);
        
        if (isValid) {
            return ResponseEntity.ok(Collections.singletonMap("status", "success"));
        } else {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Collections.singletonMap("error", "Payment verification failed"));
        }
    }
}
