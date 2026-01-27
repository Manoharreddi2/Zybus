package com.busticketbooking.backend.controller;

import com.busticketbooking.backend.model.Bus;
import com.busticketbooking.backend.service.BusService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/buses")
public class BusController {

    @Autowired
    private BusService busService;

    @GetMapping
    public List<Bus> getBuses(@RequestParam(required = false) String from,
                              @RequestParam(required = false) String to,
                              @RequestParam(required = false) String date) {
        return busService.searchBuses(from, to, date);
    }
    
    @GetMapping("/{id}")
    public Bus getBusById(@PathVariable String id) {
        return busService.getBusById(id);
    }
}
