package com.pollify.admin.controller;

import com.pollify.admin.dto.tenant.CreateTenantRequest;
import com.pollify.admin.dto.tenant.TenantResponse;
import com.pollify.admin.service.TenantManagementService;
import jakarta.validation.Valid;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/super-admin/tenants")
@RequiredArgsConstructor
@Slf4j
public class TenantManagementController {

    private final TenantManagementService tenantManagementService;

    @PostMapping
    public ResponseEntity<TenantResponse> createTenant(@Valid @RequestBody CreateTenantRequest request) {
        log.info("Creating tenant for university: {}", request.getUniversityName());
        TenantResponse response = tenantManagementService.createTenant(request);
        log.info("Tenant created successfully with ID: {}", response.getTenantId());
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @GetMapping
    public ResponseEntity<List<TenantResponse>> getAllTenants() {
        log.info("Fetching all tenants");
        List<TenantResponse> tenants = tenantManagementService.getAllTenants();
        return ResponseEntity.ok(tenants);
    }

    @GetMapping("/{tenantId}")
    public ResponseEntity<TenantResponse> getTenantById(@PathVariable String tenantId) {
        log.info("Fetching tenant: {}", tenantId);
        TenantResponse tenant = tenantManagementService.getTenantById(tenantId);
        return ResponseEntity.ok(tenant);
    }

    @GetMapping("/stats")
    public ResponseEntity<TenantStats> getTenantStats() {
        log.info("Fetching tenant statistics");
        TenantStats stats = tenantManagementService.getTenantStats();
        return ResponseEntity.ok(stats);
    }

    @Data
    @AllArgsConstructor
    public static class TenantStats {
        private long totalTenants;
        private long activeTenants;
        private long pendingTenants;
        private long suspendedTenants;
    }
}
