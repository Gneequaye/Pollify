-- Pollify Master Schema Setup
-- Run this file manually: sudo -u postgres psql pollify_db < master-schema.sql

-- Create master schema
CREATE SCHEMA IF NOT EXISTS master;

-- Tenant Registry Table
CREATE TABLE IF NOT EXISTS master.pollify_tenant (
    tenant_id        VARCHAR(12) PRIMARY KEY,
    tenant_uuid      UUID NOT NULL UNIQUE,
    university_name  VARCHAR(255) NOT NULL,
    university_email VARCHAR(255) NOT NULL UNIQUE,
    database_schema  VARCHAR(255) NOT NULL UNIQUE,
    tenant_status    VARCHAR(50) NOT NULL,
    admin_email      VARCHAR(255) NOT NULL UNIQUE,
    admin_password_hash TEXT NOT NULL,
    created_at       TIMESTAMP WITH TIME ZONE NOT NULL
);

-- Email Domain Index
CREATE TABLE IF NOT EXISTS master.email_domain_index (
    id           UUID PRIMARY KEY,
    email_domain VARCHAR(255) NOT NULL UNIQUE,
    tenant_id    VARCHAR(12) NOT NULL,
    created_at   TIMESTAMP WITH TIME ZONE NOT NULL,
    CONSTRAINT fk_domain_tenant FOREIGN KEY (tenant_id) REFERENCES master.pollify_tenant(tenant_id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_email_domain ON master.email_domain_index(email_domain);

-- Super Admin Table
CREATE TABLE IF NOT EXISTS master.super_admin (
    id            UUID PRIMARY KEY,
    email         VARCHAR(255) NOT NULL UNIQUE,
    password_hash TEXT NOT NULL,
    first_name    VARCHAR(100) NOT NULL,
    last_name     VARCHAR(100) NOT NULL,
    created_at    TIMESTAMP WITH TIME ZONE NOT NULL
);

-- Refresh Token Table
CREATE TABLE IF NOT EXISTS master.refresh_token (
    id         UUID PRIMARY KEY,
    token      TEXT NOT NULL UNIQUE,
    user_id    UUID NOT NULL,
    tenant_id  VARCHAR(12) NOT NULL,
    expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_refresh_token ON master.refresh_token(token);
CREATE INDEX IF NOT EXISTS idx_refresh_token_user ON master.refresh_token(user_id, tenant_id);

-- Password Reset Tokens Table
CREATE TABLE IF NOT EXISTS master.password_reset_token (
    id         UUID PRIMARY KEY,
    token      VARCHAR(255) NOT NULL UNIQUE,
    user_email VARCHAR(255) NOT NULL,
    tenant_id  VARCHAR(12) NOT NULL,
    expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_password_reset_token ON master.password_reset_token(token);

-- Verify tables created
\dt master.*
