package com.pollify.pollify.service;

import com.pollify.pollify.dto.CompleteOnboardingRequest;
import com.pollify.pollify.dto.CompleteOnboardingResponse;
import com.pollify.pollify.entity.master.EmailDomainIndex;
import com.pollify.pollify.entity.master.PollifyTenant;
import com.pollify.pollify.entity.master.TenantInvitation;
import com.pollify.pollify.exception.InvitationException;
import com.pollify.pollify.multitenancy.TenantContext;
import com.pollify.pollify.repository.master.EmailDomainIndexRepository;
import com.pollify.pollify.repository.master.PollifyTenantRepository;
import com.pollify.pollify.repository.master.TenantInvitationRepository;
import com.pollify.pollify.security.JwtTokenProvider;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.OffsetDateTime;
import java.util.UUID;

/**
 * Epic 2: School Onboarding Service
 * Handles complete school onboarding flow matching user stories
 */
@Service
@Slf4j
public class TenantOnboardingService {

    private final TenantInvitationRepository invitationRepository;
    private final PollifyTenantRepository tenantRepository;
    private final EmailDomainIndexRepository emailDomainIndexRepository;
    private final TenantSchemaService tenantSchemaService;
    private final PasswordEncoder passwordEncoder;
    private final JwtTokenProvider jwtTokenProvider;

    public TenantOnboardingService(
            TenantInvitationRepository invitationRepository,
            PollifyTenantRepository tenantRepository,
            EmailDomainIndexRepository emailDomainIndexRepository,
            TenantSchemaService tenantSchemaService,
            PasswordEncoder passwordEncoder,
            JwtTokenProvider jwtTokenProvider) {
        this.invitationRepository = invitationRepository;
        this.tenantRepository = tenantRepository;
        this.emailDomainIndexRepository = emailDomainIndexRepository;
        this.tenantSchemaService = tenantSchemaService;
        this.passwordEncoder = passwordEncoder;
        this.jwtTokenProvider = jwtTokenProvider;
    }

    /**
     * Epic 2 - Stories 2.2 & 2.3: Complete school onboarding
     */
    @Transactional
    public CompleteOnboardingResponse completeOnboarding(CompleteOnboardingRequest request) {
        try {
            // Set master context for invitation validation
            TenantContext.setTenantId(null);

            log.info("Starting onboarding for invitation token: {}", request.getInvitationToken());

            // 1. Validate invitation
            TenantInvitation invitation = validateInvitation(request.getInvitationToken());

            // 2. Check for duplicates
            if (tenantRepository.existsByUniversityEmail(invitation.getUniversityEmail())) {
                throw new InvitationException("A school with this email is already onboarded");
            }

            // 3. Generate tenant ID and schema name
            String tenantId = UUID.randomUUID().toString();
            String schemaName = generateSchemaName(request.getUniversityName());

            // 4. Create tenant record
            PollifyTenant tenant = createTenantRecord(request, invitation, tenantId, schemaName);

            // 5. Handle school type specific logic
            if ("DOMAIN_SCHOOL".equals(request.getSchoolType())) {
                handleDomainSchool(request, tenant);
            } else {
                handleCodeSchool(tenant);
            }

            // 6. Create tenant schema and run migrations
            tenantSchemaService.createTenantSchema(tenant.getDatabaseSchema());

            // 7. Mark invitation as accepted
            invitation.setInvitationStatus(TenantInvitation.InvitationStatus.ACCEPTED);
            invitation.setAcceptedAt(OffsetDateTime.now());
            invitationRepository.save(invitation);

            // 8. Generate login token for admin
            String loginToken = jwtTokenProvider.generateToken(
                    tenantId,
                    invitation.getUniversityEmail(),
                    "TENANT_ADMIN",
                    tenantId
            );

            log.info("Onboarding completed successfully for tenant: {}", tenantId);

            return new CompleteOnboardingResponse(
                    tenantId,
                    tenant.getUniversityName(),
                    tenant.getSchoolType().name(),
                    tenant.getSchoolCode(),
                    request.getEmailDomain(),
                    tenantId,
                    loginToken,
                    "Onboarding completed successfully! Welcome to Pollify."
            );

        } finally {
            TenantContext.clear();
        }
    }

    /**
     * Validate invitation token
     */
    private TenantInvitation validateInvitation(String token) {
        TenantInvitation invitation = invitationRepository.findByInvitationToken(token)
                .orElseThrow(() -> new InvitationException("Invalid invitation link"));

        if (invitation.getInvitationStatus() == TenantInvitation.InvitationStatus.ACCEPTED) {
            throw new InvitationException("This invitation has already been used");
        }

        if (invitation.getExpiresAt().isBefore(OffsetDateTime.now())) {
            throw new InvitationException("This invitation has expired. Please contact Pollify.");
        }

        return invitation;
    }

