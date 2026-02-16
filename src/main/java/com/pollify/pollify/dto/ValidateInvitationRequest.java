package com.pollify.pollify.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Epic 1 - Story 2: Validate invitation token
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class ValidateInvitationRequest {
    
    @NotBlank(message = "Invitation token is required")
    private String invitationToken;
}
