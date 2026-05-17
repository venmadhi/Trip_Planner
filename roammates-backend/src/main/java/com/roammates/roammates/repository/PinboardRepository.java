package com.roammates.roammates.repository;

import com.roammates.roammates.entity.PinboardAnnouncement;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PinboardRepository extends JpaRepository<PinboardAnnouncement, Long> {
    List<PinboardAnnouncement> findByTripIdOrderByCreatedAtDesc(Long tripId);
}
