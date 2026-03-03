-- V3: Fix tenant_id column length
-- UUID is 36 characters but tenant_id was VARCHAR(12) — too small.
-- Widen to VARCHAR(36) to fit a full UUID.

ALTER TABLE master.pollify_tenant
    ALTER COLUMN tenant_id TYPE VARCHAR(36);

-- Also fix any FK references that reference tenant_id
ALTER TABLE master.users
    ALTER COLUMN tenant_id TYPE VARCHAR(36);

ALTER TABLE master.email_domain_index
    ALTER COLUMN tenant_id TYPE VARCHAR(36);

ALTER TABLE master.refresh_token
    ALTER COLUMN tenant_id TYPE VARCHAR(36);

ALTER TABLE master.password_reset_token
    ALTER COLUMN tenant_id TYPE VARCHAR(36);
