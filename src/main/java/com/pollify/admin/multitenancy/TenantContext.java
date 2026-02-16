package com.pollify.admin.multitenancy;

/**
 * Application-level tenant context that stays synchronized with TenantIdentifierResolver.
 * Services use TenantContext.getTenantId() for business logic while Hibernate uses
 * TenantIdentifierResolver for schema routing.
 */
public class TenantContext {

    /**
     * Sets the current tenant ID for this request thread
     */
    public static void setTenantId(String id) {
        TenantIdentifierResolver.setCurrentTenant(id);
    }

    /**
     * Gets the current tenant ID. Returns null for super admin context (master schema).
     */
    public static String getTenantId() {
        String id = TenantIdentifierResolver.getCurrentTenant();
        return "master".equals(id) ? null : id;
    }

    /**
     * Clears the tenant context. MUST be called in finally block of filters.
     */
    public static void clear() {
        TenantIdentifierResolver.clear();
    }
}
