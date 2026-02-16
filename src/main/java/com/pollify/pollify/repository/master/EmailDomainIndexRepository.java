package com.pollify.pollify.repository.master;

import com.pollify.pollify.entity.master.EmailDomainIndex;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

/**
 * Repository for email domain index in master schema
 */
@Repository
public interface EmailDomainIndexRepository extends JpaRepository<EmailDomainIndex, UUID> {
    
    Optional<EmailDomainIndex> findByEmailDomain(String emailDomain);
    
    boolean existsByEmailDomain(String emailDomain);
}
