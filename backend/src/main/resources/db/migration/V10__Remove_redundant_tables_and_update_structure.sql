-- Drop redundant tables that are replaced by new structure
DROP TABLE IF EXISTS face_profiles CASCADE;
DROP TABLE IF EXISTS access_permissions CASCADE;

-- Update rfid_cards to link to persons instead of users
-- First, create a new rfid_cards_persons table
CREATE TABLE rfid_cards_persons (
    id VARCHAR(36) PRIMARY KEY,
    person_id VARCHAR(36) NOT NULL,
    card_id VARCHAR(100) NOT NULL UNIQUE,
    card_type VARCHAR(50) NOT NULL,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    last_used TIMESTAMP,
    assigned_by VARCHAR(200),
    description VARCHAR(500),
    usage_count INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (person_id) REFERENCES persons(id) ON DELETE CASCADE
);

-- Create indexes for the new rfid_cards_persons table
CREATE INDEX idx_rfid_cards_persons_person_id ON rfid_cards_persons(person_id);
CREATE INDEX idx_rfid_cards_persons_card_id ON rfid_cards_persons(card_id);
CREATE INDEX idx_rfid_cards_persons_is_active ON rfid_cards_persons(is_active);

-- Drop the old rfid_cards table
DROP TABLE IF EXISTS rfid_cards CASCADE;

-- Update access_logs to reference persons instead of users where applicable
-- Add person_id column to access_logs
ALTER TABLE access_logs ADD COLUMN person_id VARCHAR(36);
ALTER TABLE access_logs ADD CONSTRAINT access_logs_person_id_fkey 
    FOREIGN KEY (person_id) REFERENCES persons(id) ON DELETE SET NULL;
CREATE INDEX idx_access_logs_person_id ON access_logs(person_id);

-- Remove the old user_id foreign key constraint from access_logs
-- (Keep user_id for backward compatibility but make it nullable)
ALTER TABLE access_logs ALTER COLUMN user_id DROP NOT NULL;

-- Clean up any orphaned data
-- This is a safety measure - in production you might want to migrate data first
