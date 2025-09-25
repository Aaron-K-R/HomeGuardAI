-- ============================================================================
-- HomeGuard AI Database Migration V1 - Create User Table
-- ============================================================================
-- 
-- This migration creates the initial users table with basic user information.
-- It establishes the foundation for user management in the HomeGuard AI system.
-- 
-- Table Purpose:
-- - Stores basic user account information
-- - Provides unique identification for users
-- - Supports authentication and user management
-- - Enables user-specific security configurations
-- 
-- Key Features:
-- - Auto-incrementing primary key (BIGSERIAL)
-- - Unique email constraint for login identification
-- - Required first and last name fields
-- - Optional phone number for contact purposes
-- - Automatic timestamp management for audit trails
-- - Performance indexes on frequently queried fields
-- 
-- Data Types:
-- - BIGSERIAL: Auto-incrementing 64-bit integer (PostgreSQL specific)
-- - VARCHAR: Variable-length character strings with length limits
-- - TIMESTAMP WITH TIME ZONE: Timezone-aware timestamps for global users
-- 
-- Indexes:
-- - Email index: Fast lookups for authentication and user identification
-- - Phone index: Fast lookups for contact and notification purposes
-- 
-- Future Considerations:
-- - Password field will be added in a separate migration for security
-- - Additional user fields will be added in V2 migration
-- - User roles and permissions will be implemented later
-- ============================================================================

-- Create the main users table with basic user information
CREATE TABLE users (
    -- Primary key: Auto-incrementing unique identifier for each user
    id BIGSERIAL PRIMARY KEY,
    
    -- Email address: Unique identifier for user login and communication
    -- VARCHAR(255) accommodates most email addresses while preventing excessive length
    -- UNIQUE constraint ensures no duplicate email addresses
    -- NOT NULL ensures every user has an email address
    email VARCHAR(255) NOT NULL UNIQUE,
    
    -- First name: Required personal information for user identification
    -- VARCHAR(100) provides sufficient length for most names
    -- NOT NULL ensures every user has a first name
    first_name VARCHAR(100) NOT NULL,
    
    -- Last name: Required personal information for user identification
    -- VARCHAR(100) provides sufficient length for most names
    -- NOT NULL ensures every user has a last name
    last_name VARCHAR(100) NOT NULL,
    
    -- Phone number: Optional contact information for notifications and support
    -- VARCHAR(20) accommodates international phone number formats
    -- NULL allowed as phone number is optional
    phone_number VARCHAR(20),
    
    -- Created timestamp: Records when the user account was created
    -- TIMESTAMP WITH TIME ZONE provides timezone-aware timestamps
    -- DEFAULT CURRENT_TIMESTAMP automatically sets the creation time
    -- NOT NULL ensures every record has a creation timestamp
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
    
    -- Updated timestamp: Records when the user record was last modified
    -- TIMESTAMP WITH TIME ZONE provides timezone-aware timestamps
    -- DEFAULT CURRENT_TIMESTAMP automatically sets the update time
    -- NOT NULL ensures every record has an update timestamp
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL
);

-- ============================================================================
-- Performance Indexes
-- ============================================================================
-- 
-- These indexes improve query performance for frequently accessed fields.
-- They are essential for authentication, user lookups, and contact operations.
-- ============================================================================

-- Email index: Critical for authentication and user identification
-- This index enables fast lookups when users log in or when the system
-- needs to find a user by their email address. Without this index,
-- email lookups would require a full table scan.
CREATE INDEX idx_users_email ON users(email);

-- Phone number index: Useful for contact and notification operations
-- This index enables fast lookups when the system needs to find users
-- by phone number for SMS notifications or contact purposes.
-- Note: This index is optional since phone_number can be NULL
CREATE INDEX idx_users_phone ON users(phone_number);
