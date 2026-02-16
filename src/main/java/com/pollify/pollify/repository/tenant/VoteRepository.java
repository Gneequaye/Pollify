package com.pollify.pollify.repository.tenant;

import com.pollify.pollify.entity.tenant.Vote;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.UUID;

/**
 * Repository for votes in tenant schema
 */
@Repository
public interface VoteRepository extends JpaRepository<Vote, UUID> {
    
    boolean existsByVoterIdAndElectionId(UUID voterId, UUID electionId);
    
    long countByElectionId(UUID electionId);
    
    long countByCandidateId(UUID candidateId);
}
