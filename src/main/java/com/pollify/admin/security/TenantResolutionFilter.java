package com.pollify.admin.security;

import com.pollify.admin.entity.master.EmailDomainIndex;
import com.pollify.admin.multitenancy.TenantContext;
import com.pollify.admin.multitenancy.TenantIdentifierResolver;
import com.pollify.admin.repository.master.EmailDomainIndexRepository;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.extern.slf4j.Slf4j;
import org.springframework.core.annotation.Order;
import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.Optional;

/**
 * Tenant Resolution Filter - Order 1
 * Extracts tenant context from either:
 * 1. JWT token (for authenticated requests)
 * 2. Email domain (for login requests)
 * 
 * CRITICAL: Always clears tenant context in finally block to prevent leaks.
 */
@Component
@Order(1)
@Slf4j
public class TenantResolutionFilter extends OncePerRequestFilter {

    private final JwtTokenProvider jwtTokenProvider;
    private final EmailDomainIndexRepository emailDomainIndexRepository;

    public TenantResolutionFilter(
            JwtTokenProvider jwtTokenProvider,
            EmailDomainIndexRepository emailDomainIndexRepository) {
        this.jwtTokenProvider = jwtTokenProvider;
        this.emailDomainIndexRepository = emailDomainIndexRepository;
    }

    @Override
    protected void doFilterInternal(
            HttpServletRequest request,
            HttpServletResponse response,
            FilterChain filterChain) throws ServletException, IOException {

        try {
            // 1. Try to extract tenant from JWT token (authenticated requests)
            String jwt = getJwtFromRequest(request);
            if (jwt != null && jwtTokenProvider.validateToken(jwt)) {
                String tenantId = jwtTokenProvider.getTenantIdFromToken(jwt);
                if (tenantId != null && !tenantId.isEmpty()) {
                    TenantIdentifierResolver.setCurrentTenant(tenantId);
                    log.debug("Tenant resolved from JWT: {}", tenantId);
                }
            }

            // 2. If no tenant set yet, check if it's a login request
            // Login requests need email domain resolution
            if (TenantIdentifierResolver.getCurrentTenant().equals("master")) {
                String email = extractEmailFromRequest(request);
                if (email != null) {
                    resolveTenantFromEmail(email);
                }
            }

            filterChain.doFilter(request, response);

        } finally {
            // CRITICAL: Always clear tenant context to prevent leaks between requests
            TenantContext.clear();
        }
    }

    /**
     * Extracts JWT token from Authorization header
     */
    private String getJwtFromRequest(HttpServletRequest request) {
        String bearerToken = request.getHeader("Authorization");
        if (StringUtils.hasText(bearerToken) && bearerToken.startsWith("Bearer ")) {
            return bearerToken.substring(7);
        }
        return null;
    }

    /**
     * Extracts email from request body for login requests
     * Note: This is a simplified version. In production, you might want to
     * parse JSON body more robustly.
     */
    private String extractEmailFromRequest(HttpServletRequest request) {
        // For login endpoints, email is typically in the request parameter or body
        String email = request.getParameter("email");
        if (email != null) {
            return email;
        }
        
        // Could also check request body for JSON, but for now return null
        // The login service will handle tenant resolution explicitly
        return null;
    }

    /**
     * Resolves tenant from email domain by looking up in master.email_domain_index
     */
    private void resolveTenantFromEmail(String email) {
        String domain = extractDomain(email);
        if (domain != null) {
            // Query master schema for tenant
            TenantIdentifierResolver.setCurrentTenant("master");
            
            Optional<EmailDomainIndex> indexOpt = emailDomainIndexRepository.findByEmailDomain(domain);
            if (indexOpt.isPresent()) {
                String tenantId = indexOpt.get().getTenantId();
                TenantIdentifierResolver.setCurrentTenant(tenantId);
                log.debug("Tenant resolved from email domain {}: {}", domain, tenantId);
            } else {
                log.debug("No tenant found for email domain: {}", domain);
            }
        }
    }

    /**
     * Extracts domain from email address
     */
    private String extractDomain(String email) {
        if (email == null || !email.contains("@")) {
            return null;
        }
        return email.substring(email.indexOf("@") + 1);
    }
}
