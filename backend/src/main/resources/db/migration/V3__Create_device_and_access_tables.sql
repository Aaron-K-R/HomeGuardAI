-- Create devices table
CREATE TABLE devices (
    id BIGSERIAL PRIMARY KEY,
    device_id VARCHAR(100) NOT NULL UNIQUE,
    name VARCHAR(200) NOT NULL,
    device_type VARCHAR(50) NOT NULL,
    status VARCHAR(50) NOT NULL DEFAULT 'OFFLINE',
    location VARCHAR(200),
    ip_address VARCHAR(50),
    mac_address VARCHAR(50),
    pi_serial_number VARCHAR(100),
    pi_model VARCHAR(50),
    os_version VARCHAR(50),
    cpu_temperature DOUBLE PRECISION,
    memory_usage INTEGER,
    storage_usage INTEGER,
    wifi_ssid VARCHAR(100),
    wifi_signal INTEGER,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    home_id BIGINT NOT NULL,
    owner_id BIGINT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    FOREIGN KEY (home_id) REFERENCES homes(id) ON DELETE CASCADE,
    FOREIGN KEY (owner_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE INDEX idx_devices_device_id ON devices(device_id);
CREATE INDEX idx_devices_home_id ON devices(home_id);
CREATE INDEX idx_devices_owner_id ON devices(owner_id);
CREATE INDEX idx_devices_device_type ON devices(device_type);
CREATE INDEX idx_devices_status ON devices(status);

-- Create access_permissions table
CREATE TABLE access_permissions (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL,
    device_id BIGINT NOT NULL,
    permission_type VARCHAR(50) NOT NULL,
    valid_from TIMESTAMPTZ,
    valid_until TIMESTAMPTZ,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    granted_by VARCHAR(255),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (device_id) REFERENCES devices(id) ON DELETE CASCADE
);

CREATE INDEX idx_access_permissions_user_id ON access_permissions(user_id);
CREATE INDEX idx_access_permissions_device_id ON access_permissions(device_id);
CREATE INDEX idx_access_permissions_permission_type ON access_permissions(permission_type);
CREATE INDEX idx_access_permissions_is_active ON access_permissions(is_active);

-- Create access_logs table
CREATE TABLE access_logs (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT,
    device_id BIGINT NOT NULL,
    access_type VARCHAR(50),
    result VARCHAR(50),
    reason VARCHAR(500),
    image_path VARCHAR(500),
    location VARCHAR(255),
    face_id VARCHAR(255),
    confidence DOUBLE PRECISION,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL,
    FOREIGN KEY (device_id) REFERENCES devices(id) ON DELETE CASCADE
);

CREATE INDEX idx_access_logs_user_id ON access_logs(user_id);
CREATE INDEX idx_access_logs_device_id ON access_logs(device_id);
CREATE INDEX idx_access_logs_access_type ON access_logs(access_type);
CREATE INDEX idx_access_logs_result ON access_logs(result);
CREATE INDEX idx_access_logs_created_at ON access_logs(created_at);

-- Create face_profiles table
CREATE TABLE face_profiles (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL UNIQUE,
    face_id VARCHAR(255) NOT NULL UNIQUE,
    image_path VARCHAR(500),
    confidence DOUBLE PRECISION,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    last_recognized TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE INDEX idx_face_profiles_user_id ON face_profiles(user_id);
CREATE INDEX idx_face_profiles_face_id ON face_profiles(face_id);
CREATE INDEX idx_face_profiles_is_active ON face_profiles(is_active);

-- Create rfid_cards table
CREATE TABLE rfid_cards (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL,
    card_id VARCHAR(100) NOT NULL UNIQUE,
    card_type VARCHAR(50) NOT NULL,
    apple_device_id VARCHAR(100),
    nfc_tag_id VARCHAR(100),
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    last_used TIMESTAMPTZ,
    assigned_by VARCHAR(200),
    description VARCHAR(500),
    usage_count INTEGER NOT NULL DEFAULT 0,
    requires_biometric BOOLEAN NOT NULL DEFAULT FALSE,
    device_model VARCHAR(100),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE INDEX idx_rfid_cards_user_id ON rfid_cards(user_id);
CREATE INDEX idx_rfid_cards_card_id ON rfid_cards(card_id);
CREATE INDEX idx_rfid_cards_card_type ON rfid_cards(card_type);
CREATE INDEX idx_rfid_cards_is_active ON rfid_cards(is_active);

-- Update security_settings table to reference home instead of user
ALTER TABLE security_settings DROP CONSTRAINT IF EXISTS security_settings_user_id_fkey;
ALTER TABLE security_settings DROP COLUMN IF EXISTS user_id;
ALTER TABLE security_settings ADD COLUMN home_id BIGINT NOT NULL;
ALTER TABLE security_settings ADD CONSTRAINT security_settings_home_id_fkey 
    FOREIGN KEY (home_id) REFERENCES homes(id) ON DELETE CASCADE;
CREATE INDEX idx_security_settings_home_id ON security_settings(home_id);
