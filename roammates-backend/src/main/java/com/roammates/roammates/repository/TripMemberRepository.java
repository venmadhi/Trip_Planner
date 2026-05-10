package com.roammates.roammates.repository;

import com.roammates.roammates.entity.TripMember;
import com.roammates.roammates.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface TripMemberRepository extends JpaRepository<TripMember, Long> {
    List<TripMember> findByUser(User user);
    Optional<TripMember> findByTripIdAndUserId(Long tripId, Long userId);
}
