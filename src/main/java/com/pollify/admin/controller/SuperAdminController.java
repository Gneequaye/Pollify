package com.pollify.admin.controller;

import com.pollify.admin.dto.CompleteOnboardingRequest;
import com.pollify.admin.dto.CompleteOnboardingResponse;
import com.pollify.admin.service.TenantOnboardingService;
import jakarta.validation.Valid;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

/**
 * Super admin controller for platform management and tenant onboarding
 */
@RestController
@RequestMapping("/api/super-admin")
@Slf4j
public class SuperAdminController {

    private final TenantOnboardingService tenantOnboardingService;

    public SuperAdminController(TenantOnboardingService tenantOnboardingService) {
        this.tenantOnboardingService = tenantOnboardingService;
    }

    /**
     * Onboard a new university tenant
     * POST /api/super-admin/tenants/onboard
     */
    @PostMapping("/tenants/onboard")
    public ResponseEntity<CompleteOnboardingResponse> onboardTenant(
            @Valid @RequestBody CompleteOnboardingRequest request) {
        log.info("Tenant onboarding request for: {}", request.getUniversityName());
        CompleteOnboardingResponse response = tenantOnboardingService.completeOnboarding(request);
        return ResponseEntity.ok(response);
    }
}
