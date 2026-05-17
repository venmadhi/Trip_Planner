package com.roammates.roammates.repository;

import com.roammates.roammates.entity.TaskItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TaskItemRepository extends JpaRepository<TaskItem, Long> {
    List<TaskItem> findByTripId(Long tripId);
}
