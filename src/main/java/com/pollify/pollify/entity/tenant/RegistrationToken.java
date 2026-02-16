package com.pollify.pollify.entity.tenant;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.OffsetDateTime;
import java.util.UUID;

/**
 * Epic 3: Registration token entity (code schools - Option B)
 * One-time use tokens distributed to students for registration
 */
@Entity
@Table(name = "registration_token")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class RegistrationToken {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private UUID id;

    @Column(nullable = false, unique = true, length = 50)
    private String token;

    @Enumerated(EnumType.STRING)
    @Column(name = "token_status", length = 20)
    private TokenStatus tokenStatus = TokenStatus.AVAILABLE;

    @Column(name = "used_by_voter_id")
    private UUID usedByVoterId;

    @Column(name = "used_at")
    private OffsetDateTime usedAt;

    @Column(name = "generated_at")
    private OffsetDateTime generatedAt;

    @Column(name = "created_at")
    private OffsetDateTime createdAt;

    public enum TokenStatus {
        AVAILABLE,
        USED
    }

    @PrePersist
    protected void onCreate() {
        createdAt = OffsetDateTime.now();
        generatedAt = OffsetDateTime.now();
    }
}
