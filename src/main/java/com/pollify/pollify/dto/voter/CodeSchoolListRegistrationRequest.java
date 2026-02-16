package com.pollify.pollify.dto.voter;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Epic 4 - Story 4.2: Code school voter registration (student list method)
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class CodeSchoolListRegistrationRequest {
    
    @NotBlank(message = "School code is required")
    private String schoolCode;
    
    @NotBlank(message = "Student ID is required")
    private String studentId;
    
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
