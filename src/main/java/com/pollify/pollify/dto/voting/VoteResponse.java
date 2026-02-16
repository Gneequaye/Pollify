package com.pollify.pollify.dto.voting;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Vote response DTO
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class VoteResponse {
    private boolean success;
    private String message;
    private String voteId;
}
