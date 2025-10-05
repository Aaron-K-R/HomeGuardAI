-- Fix rfid_cards table structure
-- This migration ensures the rfid_cards table exists with the correct structure

-- Drop the table if it exists (in case it was created with wrong name)
DROP TABLE IF EXISTS rfid_cards CASCADE;

-- Create the rfid_cards table with correct structure
CREATE TABLE rfid_cards (
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

-- Create indexes for the rfid_cards table
CREATE INDEX idx_rfid_cards_person_id ON rfid_cards(person_id);
CREATE INDEX idx_rfid_cards_card_id ON rfid_cards(card_id);
CREATE INDEX idx_rfid_cards_is_active ON rfid_cards(is_active);
