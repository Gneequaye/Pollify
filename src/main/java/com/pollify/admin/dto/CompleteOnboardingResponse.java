package com.pollify.admin.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Epic 2 - Story 2.3: Response after completing onboarding
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class CompleteOnboardingResponse {
    private String tenantId;
    private String universityName;
    private String schoolType;  // DOMAIN_SCHOOL or CODE_SCHOOL
    private String schoolCode;   // For CODE_SCHOOL
    private String emailDomain;  // For DOMAIN_SCHOOL
    private String adminId;
    private String loginToken;   // JWT token for immediate login
    private String message;
}
