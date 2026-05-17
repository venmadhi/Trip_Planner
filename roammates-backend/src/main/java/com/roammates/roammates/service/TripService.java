package com.roammates.roammates.service;

import com.roammates.roammates.controller.dto.CreateTripRequest;
import com.roammates.roammates.controller.dto.TripDto;
import com.roammates.roammates.controller.dto.TripMemberDto;
import com.roammates.roammates.entity.Trip;
import com.roammates.roammates.entity.TripMember;
import com.roammates.roammates.entity.TripRole;
import com.roammates.roammates.entity.TripStatus;
import com.roammates.roammates.entity.User;
import com.roammates.roammates.repository.TripMemberRepository;
import com.roammates.roammates.repository.TripRepository;
import com.roammates.roammates.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class TripService {
    private final TripRepository tripRepository;
    private final TripMemberRepository tripMemberRepository;
    private final UserRepository userRepository;

    @Transactional
    public TripDto createTrip(CreateTripRequest request, String userEmail) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new RuntimeException("User not found"));

        String bannerUrl = request.getBannerImage();
        if (bannerUrl == null || bannerUrl.trim().isEmpty()) {
            bannerUrl = "https://picsum.photos/seed/" + request.getDestination().trim().replaceAll("\\s+", "") + "/1200/400";
        }

        Trip trip = Trip.builder()
                .title(request.getTitle())
                .destination(request.getDestination())
                .startDate(request.getStartDate())
                .endDate(request.getEndDate())
                .description(request.getDescription())
                .bannerImage(bannerUrl)
                .status(TripStatus.PLANNING)
                .inviteCode(UUID.randomUUID().toString().substring(0, 8).toUpperCase())
                .build();

        Trip savedTrip = tripRepository.save(trip);

        TripMember member = TripMember.builder()
                .trip(savedTrip)
                .user(user)
                .role(TripRole.ADMIN)
                .build();

        tripMemberRepository.save(member);

        return mapToDto(savedTrip);
    }

    @Transactional
    public TripDto joinTrip(String inviteCode, String userEmail) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Trip trip = tripRepository.findByInviteCode(inviteCode)
                .orElseThrow(() -> new RuntimeException("Invalid invite code"));

        if (tripMemberRepository.findByTripIdAndUserId(trip.getId(), user.getId()).isPresent()) {
            throw new RuntimeException("User already in this trip");
        }

        TripMember member = TripMember.builder()
                .trip(trip)
                .user(user)
                .role(TripRole.MEMBER)
                .build();

        tripMemberRepository.save(member);

        return mapToDto(trip);
    }

    public List<TripDto> getUserTrips(String userEmail) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new RuntimeException("User not found"));

        List<TripMember> memberships = tripMemberRepository.findByUser(user);

        return memberships.stream()
                .map(m -> mapToDto(m.getTrip()))
                .collect(Collectors.toList());
    }

    private TripDto mapToDto(Trip trip) {
        return TripDto.builder()
                .id(trip.getId())
                .title(trip.getTitle())
                .destination(trip.getDestination())
                .startDate(trip.getStartDate())
                .endDate(trip.getEndDate())
                .description(trip.getDescription())
                .bannerImage(trip.getBannerImage())
                .inviteCode(trip.getInviteCode())
                .status(trip.getStatus().name())
                .members(trip.getMembers() != null ? trip.getMembers().stream().map(m -> 
                    TripMemberDto.builder()
                        .id(m.getUser().getId())
                        .fullName(m.getUser().getFullName())
                        .email(m.getUser().getEmail())
                        .role(m.getRole().name())
                        .build()
                ).collect(Collectors.toList()) : null)
                .build();
    }
}
