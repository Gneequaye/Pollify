package com.pollify.pollify.service;

import com.pollify.pollify.entity.master.PollifyTenant;
import com.pollify.pollify.multitenancy.TenantIdentifierResolver;
import com.pollify.pollify.repository.master.PollifyTenantRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.core.annotation.Order;
import org.springframework.core.Ordered;
import org.springframework.stereotype.Component;

import java.util.List;

/**
 * Auto-syncs migrations across all tenant schemas on application startup.
 * Ensures all universities have the latest database schema changes.
 */
@Component
@Order(Ordered.LOWEST_PRECEDENCE)
@Slf4j
public class TenantMigrationBootstrap implements ApplicationRunner {

    @Value("${pollify.tenant.auto-sync-migrations:true}")
    private boolean autoSyncMigrations;

    private final PollifyTenantRepository tenantRepository;
    private final TenantSchemaService tenantSchemaService;

    public TenantMigrationBootstrap(
            PollifyTenantRepository tenantRepository,
            TenantSchemaService tenantSchemaService) {
        this.tenantRepository = tenantRepository;
        this.tenantSchemaService = tenantSchemaService;
    }

    @Override
    public void run(ApplicationArguments args) {
        if (!autoSyncMigrations) {
            log.info("Auto-sync migrations disabled");
            return;
        }

        log.info("Starting tenant migration sync...");
        
        // Set master context to query tenant registry
        TenantIdentifierResolver.setCurrentTenant("master");
        
        try {
            List<PollifyTenant> tenants = tenantRepository.findAll();
            log.info("Found {} tenant(s) to sync migrations", tenants.size());
            
            for (PollifyTenant tenant : tenants) {
                try {
                    log.info("Syncing migrations for tenant: {} ({})", 
                        tenant.getTenantId(), tenant.getUniversityName());
                    tenantSchemaService.applyPendingMigrations(tenant.getDatabaseSchema());
                } catch (Exception e) {
                    log.error("Migration sync failed for tenant: {}", tenant.getTenantId(), e);
                    // Continue with other tenants even if one fails
                }
            }
            
            log.info("Tenant migration sync completed");
            
        } finally {
            TenantIdentifierResolver.clear();
        }
    }
}
