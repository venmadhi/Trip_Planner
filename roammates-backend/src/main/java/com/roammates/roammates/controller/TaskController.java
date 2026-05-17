package com.roammates.roammates.controller;

import com.roammates.roammates.controller.dto.TaskItemDto;
import com.roammates.roammates.entity.TaskItem;
import com.roammates.roammates.entity.Trip;
import com.roammates.roammates.entity.User;
import com.roammates.roammates.repository.TaskItemRepository;
import com.roammates.roammates.repository.TripRepository;
import com.roammates.roammates.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/v1/trips/{tripId}/tasks")
@RequiredArgsConstructor
public class TaskController {

    private final TaskItemRepository taskItemRepository;
    private final TripRepository tripRepository;
    private final UserRepository userRepository;

    @GetMapping
    public ResponseEntity<List<TaskItemDto>> getTasks(@PathVariable Long tripId) {
        List<TaskItemDto> tasks = taskItemRepository.findByTripId(tripId).stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
        return ResponseEntity.ok(tasks);
    }

    @PostMapping
    public ResponseEntity<TaskItemDto> addTask(@PathVariable Long tripId, @RequestBody TaskItemDto request) {
        Trip trip = tripRepository.findById(tripId).orElseThrow(() -> new RuntimeException("Trip not found"));
        
        // Find user by full name (simplification for the mock UI select dropdown)
        User assignee = userRepository.findAll().stream()
                .filter(u -> u.getFullName().equals(request.getAssignee()))
                .findFirst()
                .orElseThrow(() -> new RuntimeException("Assignee not found"));

        TaskItem task = TaskItem.builder()
                .trip(trip)
                .title(request.getTitle())
                .assignee(assignee)
                .deadline(request.getDeadline())
                .status("Todo")
                .build();

        TaskItem saved = taskItemRepository.save(task);
        return ResponseEntity.ok(mapToDto(saved));
    }

    @PutMapping("/{taskId}/toggle")
    public ResponseEntity<TaskItemDto> toggleTaskStatus(@PathVariable Long tripId, @PathVariable Long taskId) {
        TaskItem task = taskItemRepository.findById(taskId).orElseThrow(() -> new RuntimeException("Task not found"));
        if (!task.getTrip().getId().equals(tripId)) throw new RuntimeException("Unauthorized");

        String currentStatus = task.getStatus();
        String nextStatus = currentStatus.equals("Todo") ? "In Progress" : (currentStatus.equals("In Progress") ? "Done" : "Todo");
        
        task.setStatus(nextStatus);
        TaskItem updated = taskItemRepository.save(task);
        return ResponseEntity.ok(mapToDto(updated));
    }

    private TaskItemDto mapToDto(TaskItem task) {
        return TaskItemDto.builder()
                .id(task.getId())
                .title(task.getTitle())
                .assignee(task.getAssignee().getFullName())
                .deadline(task.getDeadline())
                .status(task.getStatus())
                .build();
    }
}
