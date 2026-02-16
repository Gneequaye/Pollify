package com.pollify.pollify.repository.tenant;

import com.pollify.pollify.entity.tenant.Election;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

/**
 * Repository for elections in tenant schema
 */
@Repository
public interface ElectionRepository extends JpaRepository<Election, UUID> {
    
    List<Election> findByElectionStatus(Election.ElectionStatus status);
    
    List<Election> findByCreatedBy(UUID createdBy);
    
    List<Election> findByElectionStatusOrderByStartTimeDesc(Election.ElectionStatus status);
}
