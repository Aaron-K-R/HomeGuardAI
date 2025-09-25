-- ============================================================================
-- HomeGuard AI Database Migration V2 - Add User Details and Settings Tables
-- ============================================================================
-- 
-- This migration extends the user system with additional user details, security settings,
-- app preferences, and home management capabilities. It creates a comprehensive data model
-- for the HomeGuard AI security system.
-- 
-- Migration Overview:
-- 1. Extends users table with additional fields (role, location, state, emergency contact)
-- 2. Creates security_settings table for user-specific security configurations
-- 3. Creates app_settings table for user application preferences
-- 4. Creates homes table for property management (users can own multiple homes)
-- 
-- Table Relationships:
-- - users (1) ←→ (1) security_settings (One-to-One)
-- - users (1) ←→ (1) app_settings (One-to-One)
-- - users (1) ←→ (N) homes (One-to-Many)
-- 
-- Key Features:
-- - Role-based access control (USER, ADMIN)
-- - User state management (ACTIVE, INACTIVE, LOCKED, SUSPENDED, PENDING_VERIFICATION)
-- - Comprehensive security system configuration
-- - Application preferences and UI customization
-- - Multi-property support for users
-- - Geographic location support with GPS coordinates
-- 
-- Security Considerations:
-- - All foreign keys use CASCADE DELETE for data consistency
-- - Sensitive settings have appropriate default values
-- - Emergency contact information is stored securely
-- - Police notification requires explicit opt-in
-- ============================================================================

-- ============================================================================
-- Extend Users Table with Additional Fields
-- ============================================================================
-- 
-- Adds essential fields to the users table for complete user management:
-- - Role-based access control
-- - Location information for security features
-- - User state management for account control
-- - Emergency contact information for security alerts
-- ============================================================================

-- Add additional fields to users table for enhanced user management
ALTER TABLE users
    -- User role for access control (USER, ADMIN)
    -- VARCHAR(20) accommodates role names with room for future expansion
    -- NOT NULL with DEFAULT ensures every user has a role
    -- DEFAULT 'USER' provides standard access level for new users
    ADD COLUMN IF NOT EXISTS role VARCHAR(20) NOT NULL DEFAULT 'USER',
    
    -- Street address for location-based security features
    -- VARCHAR(500) accommodates full addresses including apartment numbers
    -- NULL allowed as address is optional during registration
    ADD COLUMN IF NOT EXISTS address VARCHAR(500),
    
    -- City for location-based features and regional settings
    -- VARCHAR(100) accommodates most city names
    -- NULL allowed as city is optional
    ADD COLUMN IF NOT EXISTS city VARCHAR(100),
    
    -- State/province for location-based features
    -- VARCHAR(50) accommodates state names and abbreviations
    -- NULL allowed as state is optional
    ADD COLUMN IF NOT EXISTS state VARCHAR(50),
    
    -- Postal/zip code for location-based features
    -- VARCHAR(20) accommodates international postal codes
    -- NULL allowed as zip code is optional
    ADD COLUMN IF NOT EXISTS zip_code VARCHAR(20),
    
    -- User account state for access control and account management
    -- VARCHAR(30) accommodates state names (ACTIVE, INACTIVE, LOCKED, SUSPENDED, PENDING_VERIFICATION)
    -- NOT NULL with DEFAULT ensures every user has a state
    -- DEFAULT 'ACTIVE' provides normal access for new users
    ADD COLUMN IF NOT EXISTS user_state VARCHAR(30) NOT NULL DEFAULT 'ACTIVE',
    
    -- Emergency contact information for security alerts
    -- VARCHAR(1000) accommodates multiple contacts with details
    -- NULL allowed as emergency contact is optional
    ADD COLUMN IF NOT EXISTS emergency_contact VARCHAR(1000);

-- ============================================================================
-- Security Settings Table
-- ============================================================================
-- 
-- Stores user-specific security system configurations and preferences.
-- Each user has exactly one security settings record that controls their
-- security system behavior, sensor configurations, and alert preferences.
-- ============================================================================

