-- Create home_activities table
CREATE TABLE home_activities (
    id VARCHAR(36) PRIMARY KEY,
    home_id VARCHAR(36) NOT NULL,
    user_id VARCHAR(36),
    person_id VARCHAR(36),
    device_id VARCHAR(36),
    activity_type VARCHAR(50) NOT NULL,
    priority VARCHAR(20) NOT NULL DEFAULT 'MEDIUM',
    title VARCHAR(500) NOT NULL,
    description VARCHAR(1000),
    location VARCHAR(500),
    image_path VARCHAR(500),
    confidence DOUBLE PRECISION,
    is_acknowledged BOOLEAN NOT NULL DEFAULT FALSE,
    acknowledged_at TIMESTAMP,
    acknowledged_by_user_id VARCHAR(36),
    additional_data VARCHAR(1000),
    activity_timestamp TIMESTAMP NOT NULL,
    is_resolved BOOLEAN NOT NULL DEFAULT FALSE,
    resolved_at TIMESTAMP,
    resolved_by_user_id VARCHAR(36),
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (home_id) REFERENCES homes(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL,
    FOREIGN KEY (person_id) REFERENCES persons(id) ON DELETE SET NULL,
    FOREIGN KEY (device_id) REFERENCES devices(id) ON DELETE SET NULL
);

-- Create indexes for better performance
CREATE INDEX idx_home_activities_home_id ON home_activities(home_id);
CREATE INDEX idx_home_activities_activity_timestamp ON home_activities(activity_timestamp);
CREATE INDEX idx_home_activities_activity_type ON home_activities(activity_type);
CREATE INDEX idx_home_activities_priority ON home_activities(priority);
CREATE INDEX idx_home_activities_is_acknowledged ON home_activities(is_acknowledged);
CREATE INDEX idx_home_activities_is_resolved ON home_activities(is_resolved);
CREATE INDEX idx_home_activities_user_id ON home_activities(user_id);
CREATE INDEX idx_home_activities_person_id ON home_activities(person_id);
CREATE INDEX idx_home_activities_device_id ON home_activities(device_id);

-- Create composite indexes for common queries
CREATE INDEX idx_home_activities_home_timestamp ON home_activities(home_id, activity_timestamp DESC);
CREATE INDEX idx_home_activities_home_acknowledged ON home_activities(home_id, is_acknowledged);
CREATE INDEX idx_home_activities_home_resolved ON home_activities(home_id, is_resolved);
CREATE INDEX idx_home_activities_home_priority ON home_activities(home_id, priority);
