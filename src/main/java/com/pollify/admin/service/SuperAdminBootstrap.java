package com.pollify.admin.service;

import com.pollify.admin.entity.master.User;
import com.pollify.admin.entity.master.UserRole;
import com.pollify.admin.repository.master.UserRepository;
import jakarta.annotation.PostConstruct;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.UUID;

/**
 * Bootstrap service to create the default super admin user on application startup.
 * Credentials can be configured via environment variables or application.yaml
 */
@Service
public class SuperAdminBootstrap {

    private static final Logger logger = LoggerFactory.getLogger(SuperAdminBootstrap.class);

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Value("${pollify.super-admin.email:superadmin@pollify.com}")
    private String superAdminEmail;

    @Value("${pollify.super-admin.password:Admin@123}")
    private String superAdminPassword;

    @Value("${pollify.super-admin.first-name:Super}")
    private String superAdminFirstName;

    @Value("${pollify.super-admin.last-name:Admin}")
    private String superAdminLastName;

    @Value("${pollify.super-admin.auto-create:true}")
    private boolean autoCreateSuperAdmin;

    public SuperAdminBootstrap(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @PostConstruct
    @Transactional
    public void init() {
        if (!autoCreateSuperAdmin) {
            logger.info("Super admin auto-creation is disabled");
            return;
        }

        try {
            // Check if super admin already exists
            if (userRepository.existsByEmail(superAdminEmail)) {
                logger.info("Super admin already exists with email: {}", superAdminEmail);
                return;
            }

            // Create super admin user
            User superAdmin = new User();
            superAdmin.setId(UUID.randomUUID());
            superAdmin.setEmail(superAdminEmail);
            superAdmin.setPasswordHash(passwordEncoder.encode(superAdminPassword));
            superAdmin.setFirstName(superAdminFirstName);
            superAdmin.setLastName(superAdminLastName);
            superAdmin.setRole(UserRole.SUPER_ADMIN);
            superAdmin.setTenantId(null); // Super admins have no tenant
            superAdmin.setIsActive(true);
            superAdmin.setEmailVerified(true); // Auto-verify super admin
            superAdmin.setCreatedAt(LocalDateTime.now());
            superAdmin.setUpdatedAt(LocalDateTime.now());

            userRepository.save(superAdmin);

            logger.info("✅ Super admin created successfully!");
            logger.info("📧 Email: {}", superAdminEmail);
            logger.info("👤 Name: {} {}", superAdminFirstName, superAdminLastName);
            logger.warn("⚠️  IMPORTANT: Please change the default password immediately after first login!");

        } catch (Exception e) {
            logger.error("❌ Failed to create super admin: {}", e.getMessage(), e);
            throw new RuntimeException("Failed to bootstrap super admin", e);
        }
    }
}
