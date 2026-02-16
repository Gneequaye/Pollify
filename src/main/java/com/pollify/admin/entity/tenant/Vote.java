package com.pollify.admin.entity.tenant;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.OffsetDateTime;
import java.util.UUID;

/**
 * Epic 6: Vote entity (tenant schema)
 * Individual votes cast with duplicate prevention
 */
@Entity
@Table(
    name = "vote",
    uniqueConstraints = @UniqueConstraint(
        name = "unique_voter_election", 
        columnNames = {"voter_id", "election_id"}
    )
)
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Vote {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private UUID id;

    @Column(name = "voter_id", nullable = false)
    private UUID voterId;

    @Column(name = "election_id", nullable = false)
    private UUID electionId;

    @Column(name = "candidate_id", nullable = false)
    private UUID candidateId;

    @Column(name = "voted_at")
    private OffsetDateTime votedAt;

    @PrePersist
    protected void onCreate() {
        votedAt = OffsetDateTime.now();
    }
}
