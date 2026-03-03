package com.pollify.admin.dto.tenant;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class TenantStats {
    private long totalTenants;
    private long activeTenants;
    private long pendingTenants;
    private long suspendedTenants;
}
