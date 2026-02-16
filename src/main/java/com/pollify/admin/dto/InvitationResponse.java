package com.pollify.admin.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.OffsetDateTime;

/**
 * Response after sending invitation
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class InvitationResponse {
    private String invitationToken;
    private String universityName;
    private String universityEmail;
    private String schoolType;
    private String invitationUrl;
    private OffsetDateTime expiresAt;
    private String message;
}
