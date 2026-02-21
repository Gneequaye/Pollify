package com.pollify.admin.dto.tenant;

import com.pollify.admin.entity.master.PollifyTenant.SchoolType;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CreateTenantRequest {
    
    @NotBlank(message = "University name is required")
    private String universityName;
    
    @NotBlank(message = "University email is required")
    @Email(message = "Invalid email format")
    private String universityEmail;
    
    @NotNull(message = "School type is required")
    private SchoolType schoolType;
    
    // Required for CODE_SCHOOL type
    private String schoolCode;
    
    @NotBlank(message = "Admin email is required")
    @Email(message = "Invalid admin email format")
    private String adminEmail;
    
    @NotBlank(message = "Admin first name is required")
    private String adminFirstName;
    
    @NotBlank(message = "Admin last name is required")
    private String adminLastName;
    
    @NotBlank(message = "Admin password is required")
    private String adminPassword;
}
