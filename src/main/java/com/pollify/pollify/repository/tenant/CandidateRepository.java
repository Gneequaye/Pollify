package com.pollify.pollify.repository.tenant;

import com.pollify.pollify.entity.tenant.Candidate;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

/**
 * Repository for candidates in tenant schema
 */
@Repository
public interface CandidateRepository extends JpaRepository<Candidate, UUID> {
    
    List<Candidate> findByElectionId(UUID electionId);
    
    List<Candidate> findByElectionIdOrderByVoteCountDesc(UUID electionId);
    
    long countByElectionId(UUID electionId);
}
