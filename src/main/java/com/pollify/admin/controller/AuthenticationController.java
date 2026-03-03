package com.pollify.admin.controller;

import com.pollify.admin.dto.LoginRequest;
import com.pollify.admin.dto.LoginResponse;
import com.pollify.admin.service.AuthenticationService;
import jakarta.validation.Valid;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

/**
 * Authentication controller handling login endpoints for all user types
 */
@RestController
@RequestMapping("/api/auth")
@Slf4j
public class AuthenticationController {

    private final AuthenticationService authenticationService;

    public AuthenticationController(AuthenticationService authenticationService) {
        this.authenticationService = authenticationService;
    }


    /**
     * Unified login — auto-detects SUPER_ADMIN or TENANT_ADMIN.
     * POST /api/auth/login
     */
    @PostMapping("/login")
    public ResponseEntity<?> login(@Valid @RequestBody LoginRequest request) {
        log.info("Login request for: {}", request.getEmail());
        try {
            LoginResponse response = authenticationService.login(request);
            return ResponseEntity.ok(response);
        } catch (org.springframework.security.authentication.BadCredentialsException e) {
            return ResponseEntity.status(401).body(java.util.Map.of("message", "Invalid email or password"));
        } catch (Exception e) {
            log.error("Login error", e);
            return ResponseEntity.status(500).body(java.util.Map.of("message", "Login failed. Please try again."));
        }
    }

    /**
     * Tenant admin login endpoint (kept for backward compatibility)
     * POST /api/auth/admin/login
     */
    @PostMapping("/admin/login")
    public ResponseEntity<?> loginTenantAdmin(@Valid @RequestBody LoginRequest request) {
        log.info("Tenant admin login request for: {}", request.getEmail());
        try {
            LoginResponse response = authenticationService.loginTenantAdmin(request);
            return ResponseEntity.ok(response);
        } catch (org.springframework.security.authentication.BadCredentialsException e) {
            return ResponseEntity.status(401).body(java.util.Map.of("message", "Invalid email or password"));
        }
    }

    /**
     * Super admin login endpoint (kept for backward compatibility)
     * POST /api/auth/super/login
     */
    @PostMapping("/super/login")
    public ResponseEntity<?> loginSuperAdmin(@Valid @RequestBody LoginRequest request) {
        log.info("Super admin login request for: {}", request.getEmail());
        try {
            LoginResponse response = authenticationService.loginSuperAdmin(request);
            return ResponseEntity.ok(response);
        } catch (org.springframework.security.authentication.BadCredentialsException e) {
            return ResponseEntity.status(401).body(java.util.Map.of("message", "Invalid email or password"));
        }
    }
}
