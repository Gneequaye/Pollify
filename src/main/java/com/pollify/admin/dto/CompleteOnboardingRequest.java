package com.pollify.admin.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Epic 2 - Story 2.2 & 2.3: Complete onboarding request
 * Combines school identity (Step 1) and domain setup (Step 2)
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class CompleteOnboardingRequest {
    
    // From invitation - validated on backend
    @NotBlank(message = "Invitation token is required")
    private String invitationToken;
    
    // Epic 2 - Story 2.2: School Identity (Step 1)
    @NotBlank(message = "University name is required")
    private String universityName;
    
    @NotBlank(message = "Admin first name is required")
    private String adminFirstName;
    
    @NotBlank(message = "Admin last name is required")
    private String adminLastName;
    
    @NotBlank(message = "Password is required")
    @Size(min = 8, message = "Password must be at least 8 characters")
    @Pattern(regexp = ".*\\d.*", message = "Password must contain at least one number")
    private String password;
    
    private String schoolLogoUrl;  // Optional - uploaded separately
    
    // Epic 2 - Story 2.3: Email & Domain Setup (Step 2)
    @NotBlank(message = "School type is required")
    @Pattern(regexp = "DOMAIN_SCHOOL|CODE_SCHOOL", message = "School type must be DOMAIN_SCHOOL or CODE_SCHOOL")
    private String schoolType;
    
    // Required for DOMAIN_SCHOOL, null for CODE_SCHOOL
    private String emailDomain;
}
