-- Pollify Master Schema Initialization
-- This schema holds the global tenant registry, super admins, and platform-level configuration

CREATE SCHEMA IF NOT EXISTS master;

-- Tenant Registry Table (Updated for Epic 1 & 2)
CREATE TABLE master.pollify_tenant (
    tenant_id            VARCHAR(12) PRIMARY KEY,
    tenant_uuid          UUID NOT NULL UNIQUE,
    university_name      VARCHAR(255) NOT NULL,
    university_email     VARCHAR(255) NOT NULL UNIQUE,
    school_type          VARCHAR(50) NOT NULL,  -- DOMAIN_SCHOOL, CODE_SCHOOL
    school_code          VARCHAR(20) UNIQUE,    -- For CODE_SCHOOL type
    database_schema      VARCHAR(255) NOT NULL UNIQUE,
    tenant_status        VARCHAR(50) NOT NULL,  -- PENDING, ACTIVE, SUSPENDED
    admin_email          VARCHAR(255) NOT NULL UNIQUE,
    admin_first_name     VARCHAR(100),
    admin_last_name      VARCHAR(100),
    admin_password_hash  TEXT,
    onboarding_completed BOOLEAN NOT NULL DEFAULT FALSE,
    created_at           TIMESTAMP WITH TIME ZONE NOT NULL,
    onboarded_at         TIMESTAMP WITH TIME ZONE
);

-- Users Table (Super Admins and Tenant Admins) - Created BEFORE tenant_invitation
CREATE TABLE master.users (
    id                UUID PRIMARY KEY,
    email             VARCHAR(255) NOT NULL UNIQUE,
    password_hash     TEXT NOT NULL,
    first_name        VARCHAR(100) NOT NULL,
    last_name         VARCHAR(100) NOT NULL,
    role              VARCHAR(50) NOT NULL CHECK (role IN ('SUPER_ADMIN', 'TENANT_ADMIN')),
    tenant_id         VARCHAR(12) REFERENCES master.pollify_tenant(tenant_id) ON DELETE CASCADE,
    is_active         BOOLEAN DEFAULT TRUE NOT NULL,
    email_verified    BOOLEAN DEFAULT FALSE NOT NULL,
    created_at        TIMESTAMP WITH TIME ZONE NOT NULL,
    updated_at        TIMESTAMP WITH TIME ZONE NOT NULL
);

-- Indexes for users table
CREATE INDEX idx_users_email ON master.users(email);
CREATE INDEX idx_users_role ON master.users(role);
CREATE INDEX idx_users_tenant_id ON master.users(tenant_id);

-- Constraint: Super admins cannot have a tenant_id
ALTER TABLE master.users ADD CONSTRAINT check_super_admin_no_tenant 
    CHECK (role != 'SUPER_ADMIN' OR tenant_id IS NULL);

-- Constraint: Tenant admins must have a tenant_id
ALTER TABLE master.users ADD CONSTRAINT check_tenant_admin_has_tenant 
    CHECK (role != 'TENANT_ADMIN' OR tenant_id IS NOT NULL);

-- Tenant Invitation Table (Epic 1 - Story 1)
CREATE TABLE master.tenant_invitation (
    id                 UUID PRIMARY KEY,
    invitation_token   VARCHAR(64) NOT NULL UNIQUE,
    university_name    VARCHAR(255) NOT NULL,
    university_email   VARCHAR(255) NOT NULL UNIQUE,
    school_type        VARCHAR(50) NOT NULL,  -- DOMAIN_SCHOOL, CODE_SCHOOL
    email_domain       VARCHAR(255),          -- For DOMAIN_SCHOOL
    school_code        VARCHAR(20),           -- For CODE_SCHOOL
    invitation_status  VARCHAR(50) NOT NULL,  -- PENDING, ACCEPTED, EXPIRED, REVOKED
    invited_by         UUID NOT NULL REFERENCES master.users(id),  -- User ID (must be SUPER_ADMIN role)
    expires_at         TIMESTAMP WITH TIME ZONE NOT NULL,
    accepted_at        TIMESTAMP WITH TIME ZONE,
    created_at         TIMESTAMP WITH TIME ZONE NOT NULL
);

CREATE INDEX idx_invitation_token ON master.tenant_invitation(invitation_token);
CREATE INDEX idx_invitation_status ON master.tenant_invitation(invitation_status);

-- Email Domain Index for tenant resolution (Epic 2 - Story 1)
CREATE TABLE master.email_domain_index (
    id           UUID PRIMARY KEY,
    email_domain VARCHAR(255) NOT NULL UNIQUE,  -- e.g. st.ug.edu.gh
    tenant_id    VARCHAR(12) NOT NULL,
    created_at   TIMESTAMP WITH TIME ZONE NOT NULL,
    CONSTRAINT fk_domain_tenant FOREIGN KEY (tenant_id) REFERENCES master.pollify_tenant(tenant_id) ON DELETE CASCADE
);

CREATE INDEX idx_email_domain ON master.email_domain_index(email_domain);

-- Refresh Token Table
CREATE TABLE master.refresh_token (
    id         UUID PRIMARY KEY,
    token      TEXT NOT NULL UNIQUE,
    user_id    UUID NOT NULL,
    tenant_id  VARCHAR(12) NOT NULL,
    expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL
);

CREATE INDEX idx_refresh_token ON master.refresh_token(token);
CREATE INDEX idx_refresh_token_user ON master.refresh_token(user_id, tenant_id);

-- Password Reset Tokens Table
CREATE TABLE master.password_reset_token (
    id         UUID PRIMARY KEY,
    token      VARCHAR(255) NOT NULL UNIQUE,
    user_email VARCHAR(255) NOT NULL,
    tenant_id  VARCHAR(12) NOT NULL,
    expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL
);

CREATE INDEX idx_password_reset_token ON master.password_reset_token(token);