-- Create security_settings table for user-specific security configurations
CREATE TABLE IF NOT EXISTS security_settings (
    -- Primary key: Auto-incrementing unique identifier
    id BIGSERIAL PRIMARY KEY,
    
    -- Foreign key to users table (One-to-One relationship)
    -- BIGINT matches the users.id data type
    -- NOT NULL ensures every security setting belongs to a user
    -- UNIQUE ensures each user has only one security setting record
    user_id BIGINT NOT NULL UNIQUE,
    
    -- Motion detection sensor enable/disable preference
    -- BOOLEAN for true/false values
    -- NOT NULL with DEFAULT ensures every setting has a value
    -- DEFAULT TRUE enables motion detection for new users
    motion_detection_enabled BOOLEAN NOT NULL DEFAULT TRUE,
    
    -- Door sensor enable/disable preference
    -- BOOLEAN for true/false values
    -- NOT NULL with DEFAULT ensures every setting has a value
    -- DEFAULT TRUE enables door sensors for new users
    door_sensor_enabled BOOLEAN NOT NULL DEFAULT TRUE,
    
    -- Window sensor enable/disable preference
    -- BOOLEAN for true/false values
    -- NOT NULL with DEFAULT ensures every setting has a value
    -- DEFAULT TRUE enables window sensors for new users
    window_sensor_enabled BOOLEAN NOT NULL DEFAULT TRUE,
    
    -- Camera recording enable/disable preference
    -- BOOLEAN for true/false values
    -- NOT NULL with DEFAULT ensures every setting has a value
    -- DEFAULT TRUE enables camera recording for new users
    camera_recording_enabled BOOLEAN NOT NULL DEFAULT TRUE,
    
    -- Night vision enable/disable preference
    -- BOOLEAN for true/false values
    -- NOT NULL with DEFAULT ensures every setting has a value
    -- DEFAULT TRUE enables night vision for new users
    night_vision_enabled BOOLEAN NOT NULL DEFAULT TRUE,
    
    -- Alarm sensitivity level (1-10 scale)
    -- INTEGER for numeric values
    -- NULL allowed as sensitivity is optional
    -- Higher values = more sensitive, lower values = less sensitive
    alarm_sensitivity_level INTEGER,
    
    -- Automatic system arming time (HH:MM format)
    -- VARCHAR(10) accommodates time format (e.g., "22:00", "23:30")
    -- NULL allowed as auto-arming is optional
    auto_arm_time VARCHAR(10),
    
    -- Automatic system disarming time (HH:MM format)
    -- VARCHAR(10) accommodates time format (e.g., "07:00", "08:30")
    -- NULL allowed as auto-disarming is optional
    auto_disarm_time VARCHAR(10),
    
    -- Emergency contact notification preference
    -- BOOLEAN for true/false values
    -- NOT NULL with DEFAULT ensures every setting has a value
    -- DEFAULT TRUE enables emergency contact notifications for new users
    emergency_contacts_notified BOOLEAN NOT NULL DEFAULT TRUE,
    
    -- Police notification preference (requires explicit opt-in)
    -- BOOLEAN for true/false values
    -- NOT NULL with DEFAULT ensures every setting has a value
    -- DEFAULT FALSE requires explicit opt-in for police notifications
    police_notification_enabled BOOLEAN NOT NULL DEFAULT FALSE,
    
    -- Created timestamp for audit trail
    -- TIMESTAMPTZ provides timezone-aware timestamps
    -- DEFAULT CURRENT_TIMESTAMP automatically sets creation time
    -- NOT NULL ensures every record has a creation timestamp
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP NOT NULL,
    
    -- Updated timestamp for audit trail
    -- TIMESTAMPTZ provides timezone-aware timestamps
    -- DEFAULT CURRENT_TIMESTAMP automatically sets update time
    -- NOT NULL ensures every record has an update timestamp
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP NOT NULL,
    
    -- Foreign key constraint to users table
    -- CASCADE DELETE ensures security settings are deleted when user is deleted
    -- This maintains referential integrity and prevents orphaned records
    CONSTRAINT fk_security_settings_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Create index on user_id for fast lookups
-- This index enables fast queries when finding security settings for a specific user
CREATE INDEX IF NOT EXISTS idx_security_settings_user_id ON security_settings(user_id);

-- ============================================================================
-- App Settings Table
-- ============================================================================
-- 
-- Stores user-specific application preferences and UI customization options.
-- Each user has exactly one app settings record that controls their
-- mobile app experience, notification preferences, and security features.
-- ============================================================================

-- Create app_settings table for user-specific application preferences
CREATE TABLE IF NOT EXISTS app_settings (
    -- Primary key: Auto-incrementing unique identifier
    id BIGSERIAL PRIMARY KEY,
    
    -- Foreign key to users table (One-to-One relationship)
    -- BIGINT matches the users.id data type
    -- NOT NULL ensures every app setting belongs to a user
    -- UNIQUE ensures each user has only one app setting record
    user_id BIGINT NOT NULL UNIQUE,
    
    -- UI theme preference (light, dark, auto)
    -- VARCHAR(50) accommodates theme names with room for expansion
    -- NOT NULL with DEFAULT ensures every setting has a value
    -- DEFAULT 'light' provides standard theme for new users
    theme VARCHAR(50) NOT NULL DEFAULT 'light',
    
    -- Language preference (en, es, fr, etc.)
    -- VARCHAR(10) accommodates language codes
    -- NOT NULL with DEFAULT ensures every setting has a value
    -- DEFAULT 'en' provides English for new users
    language VARCHAR(10) NOT NULL DEFAULT 'en',
    
    -- Master notification toggle
    -- BOOLEAN for true/false values
    -- NOT NULL with DEFAULT ensures every setting has a value
    -- DEFAULT TRUE enables notifications for new users
    notifications_enabled BOOLEAN NOT NULL DEFAULT TRUE,
    
    -- Push notification preference
    -- BOOLEAN for true/false values
    -- NOT NULL with DEFAULT ensures every setting has a value
    -- DEFAULT TRUE enables push notifications for new users
    push_notifications_enabled BOOLEAN NOT NULL DEFAULT TRUE,
    
    -- Email notification preference
    -- BOOLEAN for true/false values
    -- NOT NULL with DEFAULT ensures every setting has a value
    -- DEFAULT TRUE enables email notifications for new users
    email_notifications_enabled BOOLEAN NOT NULL DEFAULT TRUE,
    
    -- SMS notification preference (requires opt-in)
    -- BOOLEAN for true/false values
    -- NOT NULL with DEFAULT ensures every setting has a value
    -- DEFAULT FALSE requires explicit opt-in for SMS notifications
    sms_notifications_enabled BOOLEAN NOT NULL DEFAULT FALSE,
    
    -- Location tracking preference
    -- BOOLEAN for true/false values
    -- NOT NULL with DEFAULT ensures every setting has a value
    -- DEFAULT TRUE enables location tracking for new users
    location_tracking_enabled BOOLEAN NOT NULL DEFAULT TRUE,
    
    -- Biometric login preference (requires opt-in)
    -- BOOLEAN for true/false values
    -- NOT NULL with DEFAULT ensures every setting has a value
    -- DEFAULT FALSE requires explicit opt-in for biometric login
    biometric_login_enabled BOOLEAN NOT NULL DEFAULT FALSE,
    
    -- Two-factor authentication preference (requires opt-in)
    -- BOOLEAN for true/false values
    -- NOT NULL with DEFAULT ensures every setting has a value
    -- DEFAULT FALSE requires explicit opt-in for 2FA
    two_factor_enabled BOOLEAN NOT NULL DEFAULT FALSE,
    
    -- Auto-lock timeout in minutes
    -- INTEGER for numeric values
    -- NULL allowed as timeout is optional
    -- Controls how long app stays unlocked before requiring re-authentication
    auto_lock_timeout INTEGER,
    
    -- Data usage restriction preference
    -- BOOLEAN for true/false values
    -- NOT NULL with DEFAULT ensures every setting has a value
    -- DEFAULT TRUE restricts data usage to WiFi only for new users
    data_usage_wifi_only BOOLEAN NOT NULL DEFAULT TRUE,
    
    -- Created timestamp for audit trail
    -- TIMESTAMPTZ provides timezone-aware timestamps
    -- DEFAULT CURRENT_TIMESTAMP automatically sets creation time
    -- NOT NULL ensures every record has a creation timestamp
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP NOT NULL,
    
    -- Updated timestamp for audit trail
    -- TIMESTAMPTZ provides timezone-aware timestamps
    -- DEFAULT CURRENT_TIMESTAMP automatically sets update time
    -- NOT NULL ensures every record has an update timestamp
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP NOT NULL,
    
    -- Foreign key constraint to users table
    -- CASCADE DELETE ensures app settings are deleted when user is deleted
    -- This maintains referential integrity and prevents orphaned records
    CONSTRAINT fk_app_settings_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Create index on user_id for fast lookups
-- This index enables fast queries when finding app settings for a specific user
CREATE INDEX IF NOT EXISTS idx_app_settings_user_id ON app_settings(user_id);

-- ============================================================================
-- Homes Table
-- ============================================================================
-- 
-- Stores information about properties/homes that users can monitor.
-- Each user can own multiple homes (main house, vacation home, rental property).
-- Each home can have its own security configuration and monitoring settings.
-- ============================================================================

-- Create homes table for property management
CREATE TABLE IF NOT EXISTS homes (
    -- Primary key: Auto-incrementing unique identifier
    id BIGSERIAL PRIMARY KEY,
    
    -- Foreign key to users table (Many-to-One relationship)
    -- BIGINT matches the users.id data type
    -- NOT NULL ensures every home belongs to a user
    -- This allows users to own multiple properties
    owner_id BIGINT NOT NULL,
    
    -- Display name for the home (e.g., "Main House", "Vacation Home")
    -- VARCHAR(200) accommodates descriptive names
    -- NOT NULL ensures every home has a name
    name VARCHAR(200) NOT NULL,
    
    -- Street address of the property
    -- VARCHAR(500) accommodates full addresses
    -- NOT NULL ensures every home has an address
    address VARCHAR(500) NOT NULL,
    
    -- City where the property is located
    -- VARCHAR(100) accommodates city names
    -- NULL allowed as city is optional
    city VARCHAR(100),
    
    -- State/province where the property is located
    -- VARCHAR(50) accommodates state names and abbreviations
    -- NULL allowed as state is optional
    state VARCHAR(50),
    
    -- Postal/zip code of the property
    -- VARCHAR(20) accommodates international postal codes
    -- NULL allowed as zip code is optional
    zip_code VARCHAR(20),
    
    -- Country where the property is located
    -- VARCHAR(100) accommodates country names
    -- NULL allowed as country is optional
    country VARCHAR(100),
    
    -- GPS latitude coordinate for precise location tracking
    -- DOUBLE PRECISION provides high precision for coordinates
    -- NULL allowed as coordinates are optional
    -- Used for geofencing and location-based security features
    latitude DOUBLE PRECISION,
    
    -- GPS longitude coordinate for precise location tracking
    -- DOUBLE PRECISION provides high precision for coordinates
    -- NULL allowed as coordinates are optional
    -- Used for geofencing and location-based security features
    longitude DOUBLE PRECISION,
    
    -- Type of property (house, apartment, condo, etc.)
    -- VARCHAR(50) accommodates property type names
    -- NULL allowed as property type is optional
    home_type VARCHAR(50),
    
    -- Primary residence indicator
    -- BOOLEAN for true/false values
    -- NOT NULL with DEFAULT ensures every home has a value
    -- DEFAULT FALSE means most homes are not primary
    -- Only one home per user should be marked as primary
    is_primary BOOLEAN NOT NULL DEFAULT FALSE,
    
    -- Active monitoring indicator
    -- BOOLEAN for true/false values
    -- NOT NULL with DEFAULT ensures every home has a value
    -- DEFAULT TRUE enables monitoring for new homes
    -- Inactive homes are not monitored but data is preserved
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    
    -- Additional description or notes about the property
    -- VARCHAR(1000) accommodates detailed descriptions
    -- NULL allowed as description is optional
    description VARCHAR(1000),
    
    -- Type of security system installed (basic, premium, custom, etc.)
    -- VARCHAR(100) accommodates system type names
    -- NULL allowed as system type is optional
    security_system_type VARCHAR(100),
    
    -- Created timestamp for audit trail
    -- TIMESTAMPTZ provides timezone-aware timestamps
    -- DEFAULT CURRENT_TIMESTAMP automatically sets creation time
    -- NOT NULL ensures every record has a creation timestamp
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP NOT NULL,
    
    -- Updated timestamp for audit trail
    -- TIMESTAMPTZ provides timezone-aware timestamps
    -- DEFAULT CURRENT_TIMESTAMP automatically sets update time
    -- NOT NULL ensures every record has an update timestamp
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP NOT NULL,
    
    -- Foreign key constraint to users table
    -- CASCADE DELETE ensures homes are deleted when user is deleted
    -- This maintains referential integrity and prevents orphaned records
    CONSTRAINT fk_homes_owner FOREIGN KEY (owner_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Create index on owner_id for fast lookups
-- This index enables fast queries when finding homes for a specific user
CREATE INDEX IF NOT EXISTS idx_homes_owner_id ON homes(owner_id);

