package com.pollify.admin.repository.master;

import com.pollify.admin.entity.master.PollifyTenant;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

/**
 * Repository for tenant registry in master schema
 */
@Repository
public interface PollifyTenantRepository extends JpaRepository<PollifyTenant, String> {
    
    Optional<PollifyTenant> findByAdminEmail(String adminEmail);
    
    Optional<PollifyTenant> findByDatabaseSchema(String databaseSchema);
    
    Optional<PollifyTenant> findByUniversityEmail(String universityEmail);
    
    Optional<PollifyTenant> findBySchoolCode(String schoolCode);
    
    boolean existsByAdminEmail(String adminEmail);
    
    boolean existsByDatabaseSchema(String databaseSchema);
    
    boolean existsByUniversityEmail(String universityEmail);
    
    boolean existsBySchoolCode(String schoolCode);
}
