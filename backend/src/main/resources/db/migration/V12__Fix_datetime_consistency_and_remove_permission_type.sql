-- Update all timestamp columns to use TIMESTAMP instead of TIMESTAMPTZ for consistency
-- This ensures all datetime fields use LocalDateTime consistently

-- Update users table
ALTER TABLE users ALTER COLUMN created_at TYPE TIMESTAMP;
ALTER TABLE users ALTER COLUMN updated_at TYPE TIMESTAMP;

-- Update homes table  
ALTER TABLE homes ALTER COLUMN created_at TYPE TIMESTAMP;
ALTER TABLE homes ALTER COLUMN updated_at TYPE TIMESTAMP;

-- Update devices table
ALTER TABLE devices ALTER COLUMN created_at TYPE TIMESTAMP;
ALTER TABLE devices ALTER COLUMN updated_at TYPE TIMESTAMP;

-- Update access_logs table
ALTER TABLE access_logs ALTER COLUMN created_at TYPE TIMESTAMP;
ALTER TABLE access_logs ALTER COLUMN updated_at TYPE TIMESTAMP;

-- Update security_settings table
ALTER TABLE security_settings ALTER COLUMN created_at TYPE TIMESTAMP;
ALTER TABLE security_settings ALTER COLUMN updated_at TYPE TIMESTAMP;

-- Update app_settings table
ALTER TABLE app_settings ALTER COLUMN created_at TYPE TIMESTAMP;
ALTER TABLE app_settings ALTER COLUMN updated_at TYPE TIMESTAMP;

-- Update persons table
ALTER TABLE persons ALTER COLUMN created_at TYPE TIMESTAMP;
ALTER TABLE persons ALTER COLUMN updated_at TYPE TIMESTAMP;

-- Update home_persons table
ALTER TABLE home_persons ALTER COLUMN created_at TYPE TIMESTAMP;
ALTER TABLE home_persons ALTER COLUMN updated_at TYPE TIMESTAMP;

-- Update user_homes table
ALTER TABLE user_homes ALTER COLUMN created_at TYPE TIMESTAMP;
ALTER TABLE user_homes ALTER COLUMN updated_at TYPE TIMESTAMP;

-- Update home_invitations table
ALTER TABLE home_invitations ALTER COLUMN created_at TYPE TIMESTAMP;
ALTER TABLE home_invitations ALTER COLUMN updated_at TYPE TIMESTAMP;

-- Update home_activities table
ALTER TABLE home_activities ALTER COLUMN created_at TYPE TIMESTAMP;
ALTER TABLE home_activities ALTER COLUMN updated_at TYPE TIMESTAMP;

-- Update rfid_cards_persons table
ALTER TABLE rfid_cards_persons ALTER COLUMN created_at TYPE TIMESTAMP;
ALTER TABLE rfid_cards_persons ALTER COLUMN updated_at TYPE TIMESTAMP;

-- Remove any references to PermissionType enum if they exist
-- (This is handled by the application layer since PermissionType was removed)
