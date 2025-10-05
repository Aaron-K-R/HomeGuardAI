-- Create persons table
CREATE TABLE persons (
    id VARCHAR(36) PRIMARY KEY,
    name VARCHAR(200) NOT NULL,
    phone VARCHAR(50),
    email VARCHAR(100),
    person_type VARCHAR(50) NOT NULL,
    profile_image_path VARCHAR(500),
    face_vector TEXT,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    last_seen TIMESTAMP,
    notes VARCHAR(1000),
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Create home_persons table
CREATE TABLE home_persons (
    id VARCHAR(36) PRIMARY KEY,
    home_id VARCHAR(36) NOT NULL,
    person_id VARCHAR(36) NOT NULL,
    access_level VARCHAR(50) NOT NULL,
    access_expires_at TIMESTAMP,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    notes VARCHAR(1000),
    last_accessed TIMESTAMP,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (home_id) REFERENCES homes(id) ON DELETE CASCADE,
    FOREIGN KEY (person_id) REFERENCES persons(id) ON DELETE CASCADE
);

-- Create user_homes table
CREATE TABLE user_homes (
    id VARCHAR(36) PRIMARY KEY,
    user_id VARCHAR(36) NOT NULL,
    home_id VARCHAR(36) NOT NULL,
    role VARCHAR(50) NOT NULL,
    joined_at TIMESTAMP NOT NULL,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (home_id) REFERENCES homes(id) ON DELETE CASCADE
);

-- Create home_invitations table
CREATE TABLE home_invitations (
    id VARCHAR(36) PRIMARY KEY,
    home_id VARCHAR(36) NOT NULL,
    invited_by_user_id VARCHAR(36) NOT NULL,
    email VARCHAR(100) NOT NULL,
    invitation_token VARCHAR(255) NOT NULL UNIQUE,
    expires_at TIMESTAMP NOT NULL,
    is_accepted BOOLEAN NOT NULL DEFAULT FALSE,
    accepted_at TIMESTAMP,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (home_id) REFERENCES homes(id) ON DELETE CASCADE,
    FOREIGN KEY (invited_by_user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Add new fields to devices table for Pi device capabilities
ALTER TABLE devices ADD COLUMN device_capabilities TEXT;
ALTER TABLE devices ADD COLUMN pairing_code VARCHAR(50);
ALTER TABLE devices ADD COLUMN pairing_expires_at TIMESTAMP;
ALTER TABLE devices ADD COLUMN firmware_version VARCHAR(50);
ALTER TABLE devices ADD COLUMN device_configuration TEXT;
ALTER TABLE devices ADD COLUMN last_heartbeat TIMESTAMP;
ALTER TABLE devices ADD COLUMN is_online BOOLEAN NOT NULL DEFAULT FALSE;

-- Create indexes for better performance
CREATE INDEX idx_persons_person_type ON persons(person_type);
CREATE INDEX idx_persons_is_active ON persons(is_active);
CREATE INDEX idx_home_persons_home_id ON home_persons(home_id);
CREATE INDEX idx_home_persons_person_id ON home_persons(person_id);
CREATE INDEX idx_home_persons_is_active ON home_persons(is_active);
CREATE INDEX idx_user_homes_user_id ON user_homes(user_id);
CREATE INDEX idx_user_homes_home_id ON user_homes(home_id);
CREATE INDEX idx_user_homes_role ON user_homes(role);
CREATE INDEX idx_home_invitations_email ON home_invitations(email);
CREATE INDEX idx_home_invitations_token ON home_invitations(invitation_token);
CREATE INDEX idx_home_invitations_is_active ON home_invitations(is_active);
CREATE INDEX idx_devices_pairing_code ON devices(pairing_code);
CREATE INDEX idx_devices_is_online ON devices(is_online);
