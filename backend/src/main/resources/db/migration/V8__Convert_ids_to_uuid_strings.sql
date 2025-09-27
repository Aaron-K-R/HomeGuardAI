-- Convert all ID columns from BIGSERIAL to UUID strings
-- This migration converts the existing auto-incrementing IDs to UUID strings

-- First, add new UUID columns for primary keys
ALTER TABLE users ADD COLUMN IF NOT EXISTS new_id VARCHAR(36);
ALTER TABLE homes ADD COLUMN IF NOT EXISTS new_id VARCHAR(36);
ALTER TABLE devices ADD COLUMN IF NOT EXISTS new_id VARCHAR(36);
ALTER TABLE access_permissions ADD COLUMN IF NOT EXISTS new_id VARCHAR(36);
ALTER TABLE access_logs ADD COLUMN IF NOT EXISTS new_id VARCHAR(36);
ALTER TABLE face_profiles ADD COLUMN IF NOT EXISTS new_id VARCHAR(36);
ALTER TABLE rfid_cards ADD COLUMN IF NOT EXISTS new_id VARCHAR(36);
ALTER TABLE app_settings ADD COLUMN IF NOT EXISTS new_id VARCHAR(36);
ALTER TABLE security_settings ADD COLUMN IF NOT EXISTS new_id VARCHAR(36);

-- Generate UUIDs for existing records
UPDATE users SET new_id = gen_random_uuid()::text WHERE new_id IS NULL;
UPDATE homes SET new_id = gen_random_uuid()::text WHERE new_id IS NULL;
UPDATE devices SET new_id = gen_random_uuid()::text WHERE new_id IS NULL;
UPDATE access_permissions SET new_id = gen_random_uuid()::text WHERE new_id IS NULL;
UPDATE access_logs SET new_id = gen_random_uuid()::text WHERE new_id IS NULL;
UPDATE face_profiles SET new_id = gen_random_uuid()::text WHERE new_id IS NULL;
UPDATE rfid_cards SET new_id = gen_random_uuid()::text WHERE new_id IS NULL;
UPDATE app_settings SET new_id = gen_random_uuid()::text WHERE new_id IS NULL;
UPDATE security_settings SET new_id = gen_random_uuid()::text WHERE new_id IS NULL;

