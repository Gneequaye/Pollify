package com.pollify.admin.dto.results;

import com.pollify.admin.dto.election.CandidateResponse;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.OffsetDateTime;
import java.util.List;

/**
 * Epic 7: Live results response for WebSocket broadcasts
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class LiveResultsResponse {
    private String electionId;
    private String electionTitle;
    private String status;
    private Long totalVotes;
    private List<CandidateResponse> candidates;
    private OffsetDateTime updatedAt;
}
