package com.pollify.pollify.repository.tenant;

import com.pollify.pollify.entity.tenant.Voter;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

/**
 * Repository for voters in tenant schema
 */
@Repository
public interface VoterRepository extends JpaRepository<Voter, UUID> {
    
    Optional<Voter> findByEmail(String email);
    
    Optional<Voter> findByStudentId(String studentId);
    
    boolean existsByEmail(String email);
    
    boolean existsByStudentId(String studentId);
    
    long countByIsVerified(Boolean isVerified);
}
