package com.busticketbooking.backend.service;

import com.busticketbooking.backend.model.Bus;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class BusService {

    private List<Bus> busList = new ArrayList<>();

    public BusService() {
        // Initialize with Mock Data for now
        busList.add(new Bus("1", "NeoTravels Premium", "AC Sleeper (2+1)", "22:00", "06:00", "8h 00m", 50, 12, 4.5, "Mumbai", "Pune", "2023-10-25"));
        busList.add(new Bus("2", "CityExpress", "Non-AC Seater (2+2)", "20:30", "05:00", "8h 30m", 50, 24, 4.0, "Mumbai", "Pune", "2023-10-25"));
        busList.add(new Bus("3", "NightRider", "AC Volvo", "23:00", "06:30", "7h 30m", 50, 5, 4.8, "Mumbai", "Pune", "2023-10-25"));
        busList.add(new Bus("4", "InterCity Gold", "AC Sleeper", "21:15", "05:45", "8h 30m", 50, 15, 4.2, "Mumbai", "Pune", "2023-10-25"));
    }

    public List<Bus> searchBuses(String from, String to, String date) {
        // For current demo, ignoring date/cities filtering to return data always
        return busList;
        
        // Real filtering would be:
        // return busList.stream()
        //         .filter(b -> b.getFromCity().equalsIgnoreCase(from) && b.getToCity().equalsIgnoreCase(to))
        //         .collect(Collectors.toList());
    }
    
    public Bus getBusById(String id) {
        return busList.stream().filter(b -> b.getId().equals(id)).findFirst().orElse(null);
    }
}
