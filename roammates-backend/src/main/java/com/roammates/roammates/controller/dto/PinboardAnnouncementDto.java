package com.roammates.roammates.controller.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Map;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class PinboardAnnouncementDto {
    private Long id;
    private String author;
    private String message;
    private String timeAgo;
    private Map<String, Integer> reactions;
}
