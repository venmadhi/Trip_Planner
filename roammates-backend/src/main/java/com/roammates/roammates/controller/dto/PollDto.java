package com.roammates.roammates.controller.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.util.List;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class PollDto {
    private Long id;
    private String question;
    private String status;
    private int totalVotes;
    private String userVotedOptionId;
    private List<PollOptionDto> options;
}
