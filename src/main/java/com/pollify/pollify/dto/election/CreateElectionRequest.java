package com.pollify.pollify.dto.election;

import jakarta.validation.constraints.Future;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.OffsetDateTime;

/**
 * Epic 5 - Story 5.1: Create election request
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class CreateElectionRequest {
    
    @NotBlank(message = "Election title is required")
    private String title;
    
    private String description;
    
    @NotNull(message = "Start time is required")
    @Future(message = "Start time must be in the future")
    private OffsetDateTime startTime;
    
    @NotNull(message = "End time is required")
    private OffsetDateTime endTime;
}
