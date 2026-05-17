package com.roammates.roammates.controller.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class PollOptionDto {
    private String id; // Use string so it maps well to frontend
    private String text;
    private int votes;
}
