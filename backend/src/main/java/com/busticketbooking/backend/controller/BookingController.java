package com.busticketbooking.backend.controller;

import com.busticketbooking.backend.model.BookingRequest;
import com.busticketbooking.backend.service.BookingService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Collections;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/bookings")

public class BookingController {

    @Autowired
    private BookingService bookingService;

    @PostMapping
    public ResponseEntity<Map<String, String>> createBooking(@RequestBody BookingRequest request) {
        String bookingId = bookingService.createBooking(request);
        return ResponseEntity.ok(Collections.singletonMap("bookingId", bookingId));
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<Map<String, Object>>> getUserBookings(@PathVariable String userId) {
        List<Map<String, Object>> bookings = bookingService.getBookingsByUserId(userId);
        return ResponseEntity.ok(bookings);
    }
}
