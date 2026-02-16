package com.pollify.pollify.service;

import com.pollify.pollify.dto.voter.*;
import com.pollify.pollify.entity.master.EmailDomainIndex;
import com.pollify.pollify.entity.master.PollifyTenant;
import com.pollify.pollify.entity.tenant.RegistrationToken;
import com.pollify.pollify.entity.tenant.StudentList;
import com.pollify.pollify.entity.tenant.Voter;
import com.pollify.pollify.multitenancy.TenantContext;
import com.pollify.pollify.repository.master.EmailDomainIndexRepository;
import com.pollify.pollify.repository.master.PollifyTenantRepository;
import com.pollify.pollify.repository.tenant.RegistrationTokenRepository;
import com.pollify.pollify.repository.tenant.StudentListRepository;
import com.pollify.pollify.repository.tenant.VoterRepository;
import com.pollify.pollify.security.JwtTokenProvider;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.OffsetDateTime;
import java.util.UUID;

/**
 * Epic 4: Voter Registration Service
 * Handles all three registration flows: domain school, code school (list), code school (token)
 */
@Service
@Slf4j
public class VoterRegistrationService {

    private final VoterRepository voterRepository;
    private final StudentListRepository studentListRepository;
    private final RegistrationTokenRepository tokenRepository;
    private final EmailDomainIndexRepository emailDomainIndexRepository;
    private final PollifyTenantRepository tenantRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtTokenProvider jwtTokenProvider;

    public VoterRegistrationService(
            VoterRepository voterRepository,
            StudentListRepository studentListRepository,
            RegistrationTokenRepository tokenRepository,
            EmailDomainIndexRepository emailDomainIndexRepository,
            PollifyTenantRepository tenantRepository,
            PasswordEncoder passwordEncoder,
            JwtTokenProvider jwtTokenProvider) {
        this.voterRepository = voterRepository;
        this.studentListRepository = studentListRepository;
        this.tokenRepository = tokenRepository;
        this.emailDomainIndexRepository = emailDomainIndexRepository;
        this.tenantRepository = tenantRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtTokenProvider = jwtTokenProvider;
    }

    /**
     * Epic 4 - Story 4.1: Domain school voter registration
     */
    @Transactional
    public VoterRegistrationResponse registerDomainSchoolVoter(DomainSchoolRegistrationRequest request) {
        try {
            // 1. Validate password match
            validatePasswordMatch(request.getPassword(), request.getConfirmPassword());

            // 2. Extract domain from email
            String domain = extractDomain(request.getSchoolEmail());

            // 3. Set master context to look up domain
            TenantContext.setTenantId(null);

            // 4. Find tenant by domain
            EmailDomainIndex domainIndex = emailDomainIndexRepository.findByEmailDomain(domain)
                    .orElseThrow(() -> new IllegalArgumentException(
                            "Your school email domain is not registered on Pollify"));

            String tenantId = domainIndex.getTenantId();
            PollifyTenant tenant = tenantRepository.findById(tenantId)
                    .orElseThrow(() -> new IllegalArgumentException("School not found"));

            // 5. Switch to tenant schema
            TenantContext.setTenantId(tenantId);

            // 6. Check if email already registered
            if (voterRepository.existsByEmail(request.getSchoolEmail())) {
                throw new IllegalArgumentException("This email is already registered");
            }

            // 7. Create voter account
            Voter voter = new Voter();
            voter.setEmail(request.getSchoolEmail());
            voter.setPasswordHash(passwordEncoder.encode(request.getPassword()));
            voter.setFirstName(request.getFirstName());
            voter.setLastName(request.getLastName());
            voter.setIsVerified(true);  // Domain email = auto-verified

            voter = voterRepository.save(voter);

            // 8. Generate login token
            String loginToken = jwtTokenProvider.generateToken(
                    voter.getId().toString(),
                    voter.getEmail(),
                    "VOTER",
                    tenantId
            );

            log.info("Domain school voter registered: {} for tenant: {}", voter.getEmail(), tenantId);

            return new VoterRegistrationResponse(
                    voter.getId().toString(),
                    voter.getEmail(),
                    voter.getFirstName(),
                    voter.getLastName(),
                    tenantId,
                    tenant.getUniversityName(),
                    loginToken,
                    "Registration successful! Welcome to " + tenant.getUniversityName()
            );

        } finally {
            TenantContext.clear();
        }
    }

