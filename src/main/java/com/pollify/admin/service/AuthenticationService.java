package com.pollify.admin.service;

import com.pollify.admin.dto.LoginRequest;
import com.pollify.admin.dto.LoginResponse;
import com.pollify.admin.entity.master.PollifyTenant;
import com.pollify.admin.entity.master.User;
import com.pollify.admin.entity.master.UserRole;
import com.pollify.admin.multitenancy.TenantContext;
import com.pollify.admin.repository.master.PollifyTenantRepository;
import com.pollify.admin.repository.master.UserRepository;
import com.pollify.admin.security.JwtTokenProvider;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Authentication service handling login for:
 * - Tenant Admin login (master schema)
 * - Super Admin login (master schema)
 */
@Service
@Slf4j
public class AuthenticationService {

    private final JwtTokenProvider jwtTokenProvider;
    private final PasswordEncoder passwordEncoder;
    private final PollifyTenantRepository tenantRepository;
    private final UserRepository userRepository;

    public AuthenticationService(
            JwtTokenProvider jwtTokenProvider,
            PasswordEncoder passwordEncoder,
            PollifyTenantRepository tenantRepository,
            UserRepository userRepository) {
        this.jwtTokenProvider = jwtTokenProvider;
        this.passwordEncoder = passwordEncoder;
        this.tenantRepository = tenantRepository;
        this.userRepository = userRepository;
    }

    /**
     * Tenant Admin login — queries master.pollify_tenant directly.
     * Tenant admins are stored in pollify_tenant (not the users table).
     */
    @Transactional
    public LoginResponse loginTenantAdmin(LoginRequest request) {
        log.info("Tenant admin login attempt for email: {}", request.getEmail());

        try {
            TenantContext.setTenantId(null);

            // Look up tenant by admin email
            PollifyTenant tenant = tenantRepository.findByAdminEmail(request.getEmail())
                    .orElseThrow(() -> new BadCredentialsException("Invalid credentials"));

            // Validate password against stored hash
            if (!passwordEncoder.matches(request.getPassword(), tenant.getAdminPasswordHash())) {
                log.warn("Invalid password for tenant admin: {}", request.getEmail());
                throw new BadCredentialsException("Invalid credentials");
            }

            // Check tenant status
            if (tenant.getTenantStatus() != PollifyTenant.TenantStatus.ACTIVE) {
                log.warn("Tenant {} is not active", tenant.getTenantId());
                throw new BadCredentialsException("Your school account is not active. Please contact support.");
            }

            // Generate JWT token
            String token = jwtTokenProvider.generateToken(
                    tenant.getTenantId(),
                    tenant.getAdminEmail(),
                    tenant.getTenantId(),
                    UserRole.TENANT_ADMIN.name()
            );

            log.info("Tenant admin login successful: {}", request.getEmail());

            return new LoginResponse(
                    token,
                    tenant.getTenantId(),
                    tenant.getAdminEmail(),
                    tenant.getAdminFirstName(),
                    tenant.getAdminLastName(),
                    UserRole.TENANT_ADMIN.name(),
                    tenant.getTenantId(),
                    tenant.getUniversityName()
            );
        } finally {
            TenantContext.clear();
        }
    }

    /**
     * Unified login — auto-detects role (SUPER_ADMIN or TENANT_ADMIN).
     * Frontend calls this single endpoint; no need to guess which endpoint to hit.
     */
    @Transactional
    public LoginResponse login(LoginRequest request) {
        TenantContext.setTenantId(null);
        try {
            // Try super admin first
            try {
                return loginSuperAdmin(request);
            } catch (BadCredentialsException ignored) {
                // Not a super admin — try tenant admin
            }
            // Try tenant admin
            return loginTenantAdmin(request);
        } finally {
            TenantContext.clear();
        }
    }

    /**
     * Super Admin login - queries master schema
     */
    @Transactional
    public LoginResponse loginSuperAdmin(LoginRequest request) {
        log.info("Super admin login attempt for email: {}", request.getEmail());
        
        try {
            // Set master context
            TenantContext.setTenantId(null);
            
            // Find user with SUPER_ADMIN role
            User user = userRepository.findByEmailAndRole(request.getEmail(), UserRole.SUPER_ADMIN)
                    .orElseThrow(() -> new BadCredentialsException("Invalid credentials"));

            // Validate password
            if (!passwordEncoder.matches(request.getPassword(), user.getPasswordHash())) {
                log.warn("Invalid password for super admin: {}", request.getEmail());
                throw new BadCredentialsException("Invalid credentials");
            }

            // Check if user is active
            if (!user.getIsActive()) {
                log.warn("User {} is not active", user.getEmail());
                throw new BadCredentialsException("User account is not active");
            }

            // Generate JWT token with null tenant (master context)
            String token = jwtTokenProvider.generateToken(
                    user.getId().toString(),
                    user.getEmail(),
                    null,
                    UserRole.SUPER_ADMIN.name()
            );

            log.info("Super admin login successful: {}", user.getEmail());

            return new LoginResponse(
                    token,
                    user.getId().toString(),
                    user.getEmail(),
                    user.getFirstName(),
                    user.getLastName(),
                    UserRole.SUPER_ADMIN.name(),
                    null,
                    "Pollify Platform"
            );
        } finally {
            TenantContext.clear();
        }
    }
}
