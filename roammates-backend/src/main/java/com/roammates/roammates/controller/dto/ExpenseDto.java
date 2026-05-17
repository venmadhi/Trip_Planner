package com.roammates.roammates.controller.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class ExpenseDto {
    private Long id;
    private String description;
    private Double amount;
    private String paidBy; // user full name
    private String category;
    private LocalDate date;
}
