package com.pollify.pollify.service;

import com.pollify.pollify.dto.*;
import com.pollify.pollify.entity.master.PollifyTenant;
import com.pollify.pollify.entity.master.TenantInvitation;
import com.pollify.pollify.exception.InvitationException;
import com.pollify.pollify.multitenancy.TenantContext;
import com.pollify.pollify.repository.master.EmailDomainIndexRepository;
import com.pollify.pollify.repository.master.PollifyTenantRepository;
import com.pollify.pollify.repository.master.TenantInvitationRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.security.SecureRandom;
import java.time.OffsetDateTime;
import java.util.Base64;
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
    private final EmailDomainIndexRepository domainIndexRepository;
    private final SecureRandom secureRandom = new SecureRandom();

    @Value("${pollify.frontend.url:http://localhost:3000}")
    private String frontendUrl;

    public InvitationService(
            TenantInvitationRepository invitationRepository,
            PollifyTenantRepository tenantRepository,
            EmailDomainIndexRepository domainIndexRepository) {
        this.invitationRepository = invitationRepository;
        this.tenantRepository = tenantRepository;
        this.domainIndexRepository = domainIndexRepository;
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

            // 1. Validate: Check if university already invited or onboarded
            validateNotAlreadyInvited(request);
            validateNotAlreadyOnboarded(request);

            // 2. Validate school type specific requirements
            validateSchoolTypeRequirements(request);

            // 3. Generate unique invitation token
            String invitationToken = generateSecureToken();

            // 4. Create invitation record
            TenantInvitation invitation = new TenantInvitation();
            invitation.setInvitationToken(invitationToken);
            invitation.setUniversityName(request.getUniversityName());
            invitation.setUniversityEmail(request.getUniversityEmail());
            invitation.setSchoolType(request.getSchoolType());
            invitation.setInvitedBy(superAdminId);

            // Set school type specific fields
            if (request.getSchoolType() == PollifyTenant.SchoolType.DOMAIN_SCHOOL) {
                invitation.setEmailDomain(request.getEmailDomain().toLowerCase().trim());
            } else {
                invitation.setSchoolCode(request.getSchoolCode().toUpperCase().trim());
            }

            // Set expiry (default 7 days)
            int expiryDays = request.getExpiryDays() != null ? request.getExpiryDays() : 7;
            invitation.setExpiresAt(OffsetDateTime.now().plusDays(expiryDays));

            // 5. Save invitation
            invitation = invitationRepository.save(invitation);

            log.info("Invitation sent successfully: token={}, university={}", 
                    invitationToken, request.getUniversityName());

            // 6. Build response with invitation URL
            String invitationUrl = String.format("%s/onboarding?token=%s", frontendUrl, invitationToken);

            return new InvitationResponse(
                    invitationToken,
                    invitation.getUniversityName(),
                    invitation.getUniversityEmail(),
                    invitation.getSchoolType().toString(),
                    invitationUrl,
                    invitation.getExpiresAt(),
                    "Invitation sent successfully. Valid until " + invitation.getExpiresAt()
            );

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
                return new ValidateInvitationResponse(
                        false, null, null, null, null, null,
                        "Invalid invitation token"
                );
            }

            // Check if already accepted
            if (invitation.getInvitationStatus() == TenantInvitation.InvitationStatus.ACCEPTED) {
                return new ValidateInvitationResponse(
                        false, null, null, null, null, null,
                        "This invitation has already been accepted"
                );
            }

            // Check if expired
            if (OffsetDateTime.now().isAfter(invitation.getExpiresAt())) {
                return new ValidateInvitationResponse(
                        false, null, null, null, null, null,
                        "This invitation has expired"
                );
            }

            // Check if revoked
            if (invitation.getInvitationStatus() == TenantInvitation.InvitationStatus.REVOKED) {
                return new ValidateInvitationResponse(
                        false, null, null, null, null, null,
                        "This invitation has been revoked"
                );
            }

            // Valid invitation
            return new ValidateInvitationResponse(
                    true,
                    invitation.getUniversityName(),
                    invitation.getUniversityEmail(),
                    invitation.getSchoolType().toString(),
                    invitation.getEmailDomain(),
                    invitation.getSchoolCode(),
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

        if (request.getSchoolType() == PollifyTenant.SchoolType.DOMAIN_SCHOOL) {
            if (invitationRepository.existsByEmailDomain(request.getEmailDomain())) {
                throw new InvitationException(
                        "This email domain is already invited or registered"
                );
            }
        } else {
            if (invitationRepository.existsBySchoolCode(request.getSchoolCode())) {
                throw new InvitationException(
                        "This school code is already in use"
                );
            }
        }
    }

    private void validateNotAlreadyOnboarded(SendInvitationRequest request) {
        if (tenantRepository.existsByUniversityEmail(request.getUniversityEmail())) {
            throw new InvitationException(
                    "This university is already onboarded to Pollify"
            );
        }

        if (request.getSchoolType() == PollifyTenant.SchoolType.DOMAIN_SCHOOL) {
            if (domainIndexRepository.existsByEmailDomain(request.getEmailDomain())) {
                throw new InvitationException(
                        "This email domain is already registered"
                );
            }
        }
    }

    private void validateSchoolTypeRequirements(SendInvitationRequest request) {
        if (request.getSchoolType() == PollifyTenant.SchoolType.DOMAIN_SCHOOL) {
            if (request.getEmailDomain() == null || request.getEmailDomain().trim().isEmpty()) {
                throw new InvitationException(
                        "Email domain is required for DOMAIN_SCHOOL type"
                );
            }
            // Validate domain format
            if (!request.getEmailDomain().contains(".")) {
                throw new InvitationException(
                        "Invalid email domain format"
                );
            }
        } else {
            if (request.getSchoolCode() == null || request.getSchoolCode().trim().isEmpty()) {
                throw new InvitationException(
                        "School code is required for CODE_SCHOOL type"
                );
            }
            // Validate code format (alphanumeric, 4-20 chars)
            if (!request.getSchoolCode().matches("^[A-Z0-9]{4,20}$")) {
                throw new InvitationException(
                        "School code must be 4-20 alphanumeric characters (uppercase)"
                );
            }
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
