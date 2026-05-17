package com.roammates.roammates.controller;

import com.roammates.roammates.controller.dto.ExpenseDto;
import com.roammates.roammates.entity.Expense;
import com.roammates.roammates.entity.Trip;
import com.roammates.roammates.entity.User;
import com.roammates.roammates.repository.ExpenseRepository;
import com.roammates.roammates.repository.TripRepository;
import com.roammates.roammates.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/v1/trips/{tripId}/expenses")
@RequiredArgsConstructor
public class ExpenseController {

    private final ExpenseRepository expenseRepository;
    private final TripRepository tripRepository;
    private final UserRepository userRepository;

    @GetMapping
    public ResponseEntity<List<ExpenseDto>> getExpenses(@PathVariable Long tripId) {
        List<ExpenseDto> list = expenseRepository.findByTripIdOrderByCreatedAtDesc(tripId).stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
        return ResponseEntity.ok(list);
    }

    @PostMapping
    public ResponseEntity<ExpenseDto> addExpense(@PathVariable Long tripId, @RequestBody ExpenseDto request) {
        Trip trip = tripRepository.findById(tripId).orElseThrow(() -> new RuntimeException("Trip not found"));
        
        User paidBy = userRepository.findAll().stream()
                .filter(u -> u.getFullName().equals(request.getPaidBy()))
                .findFirst()
                .orElseThrow(() -> new RuntimeException("User not found"));

        Expense expense = Expense.builder()
                .trip(trip)
                .description(request.getDescription())
                .amount(request.getAmount())
                .paidBy(paidBy)
                .category(request.getCategory())
                .build();

        Expense saved = expenseRepository.save(expense);
        return ResponseEntity.ok(mapToDto(saved));
    }

    private ExpenseDto mapToDto(Expense exp) {
        return ExpenseDto.builder()
                .id(exp.getId())
                .description(exp.getDescription())
                .amount(exp.getAmount())
                .paidBy(exp.getPaidBy().getFullName())
                .category(exp.getCategory())
                .date(exp.getDate())
                .build();
    }
}
