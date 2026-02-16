package com.pollify.admin.service;

import com.pollify.admin.dto.LoginRequest;
import com.pollify.admin.dto.LoginResponse;
import com.pollify.admin.entity.master.PollifyTenant;
import com.pollify.admin.entity.master.SuperAdmin;
import com.pollify.admin.multitenancy.TenantContext;
import com.pollify.admin.repository.master.PollifyTenantRepository;
import com.pollify.admin.repository.master.SuperAdminRepository;
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
    private final SuperAdminRepository superAdminRepository;

    public AuthenticationService(
            JwtTokenProvider jwtTokenProvider,
            PasswordEncoder passwordEncoder,
            PollifyTenantRepository tenantRepository,
            SuperAdminRepository superAdminRepository) {
        this.jwtTokenProvider = jwtTokenProvider;
        this.passwordEncoder = passwordEncoder;
        this.tenantRepository = tenantRepository;
        this.superAdminRepository = superAdminRepository;
    }

    /**
     * Tenant Admin login - queries master schema
     */
    @Transactional
    public LoginResponse loginTenantAdmin(LoginRequest request) {
        log.info("Tenant admin login attempt for email: {}", request.getEmail());
        
        try {
            // Set master context
            TenantContext.setTenantId(null);
            
            // Find tenant by admin email
            PollifyTenant tenant = tenantRepository.findByAdminEmail(request.getEmail())
                    .orElseThrow(() -> new BadCredentialsException("Invalid credentials"));

            // Validate password
            if (!passwordEncoder.matches(request.getPassword(), tenant.getAdminPasswordHash())) {
                log.warn("Invalid password for tenant admin: {}", request.getEmail());
                throw new BadCredentialsException("Invalid credentials");
            }

            // Check tenant status
            if (tenant.getTenantStatus() != PollifyTenant.TenantStatus.ACTIVE) {
                log.warn("Tenant {} is not active", tenant.getTenantId());
                throw new BadCredentialsException("Tenant account is not active");
            }

            // Generate JWT token
            String token = jwtTokenProvider.generateToken(
                    tenant.getTenantUuid().toString(),
                    tenant.getAdminEmail(),
                    "TENANT_ADMIN",
                    tenant.getDatabaseSchema()
            );

            log.info("Tenant admin login successful: {}", tenant.getAdminEmail());

            return new LoginResponse(
                    token,
                    tenant.getTenantUuid().toString(),
                    tenant.getAdminEmail(),
                    "Admin",
                    tenant.getUniversityName(),
                    "TENANT_ADMIN",
                    tenant.getDatabaseSchema(),
                    tenant.getUniversityName()
            );
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
            
            // Find super admin
            SuperAdmin admin = superAdminRepository.findByEmail(request.getEmail())
                    .orElseThrow(() -> new BadCredentialsException("Invalid credentials"));

            // Validate password
            if (!passwordEncoder.matches(request.getPassword(), admin.getPasswordHash())) {
                log.warn("Invalid password for super admin: {}", request.getEmail());
                throw new BadCredentialsException("Invalid credentials");
            }

            // Generate JWT token with null tenant (master context)
            String token = jwtTokenProvider.generateToken(
                    admin.getId().toString(),
                    admin.getEmail(),
                    "SUPER_ADMIN",
                    null
            );

            log.info("Super admin login successful: {}", admin.getEmail());

            return new LoginResponse(
                    token,
                    admin.getId().toString(),
                    admin.getEmail(),
                    admin.getFirstName(),
                    admin.getLastName(),
                    "SUPER_ADMIN",
                    null,
                    "Pollify Platform"
            );
        } finally {
            TenantContext.clear();
        }
    }
}
