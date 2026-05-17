package com.roammates.roammates.controller;

import com.roammates.roammates.controller.dto.ChecklistItemDto;
import com.roammates.roammates.entity.ChecklistItem;
import com.roammates.roammates.entity.Trip;
import com.roammates.roammates.entity.User;
import com.roammates.roammates.repository.ChecklistItemRepository;
import com.roammates.roammates.repository.TripRepository;
import com.roammates.roammates.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/v1/trips/{tripId}/checklist")
@RequiredArgsConstructor
public class ChecklistController {

    private final ChecklistItemRepository checklistItemRepository;
    private final TripRepository tripRepository;
    private final UserRepository userRepository;

    @GetMapping
    public ResponseEntity<List<ChecklistItemDto>> getChecklist(@PathVariable Long tripId) {
        List<ChecklistItemDto> items = checklistItemRepository.findByTripId(tripId).stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
        return ResponseEntity.ok(items);
    }

    @PostMapping
    public ResponseEntity<ChecklistItemDto> addItem(@PathVariable Long tripId, @RequestBody ChecklistItemDto request, Authentication authentication) {
        Trip trip = tripRepository.findById(tripId).orElseThrow(() -> new RuntimeException("Trip not found"));
        User user = userRepository.findByEmail(authentication.getName()).orElseThrow(() -> new RuntimeException("User not found"));

        ChecklistItem item = ChecklistItem.builder()
                .trip(trip)
                .text(request.getText())
                .packed(false)
                .addedBy(user)
                .build();

        ChecklistItem saved = checklistItemRepository.save(item);
        return ResponseEntity.ok(mapToDto(saved));
    }

    @PutMapping("/{itemId}/toggle")
    public ResponseEntity<ChecklistItemDto> toggleItem(@PathVariable Long tripId, @PathVariable Long itemId) {
        ChecklistItem item = checklistItemRepository.findById(itemId).orElseThrow(() -> new RuntimeException("Item not found"));
        if (!item.getTrip().getId().equals(tripId)) throw new RuntimeException("Unauthorized");

        item.setPacked(!item.isPacked());
        ChecklistItem updated = checklistItemRepository.save(item);
        return ResponseEntity.ok(mapToDto(updated));
    }

    @DeleteMapping("/{itemId}")
    public ResponseEntity<Void> deleteItem(@PathVariable Long tripId, @PathVariable Long itemId) {
        ChecklistItem item = checklistItemRepository.findById(itemId).orElseThrow(() -> new RuntimeException("Item not found"));
        if (!item.getTrip().getId().equals(tripId)) throw new RuntimeException("Unauthorized");

        checklistItemRepository.delete(item);
        return ResponseEntity.ok().build();
    }

    private ChecklistItemDto mapToDto(ChecklistItem item) {
        return ChecklistItemDto.builder()
                .id(item.getId())
                .text(item.getText())
                .packed(item.isPacked())
                .addedBy(item.getAddedBy().getFullName())
                .build();
    }
}