-- Add new foreign key columns for UUID references (only if they don't exist)
ALTER TABLE homes ADD COLUMN IF NOT EXISTS new_owner_id VARCHAR(36);
ALTER TABLE devices ADD COLUMN IF NOT EXISTS new_home_id VARCHAR(36);
ALTER TABLE devices ADD COLUMN IF NOT EXISTS new_owner_id VARCHAR(36);
ALTER TABLE access_permissions ADD COLUMN IF NOT EXISTS new_user_id VARCHAR(36);
ALTER TABLE access_permissions ADD COLUMN IF NOT EXISTS new_device_id VARCHAR(36);
ALTER TABLE access_logs ADD COLUMN IF NOT EXISTS new_user_id VARCHAR(36);
ALTER TABLE access_logs ADD COLUMN IF NOT EXISTS new_device_id VARCHAR(36);
ALTER TABLE face_profiles ADD COLUMN IF NOT EXISTS new_user_id VARCHAR(36);
ALTER TABLE rfid_cards ADD COLUMN IF NOT EXISTS new_user_id VARCHAR(36);
ALTER TABLE app_settings ADD COLUMN IF NOT EXISTS new_user_id VARCHAR(36);
ALTER TABLE security_settings ADD COLUMN IF NOT EXISTS new_home_id VARCHAR(36);

-- Update foreign key references
UPDATE homes SET new_owner_id = (SELECT new_id FROM users WHERE users.id = homes.owner_id) WHERE new_owner_id IS NULL;
UPDATE devices SET new_home_id = (SELECT new_id FROM homes WHERE homes.id = devices.home_id) WHERE new_home_id IS NULL;
UPDATE devices SET new_owner_id = (SELECT new_id FROM users WHERE users.id = devices.owner_id) WHERE new_owner_id IS NULL;
UPDATE access_permissions SET new_user_id = (SELECT new_id FROM users WHERE users.id = access_permissions.user_id) WHERE new_user_id IS NULL;
UPDATE access_permissions SET new_device_id = (SELECT new_id FROM devices WHERE devices.id = access_permissions.device_id) WHERE new_device_id IS NULL;
UPDATE access_logs SET new_user_id = (SELECT new_id FROM users WHERE users.id = access_logs.user_id) WHERE new_user_id IS NULL;
UPDATE access_logs SET new_device_id = (SELECT new_id FROM devices WHERE devices.id = access_logs.device_id) WHERE new_device_id IS NULL;
UPDATE face_profiles SET new_user_id = (SELECT new_id FROM users WHERE users.id = face_profiles.user_id) WHERE new_user_id IS NULL;
UPDATE rfid_cards SET new_user_id = (SELECT new_id FROM users WHERE users.id = rfid_cards.user_id) WHERE new_user_id IS NULL;
UPDATE app_settings SET new_user_id = (SELECT new_id FROM users WHERE users.id = app_settings.user_id) WHERE new_user_id IS NULL;
UPDATE security_settings SET new_home_id = (SELECT new_id FROM homes WHERE homes.id = security_settings.home_id) WHERE new_home_id IS NULL;

-- Drop old foreign key constraints
ALTER TABLE homes DROP CONSTRAINT IF EXISTS fk_homes_owner;
ALTER TABLE devices DROP CONSTRAINT IF EXISTS devices_home_id_fkey;
ALTER TABLE devices DROP CONSTRAINT IF EXISTS devices_owner_id_fkey;
ALTER TABLE access_permissions DROP CONSTRAINT IF EXISTS access_permissions_user_id_fkey;
ALTER TABLE access_permissions DROP CONSTRAINT IF EXISTS access_permissions_device_id_fkey;
ALTER TABLE access_logs DROP CONSTRAINT IF EXISTS access_logs_user_id_fkey;
ALTER TABLE access_logs DROP CONSTRAINT IF EXISTS access_logs_device_id_fkey;
ALTER TABLE face_profiles DROP CONSTRAINT IF EXISTS face_profiles_user_id_fkey;
ALTER TABLE rfid_cards DROP CONSTRAINT IF EXISTS rfid_cards_user_id_fkey;
ALTER TABLE app_settings DROP CONSTRAINT IF EXISTS fk_app_settings_user;
ALTER TABLE security_settings DROP CONSTRAINT IF EXISTS security_settings_home_id_fkey;

-- Drop old primary key constraints
ALTER TABLE users DROP CONSTRAINT IF EXISTS users_pkey;
ALTER TABLE homes DROP CONSTRAINT IF EXISTS homes_pkey;
ALTER TABLE devices DROP CONSTRAINT IF EXISTS devices_pkey;
ALTER TABLE access_permissions DROP CONSTRAINT IF EXISTS access_permissions_pkey;
ALTER TABLE access_logs DROP CONSTRAINT IF EXISTS access_logs_pkey;
ALTER TABLE face_profiles DROP CONSTRAINT IF EXISTS face_profiles_pkey;
ALTER TABLE rfid_cards DROP CONSTRAINT IF EXISTS rfid_cards_pkey;
ALTER TABLE app_settings DROP CONSTRAINT IF EXISTS app_settings_pkey;
ALTER TABLE security_settings DROP CONSTRAINT IF EXISTS security_settings_pkey;

-- Drop old ID columns
ALTER TABLE users DROP COLUMN IF EXISTS id;
ALTER TABLE homes DROP COLUMN IF EXISTS id;
ALTER TABLE devices DROP COLUMN IF EXISTS id;
ALTER TABLE access_permissions DROP COLUMN IF EXISTS id;
ALTER TABLE access_logs DROP COLUMN IF EXISTS id;
ALTER TABLE face_profiles DROP COLUMN IF EXISTS id;
ALTER TABLE rfid_cards DROP COLUMN IF EXISTS id;
ALTER TABLE app_settings DROP COLUMN IF EXISTS id;
ALTER TABLE security_settings DROP COLUMN IF EXISTS id;

-- Drop old foreign key columns
ALTER TABLE homes DROP COLUMN IF EXISTS owner_id;
ALTER TABLE devices DROP COLUMN IF EXISTS home_id;
ALTER TABLE devices DROP COLUMN IF EXISTS owner_id;
ALTER TABLE access_permissions DROP COLUMN IF EXISTS user_id;
ALTER TABLE access_permissions DROP COLUMN IF EXISTS device_id;
ALTER TABLE access_logs DROP COLUMN IF EXISTS user_id;
ALTER TABLE access_logs DROP COLUMN IF EXISTS device_id;
ALTER TABLE face_profiles DROP COLUMN IF EXISTS user_id;
ALTER TABLE rfid_cards DROP COLUMN IF EXISTS user_id;
ALTER TABLE app_settings DROP COLUMN IF EXISTS user_id;
ALTER TABLE security_settings DROP COLUMN IF EXISTS home_id;

-- Rename new columns to be the primary ID columns
ALTER TABLE users RENAME COLUMN new_id TO id;
ALTER TABLE homes RENAME COLUMN new_id TO id;
ALTER TABLE devices RENAME COLUMN new_id TO id;
ALTER TABLE access_permissions RENAME COLUMN new_id TO id;
ALTER TABLE access_logs RENAME COLUMN new_id TO id;
ALTER TABLE face_profiles RENAME COLUMN new_id TO id;
ALTER TABLE rfid_cards RENAME COLUMN new_id TO id;
ALTER TABLE app_settings RENAME COLUMN new_id TO id;
ALTER TABLE security_settings RENAME COLUMN new_id TO id;

-- Rename foreign key columns
ALTER TABLE homes RENAME COLUMN new_owner_id TO owner_id;
ALTER TABLE devices RENAME COLUMN new_home_id TO home_id;
ALTER TABLE devices RENAME COLUMN new_owner_id TO owner_id;
ALTER TABLE access_permissions RENAME COLUMN new_user_id TO user_id;
ALTER TABLE access_permissions RENAME COLUMN new_device_id TO device_id;
ALTER TABLE access_logs RENAME COLUMN new_user_id TO user_id;
ALTER TABLE access_logs RENAME COLUMN new_device_id TO device_id;
ALTER TABLE face_profiles RENAME COLUMN new_user_id TO user_id;
ALTER TABLE rfid_cards RENAME COLUMN new_user_id TO user_id;
ALTER TABLE app_settings RENAME COLUMN new_user_id TO user_id;
ALTER TABLE security_settings RENAME COLUMN new_home_id TO home_id;

-- Add primary key constraints
ALTER TABLE users ADD PRIMARY KEY (id);
ALTER TABLE homes ADD PRIMARY KEY (id);
ALTER TABLE devices ADD PRIMARY KEY (id);
ALTER TABLE access_permissions ADD PRIMARY KEY (id);
ALTER TABLE access_logs ADD PRIMARY KEY (id);
ALTER TABLE face_profiles ADD PRIMARY KEY (id);
ALTER TABLE rfid_cards ADD PRIMARY KEY (id);
ALTER TABLE app_settings ADD PRIMARY KEY (id);
ALTER TABLE security_settings ADD PRIMARY KEY (id);

-- Add foreign key constraints
ALTER TABLE homes ADD CONSTRAINT fk_homes_owner FOREIGN KEY (owner_id) REFERENCES users(id) ON DELETE CASCADE;
ALTER TABLE devices ADD CONSTRAINT fk_devices_home FOREIGN KEY (home_id) REFERENCES homes(id) ON DELETE CASCADE;
ALTER TABLE devices ADD CONSTRAINT fk_devices_owner FOREIGN KEY (owner_id) REFERENCES users(id) ON DELETE CASCADE;
ALTER TABLE access_permissions ADD CONSTRAINT fk_access_permissions_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE;
ALTER TABLE access_permissions ADD CONSTRAINT fk_access_permissions_device FOREIGN KEY (device_id) REFERENCES devices(id) ON DELETE CASCADE;
ALTER TABLE access_logs ADD CONSTRAINT fk_access_logs_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL;
ALTER TABLE access_logs ADD CONSTRAINT fk_access_logs_device FOREIGN KEY (device_id) REFERENCES devices(id) ON DELETE CASCADE;
ALTER TABLE face_profiles ADD CONSTRAINT fk_face_profiles_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE;
ALTER TABLE rfid_cards ADD CONSTRAINT fk_rfid_cards_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE;
ALTER TABLE app_settings ADD CONSTRAINT fk_app_settings_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE;
ALTER TABLE security_settings ADD CONSTRAINT fk_security_settings_home FOREIGN KEY (home_id) REFERENCES homes(id) ON DELETE CASCADE;

-- Update indexes to use the new UUID columns
DROP INDEX IF EXISTS idx_users_email;
DROP INDEX IF EXISTS idx_users_phone;
DROP INDEX IF EXISTS idx_homes_owner_id;
DROP INDEX IF EXISTS idx_devices_device_id;
DROP INDEX IF EXISTS idx_devices_home_id;
DROP INDEX IF EXISTS idx_devices_owner_id;
DROP INDEX IF EXISTS idx_devices_device_type;
DROP INDEX IF EXISTS idx_devices_status;
DROP INDEX IF EXISTS idx_access_permissions_user_id;
DROP INDEX IF EXISTS idx_access_permissions_device_id;
DROP INDEX IF EXISTS idx_access_permissions_permission_type;
DROP INDEX IF EXISTS idx_access_permissions_is_active;
DROP INDEX IF EXISTS idx_access_logs_user_id;
DROP INDEX IF EXISTS idx_access_logs_device_id;
DROP INDEX IF EXISTS idx_access_logs_access_type;
DROP INDEX IF EXISTS idx_access_logs_result;
DROP INDEX IF EXISTS idx_access_logs_created_at;
DROP INDEX IF EXISTS idx_face_profiles_user_id;
DROP INDEX IF EXISTS idx_face_profiles_face_id;
DROP INDEX IF EXISTS idx_face_profiles_is_active;
DROP INDEX IF EXISTS idx_rfid_cards_user_id;
DROP INDEX IF EXISTS idx_rfid_cards_card_id;
DROP INDEX IF EXISTS idx_rfid_cards_card_type;
DROP INDEX IF EXISTS idx_rfid_cards_is_active;
DROP INDEX IF EXISTS idx_app_settings_user_id;
DROP INDEX IF EXISTS idx_security_settings_home_id;

-- Recreate indexes
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_phone ON users(phone_number);
CREATE INDEX idx_homes_owner_id ON homes(owner_id);
CREATE INDEX idx_devices_device_id ON devices(device_id);
CREATE INDEX idx_devices_home_id ON devices(home_id);
CREATE INDEX idx_devices_owner_id ON devices(owner_id);
CREATE INDEX idx_devices_device_type ON devices(device_type);
CREATE INDEX idx_devices_status ON devices(status);
CREATE INDEX idx_access_permissions_user_id ON access_permissions(user_id);
CREATE INDEX idx_access_permissions_device_id ON access_permissions(device_id);
CREATE INDEX idx_access_permissions_permission_type ON access_permissions(permission_type);
CREATE INDEX idx_access_permissions_is_active ON access_permissions(is_active);
CREATE INDEX idx_access_logs_user_id ON access_logs(user_id);
CREATE INDEX idx_access_logs_device_id ON access_logs(device_id);
CREATE INDEX idx_access_logs_access_type ON access_logs(access_type);
CREATE INDEX idx_access_logs_result ON access_logs(result);
CREATE INDEX idx_access_logs_created_at ON access_logs(created_at);
CREATE INDEX idx_face_profiles_user_id ON face_profiles(user_id);
CREATE INDEX idx_face_profiles_face_id ON face_profiles(face_id);
CREATE INDEX idx_face_profiles_is_active ON face_profiles(is_active);
CREATE INDEX idx_rfid_cards_user_id ON rfid_cards(user_id);
CREATE INDEX idx_rfid_cards_card_id ON rfid_cards(card_id);
CREATE INDEX idx_rfid_cards_card_type ON rfid_cards(card_type);
CREATE INDEX idx_rfid_cards_is_active ON rfid_cards(is_active);
CREATE INDEX idx_app_settings_user_id ON app_settings(user_id);
CREATE INDEX idx_security_settings_home_id ON security_settings(home_id);