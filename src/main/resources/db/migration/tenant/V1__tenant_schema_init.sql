-- Pollify Tenant Schema Initialization
-- This migration runs for each new tenant schema created
-- Creates all tables needed for voters, elections, candidates, votes, and verification

-- ============================================================================
-- Epic 3 & 4: Voter Registration and Verification
-- ============================================================================

-- Voter table (all school types)
CREATE TABLE voter (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    student_id VARCHAR(50),  -- For code schools with student list
    is_verified BOOLEAN DEFAULT TRUE,
    registered_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    last_login TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_voter_email ON voter(email);
CREATE INDEX idx_voter_student_id ON voter(student_id);

-- Student list table (code schools - Option A)
CREATE TABLE student_list (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    student_id VARCHAR(50) NOT NULL UNIQUE,
    full_name VARCHAR(200) NOT NULL,
    is_registered BOOLEAN DEFAULT FALSE,
    registered_voter_id UUID REFERENCES voter(id),
    uploaded_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_student_list_student_id ON student_list(student_id);

-- Registration token table (code schools - Option B)
CREATE TABLE registration_token (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    token VARCHAR(50) NOT NULL UNIQUE,
    token_status VARCHAR(20) DEFAULT 'AVAILABLE' CHECK (token_status IN ('AVAILABLE', 'USED')),
    used_by_voter_id UUID REFERENCES voter(id),
    used_at TIMESTAMP WITH TIME ZONE,
    generated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_registration_token_token ON registration_token(token);
CREATE INDEX idx_registration_token_status ON registration_token(token_status);

-- ============================================================================
-- Epic 5: Election Management
-- ============================================================================

CREATE TABLE election (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title VARCHAR(255) NOT NULL,
    description TEXT,
    election_status VARCHAR(20) DEFAULT 'DRAFT' CHECK (election_status IN ('DRAFT', 'ACTIVE', 'CLOSED')),
    start_time TIMESTAMP WITH TIME ZONE NOT NULL,
    end_time TIMESTAMP WITH TIME ZONE NOT NULL,
    created_by UUID NOT NULL,  -- Admin ID (from tenant_id)
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    closed_at TIMESTAMP WITH TIME ZONE
);

CREATE INDEX idx_election_status ON election(election_status);
CREATE INDEX idx_election_start_time ON election(start_time);
CREATE INDEX idx_election_end_time ON election(end_time);

-- Candidate table
CREATE TABLE candidate (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    election_id UUID NOT NULL REFERENCES election(id) ON DELETE CASCADE,
    full_name VARCHAR(200) NOT NULL,
    position VARCHAR(200) NOT NULL,
    bio TEXT,
    image_url VARCHAR(500),
    vote_count BIGINT DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_candidate_election_id ON candidate(election_id);
CREATE INDEX idx_candidate_vote_count ON candidate(vote_count DESC);

-- ============================================================================
-- Epic 6: Voting System
-- ============================================================================

CREATE TABLE vote (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    voter_id UUID NOT NULL REFERENCES voter(id),
    election_id UUID NOT NULL REFERENCES election(id),
    candidate_id UUID NOT NULL REFERENCES candidate(id),
    voted_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    
    -- Epic 6 - Story 6.3: Prevent duplicate votes
    CONSTRAINT unique_voter_election UNIQUE (voter_id, election_id)
);

CREATE INDEX idx_vote_voter_id ON vote(voter_id);
CREATE INDEX idx_vote_election_id ON vote(election_id);
CREATE INDEX idx_vote_candidate_id ON vote(candidate_id);
CREATE INDEX idx_vote_voted_at ON vote(voted_at);

-- ============================================================================
-- Comments explaining key design decisions
-- ============================================================================

COMMENT ON TABLE voter IS 'Epic 3 & 4: Registered voters in this school - both domain and code schools';
COMMENT ON TABLE student_list IS 'Epic 3: Pre-uploaded student list for code schools (Option A) - validates student_id during registration';
COMMENT ON TABLE registration_token IS 'Epic 3: Generated tokens for code schools (Option B) - one-time use tokens distributed to students';
COMMENT ON TABLE election IS 'Epic 5: Elections created by school admins - status progresses from DRAFT → ACTIVE → CLOSED';
COMMENT ON TABLE candidate IS 'Epic 5: Candidates in each election - vote_count updated in real-time';
COMMENT ON TABLE vote IS 'Epic 6: Individual votes cast - UNIQUE constraint prevents duplicate voting';

COMMENT ON CONSTRAINT unique_voter_election ON vote IS 'Epic 6 - Story 6.3: Database-level duplicate vote prevention';
