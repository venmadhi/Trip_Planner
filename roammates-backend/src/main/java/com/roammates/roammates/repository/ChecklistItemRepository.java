package com.roammates.roammates.repository;

import com.roammates.roammates.entity.ChecklistItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ChecklistItemRepository extends JpaRepository<ChecklistItem, Long> {
    List<ChecklistItem> findByTripId(Long tripId);
}
