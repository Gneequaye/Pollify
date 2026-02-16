package com.pollify.pollify.entity.master;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.OffsetDateTime;
import java.util.UUID;

/**
 * Master schema tenant registry entity.
 * Each record represents a university that has been onboarded to Pollify.
 */
@Entity
@Table(name = "pollify_tenant", schema = "master")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class PollifyTenant {

    @Id
    @Column(name = "tenant_id", length = 12)
    private String tenantId;

    @Column(name = "tenant_uuid", nullable = false, unique = true)
    private UUID tenantUuid;

    @Column(name = "university_name", nullable = false)
    private String universityName;

    @Column(name = "university_email", nullable = false, unique = true)
    private String universityEmail;

    @Enumerated(EnumType.STRING)
    @Column(name = "school_type", nullable = false, length = 50)
    private SchoolType schoolType;

    @Column(name = "school_code", length = 20, unique = true)
    private String schoolCode;

    @Column(name = "database_schema", nullable = false, unique = true)
    private String databaseSchema;

    @Enumerated(EnumType.STRING)
    @Column(name = "tenant_status", nullable = false, length = 50)
    private TenantStatus tenantStatus;

    @Column(name = "admin_email", nullable = false, unique = true)
    private String adminEmail;

    @Column(name = "admin_first_name", length = 100)
    private String adminFirstName;

    @Column(name = "admin_last_name", length = 100)
    private String adminLastName;

    @Column(name = "admin_password_hash", columnDefinition = "TEXT")
    private String adminPasswordHash;

    @Column(name = "onboarding_completed", nullable = false)
    private Boolean onboardingCompleted = false;

    @Column(name = "created_at", nullable = false)
    private OffsetDateTime createdAt;

    @Column(name = "onboarded_at")
    private OffsetDateTime onboardedAt;

    public enum TenantStatus {
        PENDING,     // Invited but not onboarded
        ACTIVE,      // Onboarded and active
        SUSPENDED    // Temporarily disabled
    }

    public enum SchoolType {
        DOMAIN_SCHOOL,  // Students use university email (e.g., @st.ug.edu.gh)
        CODE_SCHOOL     // Students use personal email + school code
    }

    @PrePersist
    public void prePersist() {
        if (tenantUuid == null) {
            tenantUuid = UUID.randomUUID();
        }
        if (createdAt == null) {
            createdAt = OffsetDateTime.now();
        }
    }
}
