package com.pollify.pollify.dto.election;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.UUID;

/**
 * Epic 5 - Story 5.2: Add candidate to election
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class AddCandidateRequest {
    
    @NotNull(message = "Election ID is required")
    private UUID electionId;
    
    @NotBlank(message = "Candidate full name is required")
    private String fullName;
    
    @NotBlank(message = "Position is required")
    private String position;
    
    private String bio;
    
    private String imageUrl;  // URL after image upload
}
