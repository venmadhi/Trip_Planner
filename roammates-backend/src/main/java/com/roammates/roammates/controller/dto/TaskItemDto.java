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
public class TaskItemDto {
    private Long id;
    private String title;
    private String assignee; // Full name of the assignee
    private LocalDate deadline;
    private String status;
}
