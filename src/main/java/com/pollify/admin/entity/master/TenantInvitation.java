package com.pollify.admin.entity.master;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.OffsetDateTime;
import java.util.UUID;

/**
 * Epic 1 - Story 1: Super Admin sends invitation to schools
 * Stores invitation tokens and school details before onboarding
 */
@Entity
@Table(name = "tenant_invitation", schema = "master")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class TenantInvitation {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    @Column(name = "id")
    private UUID id;

    @Column(name = "invitation_token", nullable = false, unique = true, length = 64)
    private String invitationToken;

    @Column(name = "university_name", nullable = false)
    private String universityName;

    @Column(name = "university_email", nullable = false, unique = true)
    private String universityEmail;

    @Enumerated(EnumType.STRING)
    @Column(name = "school_type", nullable = false, length = 50)
    private PollifyTenant.SchoolType schoolType;

    @Column(name = "email_domain", length = 255)
    private String emailDomain;  // For DOMAIN_SCHOOL type (e.g., "st.ug.edu.gh")

    @Column(name = "school_code", length = 20)
    private String schoolCode;   // For CODE_SCHOOL type (e.g., "KNUST2024")

    @Enumerated(EnumType.STRING)
    @Column(name = "invitation_status", nullable = false, length = 50)
    private InvitationStatus invitationStatus;

    @Column(name = "invited_by", nullable = false)
    private UUID invitedBy;  // Super Admin ID

    @Column(name = "expires_at", nullable = false)
    private OffsetDateTime expiresAt;

    @Column(name = "accepted_at")
    private OffsetDateTime acceptedAt;

    @Column(name = "created_at", nullable = false)
    private OffsetDateTime createdAt;

    public enum InvitationStatus {
        PENDING,    // Sent but not yet accepted
        ACCEPTED,   // School started onboarding
        EXPIRED,    // Token expired
        REVOKED     // Super admin cancelled invitation
    }

    @PrePersist
    public void prePersist() {
        if (createdAt == null) {
            createdAt = OffsetDateTime.now();
        }
        if (invitationStatus == null) {
            invitationStatus = InvitationStatus.PENDING;
        }
        if (expiresAt == null) {
            // Default: 7 days expiration
            expiresAt = OffsetDateTime.now().plusDays(7);
        }
    }
}
