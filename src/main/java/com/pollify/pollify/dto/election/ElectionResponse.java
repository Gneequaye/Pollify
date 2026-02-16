package com.pollify.pollify.dto.election;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.OffsetDateTime;

/**
 * Election response DTO
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class ElectionResponse {
    private String id;
    private String title;
    private String description;
    private String status;
    private OffsetDateTime startTime;
    private OffsetDateTime endTime;
    private Long totalVotes;
    private Integer candidateCount;
    private OffsetDateTime createdAt;
}
