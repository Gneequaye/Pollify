package com.pollify.admin.dto.tenant;

import com.pollify.admin.entity.master.PollifyTenant.SchoolType;
import com.pollify.admin.entity.master.PollifyTenant.TenantStatus;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.OffsetDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class TenantResponse {
    private String tenantId;
    private String tenantUuid;
    private String universityName;
    private String universityEmail;
    private SchoolType schoolType;
    private String schoolCode;
    private String databaseSchema;
    private TenantStatus tenantStatus;
    private String adminEmail;
    private String adminFirstName;
    private String adminLastName;
    private Boolean onboardingCompleted;
    private OffsetDateTime createdAt;
    private OffsetDateTime onboardedAt;
}
