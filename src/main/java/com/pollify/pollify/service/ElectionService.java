package com.pollify.pollify.service;

import com.pollify.pollify.dto.election.CreateElectionRequest;
import com.pollify.pollify.dto.election.ElectionResponse;
import com.pollify.pollify.entity.tenant.Election;
import com.pollify.pollify.multitenancy.TenantContext;
import com.pollify.pollify.repository.tenant.CandidateRepository;
import com.pollify.pollify.repository.tenant.ElectionRepository;
import com.pollify.pollify.repository.tenant.VoteRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.OffsetDateTime;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

/**
 * Epic 5: Election Management Service
 */
@Service
@Slf4j
public class ElectionService {

    private final ElectionRepository electionRepository;
    private final CandidateRepository candidateRepository;
    private final VoteRepository voteRepository;

    public ElectionService(
            ElectionRepository electionRepository,
            CandidateRepository candidateRepository,
            VoteRepository voteRepository) {
        this.electionRepository = electionRepository;
        this.candidateRepository = candidateRepository;
        this.voteRepository = voteRepository;
    }

    /**
     * Epic 5 - Story 5.1: Create election
     */
    @Transactional
    public ElectionResponse createElection(CreateElectionRequest request, String adminId) {
        String tenantId = TenantContext.getTenantId();
        if (tenantId == null) {
            throw new IllegalStateException("Tenant context not set");
        }

        // Validate times
        if (request.getEndTime().isBefore(request.getStartTime())) {
            throw new IllegalArgumentException("End time must be after start time");
        }

        Election election = new Election();
        election.setTitle(request.getTitle());
        election.setDescription(request.getDescription());
        election.setStartTime(request.getStartTime());
        election.setEndTime(request.getEndTime());
        election.setElectionStatus(Election.ElectionStatus.DRAFT);
        election.setCreatedBy(UUID.fromString(adminId));

        election = electionRepository.save(election);

        log.info("Election created: {} in tenant: {}", election.getId(), tenantId);

        return mapToResponse(election);
    }

    /**
     * Epic 5 - Story 5.3: Activate election
     */
    @Transactional
    public ElectionResponse activateElection(UUID electionId) {
        Election election = electionRepository.findById(electionId)
                .orElseThrow(() -> new IllegalArgumentException("Election not found"));

        // Must have at least one candidate
        long candidateCount = candidateRepository.countByElectionId(electionId);
        if (candidateCount == 0) {
            throw new IllegalArgumentException("Cannot activate election without candidates");
        }

        // Must be in DRAFT status
        if (election.getElectionStatus() != Election.ElectionStatus.DRAFT) {
            throw new IllegalArgumentException("Only DRAFT elections can be activated");
        }

        election.setElectionStatus(Election.ElectionStatus.ACTIVE);
        election = electionRepository.save(election);

        log.info("Election activated: {}", electionId);

        return mapToResponse(election);
    }

    /**
     * Get all elections for current tenant
     */
    public List<ElectionResponse> getAllElections() {
        return electionRepository.findAll().stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    /**
     * Get active elections
     */
    public List<ElectionResponse> getActiveElections() {
        return electionRepository.findByElectionStatusOrderByStartTimeDesc(Election.ElectionStatus.ACTIVE)
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    /**
     * Get election by ID
     */
    public ElectionResponse getElectionById(UUID electionId) {
        Election election = electionRepository.findById(electionId)
                .orElseThrow(() -> new IllegalArgumentException("Election not found"));
        return mapToResponse(election);
    }

    /**
     * Update election (only DRAFT elections can be updated)
     */
    @Transactional
    public ElectionResponse updateElection(UUID electionId, CreateElectionRequest request) {
        Election election = electionRepository.findById(electionId)
                .orElseThrow(() -> new IllegalArgumentException("Election not found"));

        if (election.getElectionStatus() != Election.ElectionStatus.DRAFT) {
            throw new IllegalArgumentException("Only DRAFT elections can be updated");
        }

        election.setTitle(request.getTitle());
        election.setDescription(request.getDescription());
        election.setStartTime(request.getStartTime());
        election.setEndTime(request.getEndTime());

        election = electionRepository.save(election);

        log.info("Election updated: {}", electionId);

        return mapToResponse(election);
    }

    /**
     * Auto-close elections that have passed end time
     */
    @Transactional
    public void autoCloseExpiredElections() {
        List<Election> activeElections = electionRepository.findByElectionStatus(Election.ElectionStatus.ACTIVE);
        OffsetDateTime now = OffsetDateTime.now();

        for (Election election : activeElections) {
            if (election.getEndTime().isBefore(now)) {
                election.setElectionStatus(Election.ElectionStatus.CLOSED);
                election.setClosedAt(now);
                electionRepository.save(election);
                log.info("Auto-closed election: {}", election.getId());
            }
        }
    }

    /**
     * Map entity to response
     */
    private ElectionResponse mapToResponse(Election election) {
        long totalVotes = voteRepository.countByElectionId(election.getId());
        int candidateCount = (int) candidateRepository.countByElectionId(election.getId());

        return new ElectionResponse(
                election.getId().toString(),
                election.getTitle(),
                election.getDescription(),
                election.getElectionStatus().name(),
                election.getStartTime(),
                election.getEndTime(),
                totalVotes,
                candidateCount,
                election.getCreatedAt()
        );
    }
}
