package com.roammates.roammates.service;

import com.roammates.roammates.controller.dto.ItineraryItemRequest;
import com.roammates.roammates.controller.dto.ItineraryItemResponse;
import com.roammates.roammates.entity.ItineraryItem;
import com.roammates.roammates.entity.Trip;
import com.roammates.roammates.repository.ItineraryItemRepository;
import com.roammates.roammates.repository.TripRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ItineraryService {

    private final ItineraryItemRepository itineraryItemRepository;
    private final TripRepository tripRepository;

    public List<ItineraryItemResponse> getItineraryForTrip(Long tripId) {
        return itineraryItemRepository.findByTripIdOrderByStartTimeAsc(tripId)
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    public ItineraryItemResponse addItineraryItem(Long tripId, ItineraryItemRequest request) {
        Trip trip = tripRepository.findById(tripId)
                .orElseThrow(() -> new RuntimeException("Trip not found"));

        ItineraryItem item = ItineraryItem.builder()
                .trip(trip)
                .title(request.getTitle())
                .description(request.getDescription())
                .startTime(request.getStartTime())
                .endTime(request.getEndTime())
                .location(request.getLocation())
                .cost(request.getCost())
                .build();

        ItineraryItem savedItem = itineraryItemRepository.save(item);
        return mapToResponse(savedItem);
    }

    public ItineraryItemResponse updateItineraryItem(Long tripId, Long itemId, ItineraryItemRequest request) {
        ItineraryItem item = itineraryItemRepository.findById(itemId)
                .orElseThrow(() -> new RuntimeException("Itinerary item not found"));

        if (!item.getTrip().getId().equals(tripId)) {
            throw new RuntimeException("Itinerary item does not belong to this trip");
        }

        item.setTitle(request.getTitle());
        item.setDescription(request.getDescription());
        item.setStartTime(request.getStartTime());
        item.setEndTime(request.getEndTime());
        item.setLocation(request.getLocation());
        item.setCost(request.getCost());

        ItineraryItem updatedItem = itineraryItemRepository.save(item);
        return mapToResponse(updatedItem);
    }

    public void deleteItineraryItem(Long tripId, Long itemId) {
        ItineraryItem item = itineraryItemRepository.findById(itemId)
                .orElseThrow(() -> new RuntimeException("Itinerary item not found"));

        if (!item.getTrip().getId().equals(tripId)) {
            throw new RuntimeException("Itinerary item does not belong to this trip");
        }

        itineraryItemRepository.delete(item);
    }

    private ItineraryItemResponse mapToResponse(ItineraryItem item) {
        return ItineraryItemResponse.builder()
                .id(item.getId())
                .title(item.getTitle())
                .description(item.getDescription())
                .startTime(item.getStartTime())
                .endTime(item.getEndTime())
                .location(item.getLocation())
                .cost(item.getCost())
                .tripId(item.getTrip().getId())
                .build();
    }
}
