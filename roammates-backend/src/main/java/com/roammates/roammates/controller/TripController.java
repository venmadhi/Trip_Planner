package com.roammates.roammates.controller;

import com.roammates.roammates.controller.dto.CreateTripRequest;
import com.roammates.roammates.controller.dto.TripDto;
import com.roammates.roammates.service.TripService;
import com.roammates.roammates.service.EmailService;
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
    private final EmailService emailService;

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

    @PostMapping("/{tripId}/invite-email")
    public ResponseEntity<Void> sendEmailInvite(
            @PathVariable Long tripId,
            @RequestParam String email,
            @AuthenticationPrincipal UserDetails userDetails
    ) {
        // In a real app, you would verify the user is a member of the trip first.
        // For now, we'll fetch the trip to get the code and name.
        TripDto trip = tripService.getUserTrips(userDetails.getUsername())
                .stream()
                .filter(t -> t.getId().equals(tripId))
                .findFirst()
                .orElseThrow(() -> new RuntimeException("Trip not found"));

        emailService.sendTripInvite(email, "Trip " + trip.getId(), trip.getInviteCode());
        return ResponseEntity.ok().build();
    }

    @GetMapping
    public ResponseEntity<List<TripDto>> getUserTrips(
            @AuthenticationPrincipal UserDetails userDetails
    ) {
        return ResponseEntity.ok(tripService.getUserTrips(userDetails.getUsername()));
    }
}
