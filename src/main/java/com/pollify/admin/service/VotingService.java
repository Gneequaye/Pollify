package com.pollify.admin.service;

import com.pollify.admin.dto.voting.CastVoteRequest;
import com.pollify.admin.dto.voting.VoteResponse;
import com.pollify.admin.entity.tenant.Candidate;
import com.pollify.admin.entity.tenant.Election;
import com.pollify.admin.entity.tenant.Vote;
import com.pollify.admin.multitenancy.TenantContext;
import com.pollify.admin.repository.tenant.CandidateRepository;
import com.pollify.admin.repository.tenant.ElectionRepository;
import com.pollify.admin.repository.tenant.VoteRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.OffsetDateTime;
import java.util.UUID;

/**
 * Epic 6: Voting Service
 * Handles vote casting with duplicate prevention
 */
@Service
@Slf4j
public class VotingService {

    private final VoteRepository voteRepository;
    private final ElectionRepository electionRepository;
    private final CandidateRepository candidateRepository;
    private final WebSocketService webSocketService;

    public VotingService(
            VoteRepository voteRepository,
            ElectionRepository electionRepository,
            CandidateRepository candidateRepository,
            WebSocketService webSocketService) {
        this.voteRepository = voteRepository;
        this.electionRepository = electionRepository;
        this.candidateRepository = candidateRepository;
        this.webSocketService = webSocketService;
    }

    /**
     * Epic 6 - Story 6.3: Cast vote
     */
    @Transactional
    public VoteResponse castVote(CastVoteRequest request, UUID voterId) {
        String tenantId = TenantContext.getTenantId();
        if (tenantId == null) {
            throw new IllegalStateException("Tenant context not set");
        }

        // 1. Verify election exists and is ACTIVE
        Election election = electionRepository.findById(request.getElectionId())
                .orElseThrow(() -> new IllegalArgumentException("Election not found"));

        if (election.getElectionStatus() != Election.ElectionStatus.ACTIVE) {
            throw new IllegalArgumentException("This election is not active");
        }

        // 2. Verify election time window
        OffsetDateTime now = OffsetDateTime.now();
        if (now.isBefore(election.getStartTime())) {
            throw new IllegalArgumentException("Voting has not started yet");
        }
        if (now.isAfter(election.getEndTime())) {
            throw new IllegalArgumentException("Voting has ended");
        }

        // 3. Check if voter already voted (double-check before DB constraint)
        if (voteRepository.existsByVoterIdAndElectionId(voterId, request.getElectionId())) {
            throw new IllegalArgumentException("You have already voted in this election");
        }

        // 4. Verify candidate exists and belongs to this election
        Candidate candidate = candidateRepository.findById(request.getCandidateId())
                .orElseThrow(() -> new IllegalArgumentException("Candidate not found"));

        if (!candidate.getElectionId().equals(request.getElectionId())) {
            throw new IllegalArgumentException("Candidate does not belong to this election");
        }

        // 5. Create vote record
        Vote vote = new Vote();
        vote.setVoterId(voterId);
        vote.setElectionId(request.getElectionId());
        vote.setCandidateId(request.getCandidateId());

        try {
            // 6. Save vote (UNIQUE constraint prevents duplicates at DB level)
            vote = voteRepository.save(vote);

            // 7. Increment candidate vote count (real-time update)
            candidate.setVoteCount(candidate.getVoteCount() + 1);
            candidateRepository.save(candidate);

            log.info("Vote cast successfully - Voter: {}, Election: {}, Candidate: {} in tenant: {}", 
                    voterId, request.getElectionId(), request.getCandidateId(), tenantId);

            // Epic 7: Broadcast live results via WebSocket
            webSocketService.broadcastElectionResults(tenantId, request.getElectionId());

            return new VoteResponse(
                    true,
                    "Vote cast successfully!",
                    vote.getId().toString()
            );

        } catch (DataIntegrityViolationException e) {
            // Caught duplicate vote attempt at DB level
            log.warn("Duplicate vote attempt blocked - Voter: {}, Election: {}", voterId, request.getElectionId());
            throw new IllegalArgumentException("You have already voted in this election");
        }
    }

    /**
     * Check if voter has voted in an election
     */
    public boolean hasVoted(UUID voterId, UUID electionId) {
        return voteRepository.existsByVoterIdAndElectionId(voterId, electionId);
    }

    /**
     * Get vote statistics for an election
     */
    public long getElectionVoteCount(UUID electionId) {
        return voteRepository.countByElectionId(electionId);
    }

    /**
     * Get vote count for a specific candidate
     */
    public long getCandidateVoteCount(UUID candidateId) {
        return voteRepository.countByCandidateId(candidateId);
    }
}
