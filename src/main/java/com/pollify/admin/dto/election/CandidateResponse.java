package com.pollify.admin.dto.election;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Candidate response DTO
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class CandidateResponse {
    private String id;
    private String electionId;
    private String fullName;
    private String position;
    private String bio;
    private String imageUrl;
    private Long voteCount;
    private Double votePercentage;
}
