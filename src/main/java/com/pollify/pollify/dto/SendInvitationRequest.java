package com.pollify.pollify.dto;

import com.pollify.pollify.entity.master.PollifyTenant;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Epic 1 - Story 1: Send invitation request
 * Form fields from user story acceptance criteria
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
    
    @NotNull(message = "School type is required")
    private PollifyTenant.SchoolType schoolType;
    
    // For DOMAIN_SCHOOL: email domain (e.g., "st.ug.edu.gh")
    private String emailDomain;
    
    // For CODE_SCHOOL: school code (e.g., "KNUST2024")
    private String schoolCode;
    
    // Optional: Invitation expiry in days (default 7)
    private Integer expiryDays;
}
