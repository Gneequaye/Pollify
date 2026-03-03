package com.pollify.admin.service;

import com.pollify.admin.dto.*;
import com.pollify.admin.entity.master.TenantInvitation;
import com.pollify.admin.exception.InvitationException;
import com.pollify.admin.multitenancy.TenantContext;
import com.pollify.admin.repository.master.PollifyTenantRepository;
import com.pollify.admin.repository.master.TenantInvitationRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.security.SecureRandom;
import java.time.OffsetDateTime;
import java.util.Base64;
import java.util.List;
import java.util.UUID;

/**
 * Epic 1 - Story 1: Super Admin sends invitation to schools
 * 
 * Acceptance Criteria:
 * - Super admin can send invitation with university name, email, school type
 * - For DOMAIN_SCHOOL: requires email domain
 * - For CODE_SCHOOL: requires school code
 * - System generates unique invitation token
 * - Invitation expires after configurable days (default 7)
 * - Validation prevents duplicate invitations
 */
@Service
@Slf4j
public class InvitationService {

    private final TenantInvitationRepository invitationRepository;
    private final PollifyTenantRepository tenantRepository;
    private final EmailService emailService;
    private final SecureRandom secureRandom = new SecureRandom();

    @Value("${pollify.frontend.url:http://localhost:8080}")
    private String frontendUrl;

    public InvitationService(
            TenantInvitationRepository invitationRepository,
            PollifyTenantRepository tenantRepository,
            EmailService emailService) {
        this.invitationRepository = invitationRepository;
        this.tenantRepository = tenantRepository;
        this.emailService = emailService;
    }

    /**
     * Epic 1 - Story 1: Send invitation to a school
     */
    @Transactional
    public InvitationResponse sendInvitation(SendInvitationRequest request, UUID superAdminId) {
        log.info("Sending invitation to: {}", request.getUniversityEmail());

        try {
            // Set master context for validation queries
            TenantContext.setTenantId(null);

            // 1. Validate: not already invited or onboarded
            validateNotAlreadyInvited(request);
            validateNotAlreadyOnboarded(request);

            // 2. Generate unique invitation token
            String invitationToken = generateSecureToken();

            // 3. Create invitation record
            TenantInvitation invitation = new TenantInvitation();
            invitation.setInvitationToken(invitationToken);
            invitation.setUniversityName(request.getUniversityName());
            invitation.setUniversityEmail(request.getUniversityEmail());
            invitation.setInvitationCode(request.getInvitationCode().toUpperCase().trim());
            invitation.setInvitedBy(superAdminId);

            // Set expiry (default 7 days)
            int expiryDays = request.getExpiryDays() != null ? request.getExpiryDays() : 7;
            invitation.setExpiresAt(OffsetDateTime.now().plusDays(expiryDays));

            // 4. Save invitation
            invitation = invitationRepository.save(invitation);

            log.info("Invitation sent successfully: token={}, university={}",
                    invitationToken, request.getUniversityName());

            // 5. Build response with invitation URL
            String invitationUrl = String.format("%s/register/%s", frontendUrl, invitationToken);

            // 6. Send invitation email via SMTP + Thymeleaf template
            emailService.sendInvitationEmail(invitation);

            return new InvitationResponse(
                    invitationToken,
                    invitation.getUniversityName(),
                    invitation.getUniversityEmail(),
                    invitation.getInvitationCode(),
                    invitationUrl,
                    invitation.getExpiresAt(),
                    "Invitation sent successfully. Valid until " + invitation.getExpiresAt()
            );

        } finally {
            TenantContext.clear();
        }
    }

    /**
     * Get all invitations (for super admin dashboard)
     */
    @Transactional(readOnly = true)
    public List<InvitationResponse> getAllInvitations() {
        try {
            TenantContext.setTenantId(null);
            return invitationRepository.findAll().stream()
                    .map(inv -> new InvitationResponse(
                            inv.getInvitationToken(),
                            inv.getUniversityName(),
                            inv.getUniversityEmail(),
                            inv.getInvitationCode(),
                            String.format("%s/register/%s", frontendUrl, inv.getInvitationToken()),
                            inv.getExpiresAt(),
                            inv.getInvitationStatus().toString()
                    ))
                    .toList();
        } finally {
            TenantContext.clear();
        }
    }

    /**
     * Epic 1 - Story 2: Validate invitation token
     */
    @Transactional(readOnly = true)
    public ValidateInvitationResponse validateInvitation(String invitationToken) {
        log.info("Validating invitation token: {}", invitationToken);

        try {
            TenantContext.setTenantId(null);

            TenantInvitation invitation = invitationRepository.findByInvitationToken(invitationToken)
                    .orElse(null);

            if (invitation == null) {
                return new ValidateInvitationResponse(false, null, null, null, "Invalid invitation token");
            }

            // Check if already accepted
            if (invitation.getInvitationStatus() == TenantInvitation.InvitationStatus.ACCEPTED) {
                return new ValidateInvitationResponse(false, null, null, null, "This invitation has already been accepted");
            }

            // Check if expired
            if (OffsetDateTime.now().isAfter(invitation.getExpiresAt())) {
                return new ValidateInvitationResponse(false, null, null, null, "This invitation has expired");
            }

            // Check if revoked
            if (invitation.getInvitationStatus() == TenantInvitation.InvitationStatus.REVOKED) {
                return new ValidateInvitationResponse(false, null, null, null, "This invitation has been revoked");
            }

            // Valid invitation
            return new ValidateInvitationResponse(
                    true,
                    invitation.getUniversityName(),
                    invitation.getUniversityEmail(),
                    invitation.getInvitationCode(),
                    "Invitation is valid"
            );

        } finally {
            TenantContext.clear();
        }
    }

    /**
     * Mark invitation as accepted (called during onboarding)
     */
    @Transactional
    public void markInvitationAsAccepted(String invitationToken) {
        try {
            TenantContext.setTenantId(null);

            TenantInvitation invitation = invitationRepository.findByInvitationToken(invitationToken)
                    .orElseThrow(() -> new InvitationException("Invitation not found"));

            invitation.setInvitationStatus(TenantInvitation.InvitationStatus.ACCEPTED);
            invitation.setAcceptedAt(OffsetDateTime.now());
            invitationRepository.save(invitation);

            log.info("Invitation marked as accepted: {}", invitationToken);
        } finally {
            TenantContext.clear();
        }
    }

    // ==================== Validation Methods ====================

    private void validateNotAlreadyInvited(SendInvitationRequest request) {
        if (invitationRepository.existsByUniversityEmail(request.getUniversityEmail())) {
            throw new InvitationException(
                    "An invitation has already been sent to this university email"
            );
        }
        if (invitationRepository.existsByInvitationCode(request.getInvitationCode().toUpperCase().trim())) {
            throw new InvitationException(
                    "This invitation code is already in use"
            );
        }
    }

    private void validateNotAlreadyOnboarded(SendInvitationRequest request) {
        if (tenantRepository.existsByUniversityEmail(request.getUniversityEmail())) {
            throw new InvitationException(
                    "This university is already onboarded to Pollify"
            );
        }
    }

    /**
     * Generate cryptographically secure random token
     */
    private String generateSecureToken() {
        byte[] randomBytes = new byte[32];
        secureRandom.nextBytes(randomBytes);
        return Base64.getUrlEncoder().withoutPadding().encodeToString(randomBytes);
    }
}
