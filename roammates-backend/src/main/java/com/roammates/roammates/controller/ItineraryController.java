package com.roammates.roammates.controller;

import com.roammates.roammates.controller.dto.ItineraryItemRequest;
import com.roammates.roammates.controller.dto.ItineraryItemResponse;
import com.roammates.roammates.service.ItineraryService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/trips/{tripId}/itinerary")
@RequiredArgsConstructor
public class ItineraryController {

    private final ItineraryService itineraryService;

    @GetMapping
    public ResponseEntity<List<ItineraryItemResponse>> getItinerary(@PathVariable Long tripId) {
        return ResponseEntity.ok(itineraryService.getItineraryForTrip(tripId));
    }

    @PostMapping
    public ResponseEntity<ItineraryItemResponse> addItineraryItem(
            @PathVariable Long tripId,
            @RequestBody ItineraryItemRequest request) {
        return ResponseEntity.ok(itineraryService.addItineraryItem(tripId, request));
    }

    @PutMapping("/{itemId}")
    public ResponseEntity<ItineraryItemResponse> updateItineraryItem(
            @PathVariable Long tripId,
            @PathVariable Long itemId,
            @RequestBody ItineraryItemRequest request) {
        return ResponseEntity.ok(itineraryService.updateItineraryItem(tripId, itemId, request));
    }

    @DeleteMapping("/{itemId}")
    public ResponseEntity<Void> deleteItineraryItem(
            @PathVariable Long tripId,
            @PathVariable Long itemId) {
        itineraryService.deleteItineraryItem(tripId, itemId);
        return ResponseEntity.noContent().build();
    }
}
