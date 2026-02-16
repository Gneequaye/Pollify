package com.pollify.admin.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Response after validating invitation token
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class ValidateInvitationResponse {
    private boolean valid;
    private String universityName;
    private String universityEmail;
    private String schoolType;
    private String emailDomain;  // For DOMAIN_SCHOOL
    private String schoolCode;   // For CODE_SCHOOL
    private String message;
}
