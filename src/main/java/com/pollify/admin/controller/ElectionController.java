package com.pollify.admin.controller;

import com.pollify.admin.dto.election.CreateElectionRequest;
import com.pollify.admin.dto.election.ElectionResponse;
import com.pollify.admin.service.ElectionService;
import jakarta.validation.Valid;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

/**
 * Epic 5: Election Management Controller
 * Tenant admin endpoints for managing elections
 */
@RestController
@RequestMapping("/api/admin/elections")
@Slf4j
public class ElectionController {

    private final ElectionService electionService;

    public ElectionController(ElectionService electionService) {
        this.electionService = electionService;
    }

    /**
     * Epic 5 - Story 5.1: Create election
     * POST /api/admin/elections
     */
    @PostMapping
    public ResponseEntity<ElectionResponse> createElection(
            @Valid @RequestBody CreateElectionRequest request,
            Authentication authentication) {
        String adminId = authentication.getName();
        log.info("Creating election: {} by admin: {}", request.getTitle(), adminId);
        ElectionResponse response = electionService.createElection(request, adminId);
        return ResponseEntity.ok(response);
    }

    /**
     * Get all elections for current tenant
     * GET /api/admin/elections
     */
    @GetMapping
    public ResponseEntity<List<ElectionResponse>> getAllElections() {
        log.debug("Fetching all elections");
        List<ElectionResponse> elections = electionService.getAllElections();
        return ResponseEntity.ok(elections);
    }

    /**
     * Get election by ID
     * GET /api/admin/elections/{id}
     */
    @GetMapping("/{id}")
    public ResponseEntity<ElectionResponse> getElectionById(@PathVariable UUID id) {
        log.debug("Fetching election: {}", id);
        ElectionResponse response = electionService.getElectionById(id);
        return ResponseEntity.ok(response);
    }

    /**
     * Update election (only DRAFT elections)
     * PUT /api/admin/elections/{id}
     */
    @PutMapping("/{id}")
    public ResponseEntity<ElectionResponse> updateElection(
            @PathVariable UUID id,
            @Valid @RequestBody CreateElectionRequest request) {
        log.info("Updating election: {}", id);
        ElectionResponse response = electionService.updateElection(id, request);
        return ResponseEntity.ok(response);
    }

    /**
     * Epic 5 - Story 5.3: Activate election
     * POST /api/admin/elections/{id}/activate
     */
    @PostMapping("/{id}/activate")
    public ResponseEntity<ElectionResponse> activateElection(@PathVariable UUID id) {
        log.info("Activating election: {}", id);
        ElectionResponse response = electionService.activateElection(id);
        return ResponseEntity.ok(response);
    }

    /**
     * Get active elections
     * GET /api/admin/elections/active
     */
    @GetMapping("/active")
    public ResponseEntity<List<ElectionResponse>> getActiveElections() {
        log.debug("Fetching active elections");
        List<ElectionResponse> elections = electionService.getActiveElections();
        return ResponseEntity.ok(elections);
    }
}
