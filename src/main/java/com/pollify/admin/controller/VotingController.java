package com.pollify.admin.controller;

import com.pollify.admin.dto.election.ElectionResponse;
import com.pollify.admin.dto.voting.CastVoteRequest;
import com.pollify.admin.dto.voting.VoteResponse;
import com.pollify.admin.service.ElectionService;
import com.pollify.admin.service.VotingService;
import jakarta.validation.Valid;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

/**
 * Epic 6: Voting Controller
 * Voter endpoints for viewing elections and casting votes
 */
@RestController
@RequestMapping("/api/voter")
@Slf4j
public class VotingController {

    private final VotingService votingService;
    private final ElectionService electionService;

    public VotingController(
            VotingService votingService,
            ElectionService electionService) {
        this.votingService = votingService;
        this.electionService = electionService;
    }

    /**
     * Epic 6 - Story 6.2: View active elections
     * GET /api/voter/elections/active
     */
    @GetMapping("/elections/active")
    public ResponseEntity<List<ElectionResponse>> getActiveElections() {
        log.debug("Voter fetching active elections");
        List<ElectionResponse> elections = electionService.getActiveElections();
        return ResponseEntity.ok(elections);
    }

    /**
     * Get election details by ID
     * GET /api/voter/elections/{id}
     */
    @GetMapping("/elections/{id}")
    public ResponseEntity<ElectionResponse> getElectionById(@PathVariable UUID id) {
        log.debug("Voter fetching election: {}", id);
        ElectionResponse response = electionService.getElectionById(id);
        return ResponseEntity.ok(response);
    }

    /**
     * Epic 6 - Story 6.3: Cast vote
     * POST /api/voter/vote
     */
    @PostMapping("/vote")
    public ResponseEntity<VoteResponse> castVote(
            @Valid @RequestBody CastVoteRequest request,
            Authentication authentication) {
        UUID voterId = UUID.fromString(authentication.getName());
        log.info("Voter {} casting vote in election: {}", voterId, request.getElectionId());
        VoteResponse response = votingService.castVote(request, voterId);
        return ResponseEntity.ok(response);
    }

    /**
     * Check if voter has voted in an election
     * GET /api/voter/elections/{electionId}/has-voted
     */
    @GetMapping("/elections/{electionId}/has-voted")
    public ResponseEntity<Boolean> hasVoted(
            @PathVariable UUID electionId,
            Authentication authentication) {
        UUID voterId = UUID.fromString(authentication.getName());
        boolean hasVoted = votingService.hasVoted(voterId, electionId);
        return ResponseEntity.ok(hasVoted);
    }
}
