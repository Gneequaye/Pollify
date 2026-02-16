package com.pollify.pollify.multitenancy;

import org.hibernate.context.spi.CurrentTenantIdentifierResolver;
import org.springframework.stereotype.Component;

/**
 * Resolves the current tenant schema for Hibernate using ThreadLocal storage.
 * Default schema is 'master'. Thread-safe for concurrent requests across all universities.
 */
@Component
public class TenantIdentifierResolver implements CurrentTenantIdentifierResolver {
    
    private static final String DEFAULT_TENANT = "master";
    private static final ThreadLocal<String> currentTenant = new ThreadLocal<>();

    @Override
    public String resolveCurrentTenantIdentifier() {
        String tenant = currentTenant.get();
        return (tenant != null) ? tenant : DEFAULT_TENANT;
    }

    @Override
    public boolean validateExistingCurrentSessions() {
        return true;
    }

    /**
     * Sets the current tenant context for this thread
     */
    public static void setCurrentTenant(String tenantId) {
        currentTenant.set(tenantId);
    }

    /**
     * Gets the current tenant identifier
     */
    public static String getCurrentTenant() {
        String tenant = currentTenant.get();
        return (tenant != null) ? tenant : DEFAULT_TENANT;
    }

    /**
     * Clears the tenant context for this thread. MUST be called in finally block.
     */
    public static void clear() {
        currentTenant.remove();
    }
}
