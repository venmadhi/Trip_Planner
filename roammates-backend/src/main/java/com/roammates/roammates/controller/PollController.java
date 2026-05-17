package com.roammates.roammates.controller;

import com.roammates.roammates.controller.dto.PollDto;
import com.roammates.roammates.controller.dto.PollOptionDto;
import com.roammates.roammates.entity.Poll;
import com.roammates.roammates.entity.PollOption;
import com.roammates.roammates.entity.Trip;
import com.roammates.roammates.entity.User;
import com.roammates.roammates.repository.PollOptionRepository;
import com.roammates.roammates.repository.PollRepository;
import com.roammates.roammates.repository.TripRepository;
import com.roammates.roammates.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/v1/trips/{tripId}/polls")
@RequiredArgsConstructor
public class PollController {

    private final PollRepository pollRepository;
    private final PollOptionRepository pollOptionRepository;
    private final TripRepository tripRepository;
    private final UserRepository userRepository;

    @GetMapping
    public ResponseEntity<List<PollDto>> getPolls(@PathVariable Long tripId, Authentication authentication) {
        String email = authentication.getName();
        List<PollDto> list = pollRepository.findByTripIdOrderByIdDesc(tripId).stream()
                .map(p -> mapToDto(p, email))
                .collect(Collectors.toList());
        return ResponseEntity.ok(list);
    }

    @PostMapping
    public ResponseEntity<PollDto> createPoll(@PathVariable Long tripId, @RequestBody PollDto request, Authentication authentication) {
        Trip trip = tripRepository.findById(tripId).orElseThrow(() -> new RuntimeException("Trip not found"));
        User user = userRepository.findByEmail(authentication.getName()).orElseThrow();

        Poll poll = Poll.builder()
                .trip(trip)
                .question(request.getQuestion())
                .status("Open")
                .createdBy(user)
                .build();
        
        List<PollOption> options = new ArrayList<>();
        for (PollOptionDto opt : request.getOptions()) {
            options.add(PollOption.builder().poll(poll).text(opt.getText()).voterEmails(new ArrayList<>()).build());
        }
        poll.setOptions(options);

        Poll saved = pollRepository.save(poll);
        return ResponseEntity.ok(mapToDto(saved, authentication.getName()));
    }

    @PutMapping("/{pollId}/vote/{optionId}")
    public ResponseEntity<PollDto> vote(@PathVariable Long tripId, @PathVariable Long pollId, @PathVariable Long optionId, Authentication authentication) {
        Poll poll = pollRepository.findById(pollId).orElseThrow(() -> new RuntimeException("Poll not found"));
        String email = authentication.getName();

        if (poll.getStatus().equals("Closed")) throw new RuntimeException("Poll is closed");

        // Remove old vote
        for (PollOption opt : poll.getOptions()) {
            opt.getVoterEmails().remove(email);
        }

        // Add new vote if they are clicking a new option
        for (PollOption opt : poll.getOptions()) {
            if (opt.getId().equals(optionId)) {
                // To toggle, check if they already voted for it
                if (!opt.getVoterEmails().contains(email)) {
                    opt.getVoterEmails().add(email);
                }
            }
        }

        Poll saved = pollRepository.save(poll);
        return ResponseEntity.ok(mapToDto(saved, email));
    }

    private PollDto mapToDto(Poll poll, String userEmail) {
        int totalVotes = 0;
        String userVotedOptionId = null;
        List<PollOptionDto> optionDtos = new ArrayList<>();

        for (PollOption opt : poll.getOptions()) {
            totalVotes += opt.getVoterEmails().size();
            if (opt.getVoterEmails().contains(userEmail)) {
                userVotedOptionId = opt.getId().toString();
            }
            optionDtos.add(PollOptionDto.builder()
                    .id(opt.getId().toString())
                    .text(opt.getText())
                    .votes(opt.getVoterEmails().size())
                    .build());
        }

        return PollDto.builder()
                .id(poll.getId())
                .question(poll.getQuestion())
                .status(poll.getStatus())
                .totalVotes(totalVotes)
                .userVotedOptionId(userVotedOptionId)
                .options(optionDtos)
                .build();
    }
}