    /**
     * Epic 4 - Story 4.2: Code school voter registration (student list method)
     */
    @Transactional
    public VoterRegistrationResponse registerCodeSchoolVoterWithList(CodeSchoolListRegistrationRequest request) {
        try {
            // 1. Validate password match
            validatePasswordMatch(request.getPassword(), request.getConfirmPassword());

            // 2. Set master context to look up school code
            TenantContext.setTenantId(null);

            // 3. Find tenant by school code
            PollifyTenant tenant = tenantRepository.findBySchoolCode(request.getSchoolCode())
                    .orElseThrow(() -> new IllegalArgumentException("Invalid school code"));

            String tenantId = tenant.getTenantId();

            // 4. Switch to tenant schema
            TenantContext.setTenantId(tenantId);

            // 5. Validate student ID exists in uploaded list
            StudentList studentRecord = studentListRepository.findByStudentId(request.getStudentId())
                    .orElseThrow(() -> new IllegalArgumentException(
                            "Your student ID was not found. Please contact your school admin."));

            // 6. Check if student ID already used
            if (Boolean.TRUE.equals(studentRecord.getIsRegistered())) {
                throw new IllegalArgumentException("This student ID has already been used for registration");
            }

            // 7. Check if email already registered
            if (voterRepository.existsByEmail(request.getPersonalEmail())) {
                throw new IllegalArgumentException("This email is already registered");
            }

            // 8. Create voter account
            Voter voter = new Voter();
            voter.setEmail(request.getPersonalEmail());
            voter.setPasswordHash(passwordEncoder.encode(request.getPassword()));
            voter.setFirstName(request.getFirstName());
            voter.setLastName(request.getLastName());
            voter.setStudentId(request.getStudentId());
            voter.setIsVerified(true);

            voter = voterRepository.save(voter);

            // 9. Mark student as registered
            studentRecord.setIsRegistered(true);
            studentRecord.setRegisteredVoterId(voter.getId());
            studentListRepository.save(studentRecord);

            // 10. Generate login token
            String loginToken = jwtTokenProvider.generateToken(
                    voter.getId().toString(),
                    voter.getEmail(),
                    "VOTER",
                    tenantId
            );

            log.info("Code school voter registered (list): {} for tenant: {}", voter.getEmail(), tenantId);

            return new VoterRegistrationResponse(
                    voter.getId().toString(),
                    voter.getEmail(),
                    voter.getFirstName(),
                    voter.getLastName(),
                    tenantId,
                    tenant.getUniversityName(),
                    loginToken,
                    "Registration successful! Welcome to " + tenant.getUniversityName()
            );

        } finally {
            TenantContext.clear();
        }
    }

    /**
     * Epic 4 - Story 4.3: Code school voter registration (token method)
     */
    @Transactional
    public VoterRegistrationResponse registerCodeSchoolVoterWithToken(CodeSchoolTokenRegistrationRequest request) {
        try {
            // 1. Validate password match
            validatePasswordMatch(request.getPassword(), request.getConfirmPassword());

            // 2. Set master context to look up school code
            TenantContext.setTenantId(null);

            // 3. Find tenant by school code
            PollifyTenant tenant = tenantRepository.findBySchoolCode(request.getSchoolCode())
                    .orElseThrow(() -> new IllegalArgumentException("Invalid school code"));

            String tenantId = tenant.getTenantId();

            // 4. Switch to tenant schema
            TenantContext.setTenantId(tenantId);

            // 5. Validate registration token
            RegistrationToken token = tokenRepository.findByToken(request.getRegistrationToken())
                    .orElseThrow(() -> new IllegalArgumentException(
                            "This token is invalid or has already been used."));

            // 6. Check if token already used
            if (token.getTokenStatus() == RegistrationToken.TokenStatus.USED) {
                throw new IllegalArgumentException("This token has already been used");
            }

            // 7. Check if email already registered
            if (voterRepository.existsByEmail(request.getPersonalEmail())) {
                throw new IllegalArgumentException("This email is already registered");
            }

            // 8. Create voter account
            Voter voter = new Voter();
            voter.setEmail(request.getPersonalEmail());
            voter.setPasswordHash(passwordEncoder.encode(request.getPassword()));
            voter.setFirstName(request.getFirstName());
            voter.setLastName(request.getLastName());
            voter.setIsVerified(true);

            voter = voterRepository.save(voter);

            // 9. Mark token as USED
            token.setTokenStatus(RegistrationToken.TokenStatus.USED);
            token.setUsedByVoterId(voter.getId());
            token.setUsedAt(OffsetDateTime.now());
            tokenRepository.save(token);

            // 10. Generate login token
            String loginToken = jwtTokenProvider.generateToken(
                    voter.getId().toString(),
                    voter.getEmail(),
                    "VOTER",
                    tenantId
            );

            log.info("Code school voter registered (token): {} for tenant: {}", voter.getEmail(), tenantId);

            return new VoterRegistrationResponse(
                    voter.getId().toString(),
                    voter.getEmail(),
                    voter.getFirstName(),
                    voter.getLastName(),
                    tenantId,
                    tenant.getUniversityName(),
                    loginToken,
                    "Registration successful! Welcome to " + tenant.getUniversityName()
            );

        } finally {
            TenantContext.clear();
        }
    }

    /**
     * Helper: Extract domain from email
     */
    private String extractDomain(String email) {
        if (!email.contains("@")) {
            throw new IllegalArgumentException("Invalid email format");
        }
        return email.substring(email.indexOf("@") + 1);
    }

    /**
     * Helper: Validate password match
     */
    private void validatePasswordMatch(String password, String confirmPassword) {
        if (!password.equals(confirmPassword)) {
            throw new IllegalArgumentException("Passwords do not match");
        }
    }
}
