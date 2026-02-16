package com.pollify.pollify.controller;

import com.pollify.pollify.dto.election.CandidateResponse;
import com.pollify.pollify.dto.results.LiveResultsResponse;
import com.pollify.pollify.service.ResultsService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

/**
 * Epic 7: Results Controller
 * Endpoints for viewing election results (live and final)
 */
@RestController
@RequestMapping("/api/results")
@Slf4j
public class ResultsController {

    private final ResultsService resultsService;

    public ResultsController(ResultsService resultsService) {
        this.resultsService = resultsService;
    }

    /**
     * Epic 7 - Story 7.1: Get live results for an election
     * GET /api/results/elections/{electionId}/live
     * Accessible by admins during active elections
     */
    @GetMapping("/elections/{electionId}/live")
    public ResponseEntity<LiveResultsResponse> getLiveResults(@PathVariable UUID electionId) {
        log.debug("Fetching live results for election: {}", electionId);
        LiveResultsResponse response = resultsService.getLiveResults(electionId);
        return ResponseEntity.ok(response);
    }

    /**
     * Epic 7 - Story 7.2: Get final results after election closes
     * GET /api/results/elections/{electionId}/final
     * Accessible by admins and voters after election closes
     */
    @GetMapping("/elections/{electionId}/final")
    public ResponseEntity<LiveResultsResponse> getFinalResults(@PathVariable UUID electionId) {
        log.debug("Fetching final results for election: {}", electionId);
        LiveResultsResponse response = resultsService.getFinalResults(electionId);
        return ResponseEntity.ok(response);
    }

    /**
     * Get election winners
     * GET /api/results/elections/{electionId}/winners
     */
    @GetMapping("/elections/{electionId}/winners")
    public ResponseEntity<List<CandidateResponse>> getWinners(@PathVariable UUID electionId) {
        log.debug("Fetching winners for election: {}", electionId);
        List<CandidateResponse> winners = resultsService.getWinners(electionId);
        return ResponseEntity.ok(winners);
    }
}
