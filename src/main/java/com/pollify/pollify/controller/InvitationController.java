package com.pollify.pollify.controller;

import com.pollify.pollify.dto.*;
import com.pollify.pollify.exception.InvitationException;
import com.pollify.pollify.security.JwtTokenProvider;
import com.pollify.pollify.service.InvitationService;
import jakarta.validation.Valid;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

/**
 * Epic 1 - School Invitation System
 * 
 * Story 1: Super Admin sends invitations
 * Story 2: Schools validate invitation tokens
 */
@RestController
@RequestMapping("/api")
@Slf4j
public class InvitationController {

    private final InvitationService invitationService;
    private final JwtTokenProvider jwtTokenProvider;

    public InvitationController(
            InvitationService invitationService,
            JwtTokenProvider jwtTokenProvider) {
        this.invitationService = invitationService;
        this.jwtTokenProvider = jwtTokenProvider;
    }

    /**
     * Epic 1 - Story 1: Super Admin sends invitation to a school
     * POST /api/super-admin/invitations
     * 
     * Request Body:
     * {
     *   "universityName": "University of Ghana",
     *   "universityEmail": "admin@st.edu.gh",
     *   "schoolType": "DOMAIN_SCHOOL",
     *   "emailDomain": "st.edu.gh"
     * }
     */
    @PostMapping("/super-admin/invitations")
    public ResponseEntity<?> sendInvitation(
            @Valid @RequestBody SendInvitationRequest request,
            @RequestHeader("Authorization") String authHeader) {
        
        try {
            // Extract super admin ID from token
            String token = authHeader.replace("Bearer ", "");
            String superAdminId = jwtTokenProvider.getUserIdFromToken(token);
            String role = jwtTokenProvider.getRoleFromToken(token);

            // Verify super admin role
            if (!"SUPER_ADMIN".equals(role)) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN)
                        .body("Only super admins can send invitations");
            }

            log.info("Super admin {} sending invitation to {}", 
                    superAdminId, request.getUniversityEmail());

            InvitationResponse response = invitationService.sendInvitation(
                    request, 
                    UUID.fromString(superAdminId)
            );

            return ResponseEntity.status(HttpStatus.CREATED).body(response);

        } catch (InvitationException e) {
            log.warn("Invitation validation failed: {}", e.getMessage());
            return ResponseEntity.badRequest().body(e.getMessage());
        } catch (Exception e) {
            log.error("Error sending invitation", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Failed to send invitation");
        }
    }

    /**
     * Epic 1 - Story 2: Validate invitation token (public endpoint)
     * GET /api/public/invitations/validate?token={token}
     * 
     * This is called when school clicks invitation link
     */
    @GetMapping("/public/invitations/validate")
    public ResponseEntity<ValidateInvitationResponse> validateInvitation(
            @RequestParam("token") String invitationToken) {
        
        log.info("Validating invitation token");

        try {
            ValidateInvitationResponse response = invitationService.validateInvitation(invitationToken);
            
            if (response.isValid()) {
                return ResponseEntity.ok(response);
            } else {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
            }

        } catch (Exception e) {
            log.error("Error validating invitation", e);
            ValidateInvitationResponse errorResponse = new ValidateInvitationResponse(
                    false, null, null, null, null, null,
                    "Failed to validate invitation"
            );
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorResponse);
        }
    }
}
