package com.pollify.pollify.entity.tenant;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.OffsetDateTime;
import java.util.UUID;

/**
 * Epic 3: Student list entity (code schools - Option A)
 * Pre-uploaded student records for verification during registration
 */
@Entity
@Table(name = "student_list")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class StudentList {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private UUID id;

    @Column(name = "student_id", nullable = false, unique = true, length = 50)
    private String studentId;

    @Column(name = "full_name", nullable = false, length = 200)
    private String fullName;

    @Column(name = "is_registered")
    private Boolean isRegistered = false;

    @Column(name = "registered_voter_id")
    private UUID registeredVoterId;

    @Column(name = "uploaded_at")
    private OffsetDateTime uploadedAt;

    @Column(name = "created_at")
    private OffsetDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        createdAt = OffsetDateTime.now();
        uploadedAt = OffsetDateTime.now();
    }
}
