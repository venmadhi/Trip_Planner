package com.roammates.roammates.repository;

import com.roammates.roammates.entity.Expense;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ExpenseRepository extends JpaRepository<Expense, Long> {
    List<Expense> findByTripIdOrderByCreatedAtDesc(Long tripId);
}
