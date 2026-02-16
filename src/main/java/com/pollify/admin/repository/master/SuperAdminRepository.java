package com.pollify.admin.repository.master;

import com.pollify.admin.entity.master.SuperAdmin;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

/**
 * Repository for super admin in master schema
 */
@Repository
public interface SuperAdminRepository extends JpaRepository<SuperAdmin, UUID> {
    
    Optional<SuperAdmin> findByEmail(String email);
    
    boolean existsByEmail(String email);
}
