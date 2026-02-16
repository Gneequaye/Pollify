package com.pollify.pollify.controller;

import com.pollify.pollify.dto.voter.*;
import com.pollify.pollify.service.VoterRegistrationService;
import jakarta.validation.Valid;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

/**
 * Epic 4: Voter Registration Controller
 * Handles all three registration flows
 */
@RestController
@RequestMapping("/api/public/voters")
@Slf4j
public class VoterController {

    private final VoterRegistrationService voterRegistrationService;

    public VoterController(VoterRegistrationService voterRegistrationService) {
        this.voterRegistrationService = voterRegistrationService;
    }

    /**
     * Epic 4 - Story 4.1: Domain school voter registration
     * POST /api/public/voters/register/domain
     */
    @PostMapping("/register/domain")
    public ResponseEntity<VoterRegistrationResponse> registerDomainSchoolVoter(
            @Valid @RequestBody DomainSchoolRegistrationRequest request) {
        log.info("Domain school voter registration: {}", request.getSchoolEmail());
        VoterRegistrationResponse response = voterRegistrationService.registerDomainSchoolVoter(request);
        return ResponseEntity.ok(response);
    }

    /**
     * Epic 4 - Story 4.2: Code school voter registration (student list)
     * POST /api/public/voters/register/code-list
     */
    @PostMapping("/register/code-list")
    public ResponseEntity<VoterRegistrationResponse> registerCodeSchoolVoterWithList(
            @Valid @RequestBody CodeSchoolListRegistrationRequest request) {
        log.info("Code school voter registration (list): school={}, studentId={}", 
                request.getSchoolCode(), request.getStudentId());
        VoterRegistrationResponse response = voterRegistrationService.registerCodeSchoolVoterWithList(request);
        return ResponseEntity.ok(response);
    }

    /**
     * Epic 4 - Story 4.3: Code school voter registration (token)
     * POST /api/public/voters/register/code-token
     */
    @PostMapping("/register/code-token")
    public ResponseEntity<VoterRegistrationResponse> registerCodeSchoolVoterWithToken(
            @Valid @RequestBody CodeSchoolTokenRegistrationRequest request) {
        log.info("Code school voter registration (token): school={}", request.getSchoolCode());
        VoterRegistrationResponse response = voterRegistrationService.registerCodeSchoolVoterWithToken(request);
        return ResponseEntity.ok(response);
    }
}
