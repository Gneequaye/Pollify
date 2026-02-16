package com.pollify.admin.dto.voting;

import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.UUID;

/**
 * Epic 6 - Story 6.3: Cast vote request
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class CastVoteRequest {
    
    @NotNull(message = "Election ID is required")
    private UUID electionId;
    
    @NotNull(message = "Candidate ID is required")
    private UUID candidateId;
}
