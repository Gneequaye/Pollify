package com.pollify.pollify.entity.master;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.OffsetDateTime;
import java.util.UUID;

/**
 * Master schema email domain index for tenant resolution.
 * Maps email domains (e.g., st.ug.edu.gh) to tenant schemas.
 */
@Entity
@Table(name = "email_domain_index", schema = "master")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class EmailDomainIndex {

    @Id
    @Column(name = "id")
    private UUID id;

    @Column(name = "email_domain", nullable = false, unique = true)
    private String emailDomain;

    @Column(name = "tenant_id", nullable = false, length = 12)
    private String tenantId;

    @Column(name = "created_at", nullable = false)
    private OffsetDateTime createdAt;

    @PrePersist
    public void prePersist() {
        if (id == null) {
            id = UUID.randomUUID();
        }
        if (createdAt == null) {
            createdAt = OffsetDateTime.now();
        }
    }
}
