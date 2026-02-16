package com.pollify.admin.dto.voter;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Epic 4 - Story 4.3: Code school voter registration (token method)
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class CodeSchoolTokenRegistrationRequest {
    
    @NotBlank(message = "School code is required")
    private String schoolCode;
    
    @NotBlank(message = "Registration token is required")
    private String registrationToken;
    
    @NotBlank(message = "Personal email is required")
    @Email(message = "Invalid email format")
    private String personalEmail;
    
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
