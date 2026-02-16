package com.pollify.admin.dto.voter;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Epic 4 - Story 4.1: Domain school voter registration
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class DomainSchoolRegistrationRequest {
    
    @NotBlank(message = "School email is required")
    @Email(message = "Invalid email format")
    private String schoolEmail;
    
    @NotBlank(message = "First name is required")
    private String firstName;
    
    @NotBlank(message = "Last name is required")
    private String lastName;
    
    @NotBlank(message = "Password is required")
    @Size(min = 8, message = "Password must be at least 8 characters")
    @Pattern(regexp = ".*\\d.*", message = "Password must contain at least one number")
    private String password;
    
    @NotBlank(message = "Password confirmation is required")
    private String confirmPassword;
}
