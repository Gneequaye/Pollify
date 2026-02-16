package com.pollify.admin.dto.voter;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Response after successful voter registration
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class VoterRegistrationResponse {
    private String voterId;
    private String email;
    private String firstName;
    private String lastName;
    private String tenantId;
    private String universityName;
    private String loginToken;  // JWT for immediate login
    private String message;
}
