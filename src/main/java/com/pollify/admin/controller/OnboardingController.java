package com.pollify.admin.controller;

import com.pollify.admin.dto.CompleteOnboardingRequest;
import com.pollify.admin.dto.CompleteOnboardingResponse;
import com.pollify.admin.exception.InvitationException;
import com.pollify.admin.service.TenantOnboardingService;
import jakarta.validation.Valid;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

/**
 * Public endpoint for school onboarding.
 * Called after school validates their invitation token.
 * POST /api/public/onboarding/complete
 */
@RestController
@RequestMapping("/api/public/onboarding")
@Slf4j
public class OnboardingController {

    private final TenantOnboardingService onboardingService;

    public OnboardingController(TenantOnboardingService onboardingService) {
        this.onboardingService = onboardingService;
    }

    /**
     * Complete school onboarding.
     * Validates invitation token, creates tenant, sets up admin account.
     */
    @PostMapping("/complete")
    public ResponseEntity<?> completeOnboarding(
            @Valid @RequestBody CompleteOnboardingRequest request) {

        log.info("Onboarding request received for token: {}",
                request.getInvitationToken().substring(0, Math.min(8, request.getInvitationToken().length())) + "…");

        try {
            CompleteOnboardingResponse response = onboardingService.completeOnboarding(request);
            return ResponseEntity.status(HttpStatus.CREATED).body(response);

        } catch (InvitationException e) {
            log.warn("Onboarding validation failed: {}", e.getMessage());
            return ResponseEntity.badRequest().body(e.getMessage());

        } catch (Exception e) {
            log.error("Onboarding failed unexpectedly", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Onboarding failed. Please try again or contact support.");
        }
    }
}
