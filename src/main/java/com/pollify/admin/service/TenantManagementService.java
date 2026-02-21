package com.pollify.admin.service;

import com.pollify.admin.controller.TenantManagementController.TenantStats;
import com.pollify.admin.dto.tenant.CreateTenantRequest;
import com.pollify.admin.dto.tenant.TenantResponse;
import com.pollify.admin.entity.master.PollifyTenant;
import com.pollify.admin.entity.master.PollifyTenant.TenantStatus;
import com.pollify.admin.entity.master.User;
import com.pollify.admin.entity.master.UserRole;
import com.pollify.admin.repository.master.PollifyTenantRepository;
import com.pollify.admin.repository.master.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.OffsetDateTime;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class TenantManagementService {

    private final PollifyTenantRepository tenantRepository;
    private final UserRepository userRepository;
    private final TenantSchemaService tenantSchemaService;
    private final PasswordEncoder passwordEncoder;

    @Transactional
    public TenantResponse createTenant(CreateTenantRequest request) {
        log.info("Creating new tenant: {}", request.getUniversityName());

        // Validate email uniqueness
        if (tenantRepository.existsByUniversityEmail(request.getUniversityEmail())) {
            throw new IllegalArgumentException("University email already exists");
        }
        if (tenantRepository.existsByAdminEmail(request.getAdminEmail())) {
            throw new IllegalArgumentException("Admin email already exists");
        }
        if (userRepository.existsByEmail(request.getAdminEmail())) {
            throw new IllegalArgumentException("Admin email already registered as user");
        }

        // Generate tenant ID (e.g., tenant_ug_001)
        String tenantId = generateTenantId(request.getUniversityName());
        String schemaName = "tenant_" + tenantId.toLowerCase().replace("-", "_");

        // Create tenant entity
        PollifyTenant tenant = new PollifyTenant();
        tenant.setTenantId(tenantId);
        tenant.setTenantUuid(UUID.randomUUID());
        tenant.setUniversityName(request.getUniversityName());
        tenant.setUniversityEmail(request.getUniversityEmail());
        tenant.setSchoolType(request.getSchoolType());
        tenant.setSchoolCode(request.getSchoolCode());
        tenant.setDatabaseSchema(schemaName);
        tenant.setTenantStatus(TenantStatus.ACTIVE);
        tenant.setAdminEmail(request.getAdminEmail());
        tenant.setAdminFirstName(request.getAdminFirstName());
        tenant.setAdminLastName(request.getAdminLastName());
        tenant.setAdminPasswordHash(passwordEncoder.encode(request.getAdminPassword()));
        tenant.setOnboardingCompleted(true);
        tenant.setCreatedAt(OffsetDateTime.now());
        tenant.setOnboardedAt(OffsetDateTime.now());

        // Save tenant
        tenant = tenantRepository.save(tenant);
        log.info("Tenant saved: {}", tenant.getTenantId());

        // Create tenant schema
        try {
            tenantSchemaService.createTenantSchema(schemaName);
            log.info("Schema created: {}", schemaName);
        } catch (Exception e) {
            log.error("Failed to create schema for tenant: {}", tenantId, e);
            throw new RuntimeException("Failed to create tenant schema", e);
        }

        // Create tenant admin user
        User adminUser = new User();
        adminUser.setId(UUID.randomUUID());
        adminUser.setEmail(request.getAdminEmail());
        adminUser.setPasswordHash(passwordEncoder.encode(request.getAdminPassword()));
        adminUser.setFirstName(request.getAdminFirstName());
        adminUser.setLastName(request.getAdminLastName());
        adminUser.setRole(UserRole.TENANT_ADMIN);
        adminUser.setTenantId(tenant.getTenantId());
        adminUser.setIsActive(true);
        adminUser.setEmailVerified(true);
        userRepository.save(adminUser);
        log.info("Tenant admin user created: {}", adminUser.getEmail());

        return mapToResponse(tenant);
    }

    public List<TenantResponse> getAllTenants() {
        return tenantRepository.findAll().stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    public TenantResponse getTenantById(String tenantId) {
        PollifyTenant tenant = tenantRepository.findById(tenantId)
                .orElseThrow(() -> new IllegalArgumentException("Tenant not found: " + tenantId));
        return mapToResponse(tenant);
    }

    public TenantStats getTenantStats() {
        long total = tenantRepository.count();
        long active = tenantRepository.countByTenantStatus(TenantStatus.ACTIVE);
        long pending = tenantRepository.countByTenantStatus(TenantStatus.PENDING);
        long suspended = tenantRepository.countByTenantStatus(TenantStatus.SUSPENDED);
        
        return new TenantStats(total, active, pending, suspended);
    }

    private String generateTenantId(String universityName) {
        // Extract initials or abbreviation
        String abbr = universityName.replaceAll("[^A-Z]", "");
        if (abbr.length() < 2) {
            abbr = universityName.substring(0, Math.min(3, universityName.length())).toUpperCase();
        } else if (abbr.length() > 4) {
            abbr = abbr.substring(0, 4);
        }

        // Find next available number
        int counter = 1;
        String tenantId;
        do {
            tenantId = String.format("%s_%03d", abbr.toLowerCase(), counter++);
        } while (tenantRepository.existsById(tenantId));

        return tenantId;
    }

    private TenantResponse mapToResponse(PollifyTenant tenant) {
        TenantResponse response = new TenantResponse();
        response.setTenantId(tenant.getTenantId());
        response.setTenantUuid(tenant.getTenantUuid().toString());
        response.setUniversityName(tenant.getUniversityName());
        response.setUniversityEmail(tenant.getUniversityEmail());
        response.setSchoolType(tenant.getSchoolType());
        response.setSchoolCode(tenant.getSchoolCode());
        response.setDatabaseSchema(tenant.getDatabaseSchema());
        response.setTenantStatus(tenant.getTenantStatus());
        response.setAdminEmail(tenant.getAdminEmail());
        response.setAdminFirstName(tenant.getAdminFirstName());
        response.setAdminLastName(tenant.getAdminLastName());
        response.setOnboardingCompleted(tenant.getOnboardingCompleted());
        response.setCreatedAt(tenant.getCreatedAt());
        response.setOnboardedAt(tenant.getOnboardedAt());
        return response;
    }
}
