package com.pollify.admin.service;

import com.pollify.admin.dto.election.AddCandidateRequest;
import com.pollify.admin.dto.election.CandidateResponse;
import com.pollify.admin.entity.tenant.Candidate;
import com.pollify.admin.entity.tenant.Election;
import com.pollify.admin.multitenancy.TenantContext;
import com.pollify.admin.repository.tenant.CandidateRepository;
import com.pollify.admin.repository.tenant.ElectionRepository;
import com.pollify.admin.repository.tenant.VoteRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

/**
 * Epic 5: Candidate Management Service
 */
@Service
@Slf4j
public class CandidateService {

    private final CandidateRepository candidateRepository;
    private final ElectionRepository electionRepository;
    private final VoteRepository voteRepository;

    public CandidateService(
            CandidateRepository candidateRepository,
            ElectionRepository electionRepository,
            VoteRepository voteRepository) {
        this.candidateRepository = candidateRepository;
        this.electionRepository = electionRepository;
        this.voteRepository = voteRepository;
    }

    /**
     * Epic 5 - Story 5.2: Add candidate to election
     */
    @Transactional
    public CandidateResponse addCandidate(AddCandidateRequest request) {
        String tenantId = TenantContext.getTenantId();
        if (tenantId == null) {
            throw new IllegalStateException("Tenant context not set");
        }

        // Verify election exists
        Election election = electionRepository.findById(request.getElectionId())
                .orElseThrow(() -> new IllegalArgumentException("Election not found"));

        // Can only add candidates to DRAFT elections
        if (election.getElectionStatus() != Election.ElectionStatus.DRAFT) {
            throw new IllegalArgumentException("Can only add candidates to DRAFT elections");
        }

        Candidate candidate = new Candidate();
        candidate.setElectionId(request.getElectionId());
        candidate.setFullName(request.getFullName());
        candidate.setPosition(request.getPosition());
        candidate.setBio(request.getBio());
        candidate.setImageUrl(request.getImageUrl());
        candidate.setVoteCount(0L);

        candidate = candidateRepository.save(candidate);

        log.info("Candidate added: {} to election: {} in tenant: {}", 
                candidate.getId(), request.getElectionId(), tenantId);

        return mapToResponse(candidate, 0L);
    }

    /**
     * Get all candidates for an election
     */
    public List<CandidateResponse> getCandidatesByElection(UUID electionId) {
        long totalVotes = voteRepository.countByElectionId(electionId);
        
        return candidateRepository.findByElectionIdOrderByVoteCountDesc(electionId)
                .stream()
                .map(candidate -> mapToResponse(candidate, totalVotes))
                .collect(Collectors.toList());
    }

    /**
     * Get candidate by ID
     */
    public CandidateResponse getCandidateById(UUID candidateId) {
        Candidate candidate = candidateRepository.findById(candidateId)
                .orElseThrow(() -> new IllegalArgumentException("Candidate not found"));
        
        long totalVotes = voteRepository.countByElectionId(candidate.getElectionId());
        return mapToResponse(candidate, totalVotes);
    }

    /**
     * Remove candidate from election (only from DRAFT elections)
     */
    @Transactional
    public void removeCandidate(UUID candidateId) {
        Candidate candidate = candidateRepository.findById(candidateId)
                .orElseThrow(() -> new IllegalArgumentException("Candidate not found"));

        Election election = electionRepository.findById(candidate.getElectionId())
                .orElseThrow(() -> new IllegalArgumentException("Election not found"));

        // Can only remove from DRAFT elections
        if (election.getElectionStatus() != Election.ElectionStatus.DRAFT) {
            throw new IllegalArgumentException("Cannot remove candidates from ACTIVE elections");
        }

        candidateRepository.delete(candidate);
        
        log.info("Candidate removed: {} from election: {}", candidateId, candidate.getElectionId());
    }

    /**
     * Update candidate details (only for DRAFT elections)
     */
    @Transactional
    public CandidateResponse updateCandidate(UUID candidateId, AddCandidateRequest request) {
        Candidate candidate = candidateRepository.findById(candidateId)
                .orElseThrow(() -> new IllegalArgumentException("Candidate not found"));

        Election election = electionRepository.findById(candidate.getElectionId())
                .orElseThrow(() -> new IllegalArgumentException("Election not found"));

        if (election.getElectionStatus() != Election.ElectionStatus.DRAFT) {
            throw new IllegalArgumentException("Cannot update candidates in ACTIVE elections");
        }

        candidate.setFullName(request.getFullName());
        candidate.setPosition(request.getPosition());
        candidate.setBio(request.getBio());
        candidate.setImageUrl(request.getImageUrl());

        candidate = candidateRepository.save(candidate);

        long totalVotes = voteRepository.countByElectionId(candidate.getElectionId());
        
        log.info("Candidate updated: {}", candidateId);

        return mapToResponse(candidate, totalVotes);
    }

    /**
     * Map entity to response with vote percentage
     */
    private CandidateResponse mapToResponse(Candidate candidate, long totalVotes) {
        double percentage = 0.0;
        if (totalVotes > 0 && candidate.getVoteCount() > 0) {
            percentage = (candidate.getVoteCount() * 100.0) / totalVotes;
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
