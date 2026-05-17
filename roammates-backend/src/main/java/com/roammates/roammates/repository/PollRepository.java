package com.roammates.roammates.repository;

import com.roammates.roammates.entity.Poll;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PollRepository extends JpaRepository<Poll, Long> {
    List<Poll> findByTripIdOrderByIdDesc(Long tripId);
}
