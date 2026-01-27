package com.busticketbooking.backend.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class Bus {
    private String id;
    private String name;
    private String type;
    private String departure;
    private String arrival;
    private String duration;
    private double price;
    private int seatsAvailable;
    private double rating;
    private String fromCity;
    private String toCity;
    private String date;
}
