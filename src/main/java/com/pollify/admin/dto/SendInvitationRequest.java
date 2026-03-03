package com.pollify.admin.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Send invitation request — just name, email, and invitation code.
 * School type is chosen by the school during onboarding.
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class SendInvitationRequest {

    @NotBlank(message = "University name is required")
    private String universityName;

    @NotBlank(message = "University email is required")
    @Email(message = "Invalid email format")
    private String universityEmail;

    /**
     * Unique invitation code the school will use to identify themselves (e.g. "KNUST2024").
     * 4–20 uppercase letters and numbers.
     */
    @NotBlank(message = "Invitation code is required")
    @Size(min = 4, max = 20, message = "Invitation code must be 4–20 characters")
    @Pattern(regexp = "^[A-Z0-9-]+$", message = "Invitation code must be uppercase letters, numbers, and hyphens only")
    private String invitationCode;

    // Optional: Invitation expiry in days (default 7)
    private Integer expiryDays;
}
