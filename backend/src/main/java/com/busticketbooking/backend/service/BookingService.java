package com.busticketbooking.backend.service;

import com.busticketbooking.backend.model.BookingRequest;
import com.busticketbooking.backend.model.Bus;
import com.google.cloud.firestore.Firestore;
import com.google.firebase.cloud.FirestoreClient;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;

@Service
public class BookingService {

    @Autowired
    private EmailService emailService;

    @Autowired
    private BusService busService;

    public String createBooking(BookingRequest request) {
        String bookingId = "NB" + UUID.randomUUID().toString().substring(0, 8).toUpperCase();
        
        try {
            Firestore db = FirestoreClient.getFirestore();
            if (db != null) {
                Map<String, Object> booking = new HashMap<>();
                booking.put("id", bookingId);
                booking.put("userId", request.getUserId());
                booking.put("email", request.getEmail());
                booking.put("busId", request.getBusId());
                booking.put("selectedSeats", request.getSelectedSeats());
                booking.put("totalAmount", request.getTotalAmount());
                booking.put("date", request.getDate());
                booking.put("status", "CONFIRMED");
                
                db.collection("bookings").document(bookingId).set(booking).get();
                System.out.println("Booking created in Firestore: " + bookingId);
            } else {
                System.out.println("Firestore not initialized. Skipping DB write.");
            }
        } catch (Exception e) {
            System.err.println("Error saving to Firestore: " + e.getMessage());
            throw new RuntimeException("Failed to save booking to backend");
        }
        
        // Send Email Notification
        sendConfirmationNotification(request, bookingId);
        
        return bookingId;
    }

    private void sendConfirmationNotification(BookingRequest request, String bookingId) {
        Bus bus = busService.getBusById(request.getBusId());
        String busName = bus != null ? bus.getName() : "Unknown Bus";
        String seats = request.getSelectedSeats().toString();
        
        emailService.sendBookingConfirmation(
            request.getEmail(),
            bookingId,
            busName,
            seats,
            request.getTotalAmount()
        );
    }

    public List<Map<String, Object>> getBookingsByUserId(String userId) {
        List<Map<String, Object>> bookings = new java.util.ArrayList<>();
        
        try {
            Firestore db = FirestoreClient.getFirestore();
            if (db != null) {
                var querySnapshot = db.collection("bookings")
                    .whereEqualTo("userId", userId)
                    .get()
                    .get();
                
                for (var doc : querySnapshot.getDocuments()) {
                    Map<String, Object> booking = doc.getData();
                    
                    // Enrich booking with bus details
                    String busId = (String) booking.get("busId");
                    if (busId != null) {
                        Bus bus = busService.getBusById(busId);
                        if (bus != null) {
                            booking.put("busName", bus.getName());
                            booking.put("busType", bus.getType());
                            booking.put("departure", bus.getDeparture());
                            booking.put("arrival", bus.getArrival());
                        }
                    }
                    
                    bookings.add(booking);
                }
            }
        } catch (Exception e) {
            System.err.println("Error fetching bookings: " + e.getMessage());
        }
        
        return bookings;
    }
}
