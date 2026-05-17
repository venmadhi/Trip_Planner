package com.roammates.roammates.controller;

import com.roammates.roammates.controller.dto.PinboardAnnouncementDto;
import com.roammates.roammates.entity.PinboardAnnouncement;
import com.roammates.roammates.entity.Trip;
import com.roammates.roammates.entity.User;
import com.roammates.roammates.repository.PinboardRepository;
import com.roammates.roammates.repository.TripRepository;
import com.roammates.roammates.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/v1/trips/{tripId}/pinboard")
@RequiredArgsConstructor
public class PinboardController {

    private final PinboardRepository pinboardRepository;
    private final TripRepository tripRepository;
    private final UserRepository userRepository;

    @GetMapping
    public ResponseEntity<List<PinboardAnnouncementDto>> getAnnouncements(@PathVariable Long tripId) {
        List<PinboardAnnouncementDto> list = pinboardRepository.findByTripIdOrderByCreatedAtDesc(tripId).stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
        return ResponseEntity.ok(list);
    }

    @PostMapping
    public ResponseEntity<PinboardAnnouncementDto> postAnnouncement(@PathVariable Long tripId, @RequestBody Map<String, String> request, Authentication authentication) {
        Trip trip = tripRepository.findById(tripId).orElseThrow(() -> new RuntimeException("Trip not found"));
        User user = userRepository.findByEmail(authentication.getName()).orElseThrow(() -> new RuntimeException("User not found"));

        PinboardAnnouncement post = PinboardAnnouncement.builder()
                .trip(trip)
                .author(user)
                .message(request.get("message"))
                .thumbsUp(0)
                .heart(0)
                .laugh(0)
                .build();

        PinboardAnnouncement saved = pinboardRepository.save(post);
        return ResponseEntity.ok(mapToDto(saved));
    }

    @PutMapping("/{postId}/react")
    public ResponseEntity<PinboardAnnouncementDto> react(@PathVariable Long tripId, @PathVariable Long postId, @RequestBody Map<String, String> request) {
        PinboardAnnouncement post = pinboardRepository.findById(postId).orElseThrow(() -> new RuntimeException("Post not found"));
        if (!post.getTrip().getId().equals(tripId)) throw new RuntimeException("Unauthorized");

        String emoji = request.get("emoji");
        if ("👍".equals(emoji)) post.setThumbsUp(post.getThumbsUp() + 1);
        if ("❤️".equals(emoji)) post.setHeart(post.getHeart() + 1);
        if ("😂".equals(emoji)) post.setLaugh(post.getLaugh() + 1);

        PinboardAnnouncement saved = pinboardRepository.save(post);
        return ResponseEntity.ok(mapToDto(saved));
    }

    private PinboardAnnouncementDto mapToDto(PinboardAnnouncement post) {
        Map<String, Integer> reactions = new HashMap<>();
        reactions.put("👍", post.getThumbsUp());
        reactions.put("❤️", post.getHeart());
        reactions.put("😂", post.getLaugh());

        return PinboardAnnouncementDto.builder()
                .id(post.getId())
                .author(post.getAuthor().getFullName())
                .message(post.getMessage())
                .timeAgo(post.getCreatedAt().toString())
                .reactions(reactions)
                .build();
    }
}
