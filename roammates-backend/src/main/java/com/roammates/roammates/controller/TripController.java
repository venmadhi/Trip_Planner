package com.roammates.roammates.controller;

import com.roammates.roammates.controller.dto.CreateTripRequest;
import com.roammates.roammates.controller.dto.TripDto;
import com.roammates.roammates.service.TripService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/trips")
@RequiredArgsConstructor
public class TripController {

    private final TripService tripService;

    @PostMapping
    public ResponseEntity<TripDto> createTrip(
            @RequestBody CreateTripRequest request,
            @AuthenticationPrincipal UserDetails userDetails
    ) {
        return ResponseEntity.ok(tripService.createTrip(request, userDetails.getUsername()));
    }

    @PostMapping("/join/{inviteCode}")
    public ResponseEntity<TripDto> joinTrip(
            @PathVariable String inviteCode,
            @AuthenticationPrincipal UserDetails userDetails
    ) {
        return ResponseEntity.ok(tripService.joinTrip(inviteCode, userDetails.getUsername()));
    }

    @GetMapping
    public ResponseEntity<List<TripDto>> getUserTrips(
            @AuthenticationPrincipal UserDetails userDetails
    ) {
        return ResponseEntity.ok(tripService.getUserTrips(userDetails.getUsername()));
    }
}