    /**
     * Create tenant record
     */
    private PollifyTenant createTenantRecord(
            CompleteOnboardingRequest request,
            TenantInvitation invitation,
            String tenantId,
            String schemaName) {

        PollifyTenant tenant = new PollifyTenant();
        tenant.setTenantId(tenantId);
        tenant.setTenantUuid(UUID.randomUUID());
        tenant.setUniversityName(request.getUniversityName());
        tenant.setUniversityEmail(invitation.getUniversityEmail());
        tenant.setAdminEmail(invitation.getUniversityEmail());
        tenant.setAdminFirstName(request.getAdminFirstName());
        tenant.setAdminLastName(request.getAdminLastName());
        tenant.setAdminPasswordHash(passwordEncoder.encode(request.getPassword()));
        tenant.setDatabaseSchema(schemaName);
        tenant.setSchoolType(PollifyTenant.SchoolType.valueOf(request.getSchoolType()));
        tenant.setTenantStatus(PollifyTenant.TenantStatus.ACTIVE);
        tenant.setOnboardingCompleted(true);
        tenant.setOnboardedAt(OffsetDateTime.now());
        tenant.setCreatedAt(OffsetDateTime.now());

        return tenantRepository.save(tenant);
    }

    /**
     * Epic 2 - Story 2.3: Handle DOMAIN_SCHOOL onboarding
     */
    private void handleDomainSchool(CompleteOnboardingRequest request, PollifyTenant tenant) {
        if (request.getEmailDomain() == null || request.getEmailDomain().trim().isEmpty()) {
            throw new InvitationException("Email domain is required for domain schools");
        }

        // Check if domain already exists
        if (emailDomainIndexRepository.existsByEmailDomain(request.getEmailDomain())) {
            throw new InvitationException("This email domain is already registered");
        }

        // Create email domain index
        EmailDomainIndex domainIndex = new EmailDomainIndex();
        domainIndex.setId(UUID.randomUUID());
        domainIndex.setEmailDomain(request.getEmailDomain());
        domainIndex.setTenantId(tenant.getTenantId());
        domainIndex.setCreatedAt(OffsetDateTime.now());

        emailDomainIndexRepository.save(domainIndex);

        log.info("Domain school setup complete. Domain: {}", request.getEmailDomain());
    }

    /**
     * Epic 2 - Story 2.3: Handle CODE_SCHOOL onboarding
     * Auto-generates unique school code
     */
    private void handleCodeSchool(PollifyTenant tenant) {
        String schoolCode = generateSchoolCode(tenant.getUniversityName());

        // Ensure uniqueness
        String finalCode = schoolCode;
        int suffix = 1;
        while (tenantRepository.existsBySchoolCode(finalCode)) {
            finalCode = schoolCode + suffix;
            suffix++;
        }

        tenant.setSchoolCode(finalCode);
        tenantRepository.save(tenant);

        log.info("Code school setup complete. School code: {}", finalCode);
    }

    /**
     * Generate school code from university name
     * Epic 2 - Story 2.3: Auto-generate unique school code
     */
    private String generateSchoolCode(String universityName) {
        // Extract initials or first meaningful letters
        String cleaned = universityName.toUpperCase()
                .replaceAll("[^A-Z\\s]", "")
                .trim();

        String[] words = cleaned.split("\\s+");

        if (words.length >= 2) {
            // Multi-word: take initials (e.g., "University of Ghana" -> "UG")
            StringBuilder code = new StringBuilder();
            for (String word : words) {
                if (!word.isEmpty() && !word.equals("OF") && !word.equals("THE")) {
                    code.append(word.charAt(0));
                }
            }
            return code.toString();
        } else {
            // Single word: take first 4-6 letters (e.g., "RADFORD" -> "RADFORD", "Technical" -> "TECH")
            return cleaned.length() > 6 ? cleaned.substring(0, 6) : cleaned;
        }
    }

    /**
     * Generate schema name from university name
     */
    private String generateSchemaName(String universityName) {
        String cleaned = universityName.toLowerCase()
                .replaceAll("[^a-z0-9]", "_")
                .replaceAll("_{2,}", "_")
                .replaceAll("^_|_$", "");

        String schemaName = cleaned + "_schema";

        // Ensure uniqueness
        int suffix = 1;
        String finalSchema = schemaName;
        while (tenantRepository.existsByDatabaseSchema(finalSchema)) {
            finalSchema = schemaName + "_" + suffix;
            suffix++;
        }

        return finalSchema;
    }
}
