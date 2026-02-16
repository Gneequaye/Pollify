package com.pollify.admin.repository.tenant;

import com.pollify.admin.entity.tenant.RegistrationToken;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

/**
 * Repository for registration tokens in tenant schema (code schools)
 */
@Repository
public interface RegistrationTokenRepository extends JpaRepository<RegistrationToken, UUID> {
    
    Optional<RegistrationToken> findByToken(String token);
    
    long countByTokenStatus(RegistrationToken.TokenStatus status);
}
