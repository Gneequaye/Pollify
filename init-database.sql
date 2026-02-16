-- Pollify Database Initialization Script
-- Run this script to create the PostgreSQL database

-- Create database (run as postgres superuser)
CREATE DATABASE pollify_db;

-- Connect to pollify_db and grant permissions
\c pollify_db

-- Grant all privileges to postgres user (already has them by default)
GRANT ALL PRIVILEGES ON DATABASE pollify_db TO postgres;

-- Note: The master schema and tables will be created automatically
-- by Flyway when the application starts for the first time.
