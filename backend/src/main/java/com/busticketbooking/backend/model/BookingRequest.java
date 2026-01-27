package com.busticketbooking.backend.model;

import lombok.Data;
import java.util.List;

@Data
public class BookingRequest {
    private String userId;
    private String email;
    private String busId;
    private List<Integer> selectedSeats;
    private double totalAmount;
    private String date;
}
