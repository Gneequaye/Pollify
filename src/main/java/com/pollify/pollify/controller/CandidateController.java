package com.pollify.pollify.controller;

import com.pollify.pollify.dto.election.AddCandidateRequest;
import com.pollify.pollify.dto.election.CandidateResponse;
import com.pollify.pollify.service.CandidateService;
import jakarta.validation.Valid;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

/**
 * Epic 5: Candidate Management Controller
 * Tenant admin endpoints for managing candidates
 */
@RestController
@RequestMapping("/api/admin/candidates")
@Slf4j
public class CandidateController {

    private final CandidateService candidateService;

    public CandidateController(CandidateService candidateService) {
        this.candidateService = candidateService;
    }

    /**
     * Epic 5 - Story 5.2: Add candidate to election
     * POST /api/admin/candidates
     */
    @PostMapping
    public ResponseEntity<CandidateResponse> addCandidate(
            @Valid @RequestBody AddCandidateRequest request) {
        log.info("Adding candidate: {} to election: {}", request.getFullName(), request.getElectionId());
        CandidateResponse response = candidateService.addCandidate(request);
        return ResponseEntity.ok(response);
    }

    /**
     * Get all candidates for an election
     * GET /api/admin/candidates/election/{electionId}
     */
    @GetMapping("/election/{electionId}")
    public ResponseEntity<List<CandidateResponse>> getCandidatesByElection(@PathVariable UUID electionId) {
        log.debug("Fetching candidates for election: {}", electionId);
        List<CandidateResponse> candidates = candidateService.getCandidatesByElection(electionId);
        return ResponseEntity.ok(candidates);
    }

    /**
     * Get candidate by ID
     * GET /api/admin/candidates/{id}
     */
    @GetMapping("/{id}")
    public ResponseEntity<CandidateResponse> getCandidateById(@PathVariable UUID id) {
        log.debug("Fetching candidate: {}", id);
        CandidateResponse response = candidateService.getCandidateById(id);
        return ResponseEntity.ok(response);
    }

    /**
     * Update candidate (only for DRAFT elections)
     * PUT /api/admin/candidates/{id}
     */
    @PutMapping("/{id}")
    public ResponseEntity<CandidateResponse> updateCandidate(
            @PathVariable UUID id,
            @Valid @RequestBody AddCandidateRequest request) {
        log.info("Updating candidate: {}", id);
        CandidateResponse response = candidateService.updateCandidate(id, request);
        return ResponseEntity.ok(response);
    }

    /**
     * Remove candidate (only from DRAFT elections)
     * DELETE /api/admin/candidates/{id}
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> removeCandidate(@PathVariable UUID id) {
        log.info("Removing candidate: {}", id);
        candidateService.removeCandidate(id);
        return ResponseEntity.noContent().build();
    }
}
