-- Add additional fields to users and replace flags with enums/fields
ALTER TABLE users
    ADD COLUMN IF NOT EXISTS role VARCHAR(20) NOT NULL DEFAULT 'USER',
    ADD COLUMN IF NOT EXISTS address VARCHAR(500),
    ADD COLUMN IF NOT EXISTS city VARCHAR(100),
    ADD COLUMN IF NOT EXISTS state VARCHAR(50),
    ADD COLUMN IF NOT EXISTS zip_code VARCHAR(20),
    ADD COLUMN IF NOT EXISTS user_state VARCHAR(30) NOT NULL DEFAULT 'ACTIVE',
    ADD COLUMN IF NOT EXISTS emergency_contact VARCHAR(1000);

-- Create security_settings table (1:1 with users)
CREATE TABLE IF NOT EXISTS security_settings (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL UNIQUE,
    motion_detection_enabled BOOLEAN NOT NULL DEFAULT TRUE,
    door_sensor_enabled BOOLEAN NOT NULL DEFAULT TRUE,
    window_sensor_enabled BOOLEAN NOT NULL DEFAULT TRUE,
    camera_recording_enabled BOOLEAN NOT NULL DEFAULT TRUE,
    night_vision_enabled BOOLEAN NOT NULL DEFAULT TRUE,
    alarm_sensitivity_level INTEGER,
    auto_arm_time VARCHAR(10),
    auto_disarm_time VARCHAR(10),
    emergency_contacts_notified BOOLEAN NOT NULL DEFAULT TRUE,
    police_notification_enabled BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP NOT NULL,
    CONSTRAINT fk_security_settings_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_security_settings_user_id ON security_settings(user_id);

-- Create app_settings table (1:1 with users)
CREATE TABLE IF NOT EXISTS app_settings (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL UNIQUE,
    theme VARCHAR(50) NOT NULL DEFAULT 'light',
    language VARCHAR(10) NOT NULL DEFAULT 'en',
    notifications_enabled BOOLEAN NOT NULL DEFAULT TRUE,
    push_notifications_enabled BOOLEAN NOT NULL DEFAULT TRUE,
    email_notifications_enabled BOOLEAN NOT NULL DEFAULT TRUE,
    sms_notifications_enabled BOOLEAN NOT NULL DEFAULT FALSE,
    location_tracking_enabled BOOLEAN NOT NULL DEFAULT TRUE,
    biometric_login_enabled BOOLEAN NOT NULL DEFAULT FALSE,
    two_factor_enabled BOOLEAN NOT NULL DEFAULT FALSE,
    auto_lock_timeout INTEGER,
    data_usage_wifi_only BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP NOT NULL,
    CONSTRAINT fk_app_settings_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_app_settings_user_id ON app_settings(user_id);

-- Create homes table (many homes per user)
CREATE TABLE IF NOT EXISTS homes (
    id BIGSERIAL PRIMARY KEY,
    owner_id BIGINT NOT NULL,
    name VARCHAR(200) NOT NULL,
    address VARCHAR(500) NOT NULL,
    city VARCHAR(100),
    state VARCHAR(50),
    zip_code VARCHAR(20),
    country VARCHAR(100),
    latitude DOUBLE PRECISION,
    longitude DOUBLE PRECISION,
    home_type VARCHAR(50),
    is_primary BOOLEAN NOT NULL DEFAULT FALSE,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    description VARCHAR(1000),
    security_system_type VARCHAR(100),
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP NOT NULL,
    CONSTRAINT fk_homes_owner FOREIGN KEY (owner_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_homes_owner_id ON homes(owner_id);

