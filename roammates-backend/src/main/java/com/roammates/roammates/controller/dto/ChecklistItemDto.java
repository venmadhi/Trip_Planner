package com.roammates.roammates.controller.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class ChecklistItemDto {
    private Long id;
    private String text;
    private boolean packed;
    private String addedBy; // Full name of the user who added it
}
