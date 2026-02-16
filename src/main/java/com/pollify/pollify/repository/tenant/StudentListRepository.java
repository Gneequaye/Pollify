package com.pollify.pollify.repository.tenant;

import com.pollify.pollify.entity.tenant.StudentList;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

/**
 * Repository for student list in tenant schema (code schools)
 */
@Repository
public interface StudentListRepository extends JpaRepository<StudentList, UUID> {
    
    Optional<StudentList> findByStudentId(String studentId);
    
    boolean existsByStudentId(String studentId);
    
    long countByIsRegistered(Boolean isRegistered);
}
