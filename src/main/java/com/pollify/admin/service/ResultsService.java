package com.pollify.admin.service;

import com.pollify.admin.dto.election.CandidateResponse;
import com.pollify.admin.dto.results.LiveResultsResponse;
import com.pollify.admin.entity.tenant.Candidate;
import com.pollify.admin.entity.tenant.Election;
import com.pollify.admin.multitenancy.TenantContext;
import com.pollify.admin.repository.tenant.CandidateRepository;
import com.pollify.admin.repository.tenant.ElectionRepository;
import com.pollify.admin.repository.tenant.VoteRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.time.OffsetDateTime;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

/**
 * Epic 7: Results Service
 * Handles live and final election results
 */
@Service
@Slf4j
public class ResultsService {

    private final ElectionRepository electionRepository;
    private final CandidateRepository candidateRepository;
    private final VoteRepository voteRepository;

    public ResultsService(
            ElectionRepository electionRepository,
            CandidateRepository candidateRepository,
            VoteRepository voteRepository) {
        this.electionRepository = electionRepository;
        this.candidateRepository = candidateRepository;
        this.voteRepository = voteRepository;
    }

    /**
     * Epic 7 - Story 7.1: Get live results for an election
     */
    public LiveResultsResponse getLiveResults(UUID electionId) {
        String tenantId = TenantContext.getTenantId();
        if (tenantId == null) {
            throw new IllegalStateException("Tenant context not set");
        }

        Election election = electionRepository.findById(electionId)
                .orElseThrow(() -> new IllegalArgumentException("Election not found"));

        // Get total votes
        long totalVotes = voteRepository.countByElectionId(electionId);

        // Get candidates ordered by vote count (descending)
        List<Candidate> candidates = candidateRepository.findByElectionIdOrderByVoteCountDesc(electionId);

        List<CandidateResponse> candidateResponses = candidates.stream()
                .map(candidate -> mapCandidateToResponse(candidate, totalVotes))
                .collect(Collectors.toList());

        log.debug("Live results fetched for election: {} - Total votes: {}", electionId, totalVotes);

        return new LiveResultsResponse(
                election.getId().toString(),
                election.getTitle(),
                election.getElectionStatus().name(),
                totalVotes,
                candidateResponses,
                OffsetDateTime.now()
        );
    }

    /**
     * Epic 7 - Story 7.2: Get final results after election closes
     */
    public LiveResultsResponse getFinalResults(UUID electionId) {
        Election election = electionRepository.findById(electionId)
                .orElseThrow(() -> new IllegalArgumentException("Election not found"));

        // Only show final results for CLOSED elections
        if (election.getElectionStatus() != Election.ElectionStatus.CLOSED) {
            throw new IllegalArgumentException("Final results are only available for closed elections");
        }

        return getLiveResults(electionId);
    }

    /**
     * Get election winner(s)
     */
    public List<CandidateResponse> getWinners(UUID electionId) {
        List<Candidate> candidates = candidateRepository.findByElectionIdOrderByVoteCountDesc(electionId);

        if (candidates.isEmpty()) {
            return List.of();
        }

        // Get highest vote count
        long maxVotes = candidates.get(0).getVoteCount();
        long totalVotes = voteRepository.countByElectionId(electionId);

        // Return all candidates with the highest vote count (handles ties)
        return candidates.stream()
                .filter(c -> c.getVoteCount().equals(maxVotes))
                .map(c -> mapCandidateToResponse(c, totalVotes))
                .collect(Collectors.toList());
    }

    /**
     * Map candidate to response with percentage
     */
    private CandidateResponse mapCandidateToResponse(Candidate candidate, long totalVotes) {
        double percentage = 0.0;
        if (totalVotes > 0 && candidate.getVoteCount() > 0) {
            percentage = Math.round((candidate.getVoteCount() * 100.0 / totalVotes) * 100.0) / 100.0;
        }

        return new CandidateResponse(
                candidate.getId().toString(),
                candidate.getElectionId().toString(),
                candidate.getFullName(),
                candidate.getPosition(),
                candidate.getBio(),
                candidate.getImageUrl(),
                candidate.getVoteCount(),
                percentage
        );
    }
}
