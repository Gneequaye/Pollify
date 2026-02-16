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
     * Tenant admin login endpoint
     * POST /api/auth/admin/login
     */
    @PostMapping("/admin/login")
    public ResponseEntity<LoginResponse> loginTenantAdmin(@Valid @RequestBody LoginRequest request) {
        log.info("Tenant admin login request for: {}", request.getEmail());
        LoginResponse response = authenticationService.loginTenantAdmin(request);
        return ResponseEntity.ok(response);
    }

    /**
     * Super admin login endpoint
     * POST /api/auth/super/login
     */
    @PostMapping("/super/login")
    public ResponseEntity<LoginResponse> loginSuperAdmin(@Valid @RequestBody LoginRequest request) {
        log.info("Super admin login request for: {}", request.getEmail());
        LoginResponse response = authenticationService.loginSuperAdmin(request);
        return ResponseEntity.ok(response);
    }
}
