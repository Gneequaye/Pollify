package com.pollify.pollify.repository.master;

import com.pollify.pollify.entity.master.TenantInvitation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

/**
 * Repository for tenant invitations in master schema
 */
@Repository
public interface TenantInvitationRepository extends JpaRepository<TenantInvitation, UUID> {
    
    Optional<TenantInvitation> findByInvitationToken(String invitationToken);
    
    Optional<TenantInvitation> findByUniversityEmail(String universityEmail);
    
    boolean existsByUniversityEmail(String universityEmail);
    
    boolean existsByEmailDomain(String emailDomain);
    
    boolean existsBySchoolCode(String schoolCode);
}
