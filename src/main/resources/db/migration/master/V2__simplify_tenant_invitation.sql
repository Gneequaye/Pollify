-- V2: Simplify tenant_invitation table
-- Remove school_type, email_domain, school_code columns.
-- Add invitation_code — a unique code assigned by the super admin at invite time.
-- School type is chosen by the school during onboarding, not at invitation time.

ALTER TABLE master.tenant_invitation
    DROP COLUMN IF EXISTS school_type,
    DROP COLUMN IF EXISTS email_domain,
    DROP COLUMN IF EXISTS school_code,
    ADD COLUMN invitation_code VARCHAR(20) NOT NULL DEFAULT '',
    ADD CONSTRAINT uq_invitation_code UNIQUE (invitation_code);
