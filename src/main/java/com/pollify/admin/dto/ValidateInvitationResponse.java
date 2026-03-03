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
    private String invitationCode;
    private String message;
}
