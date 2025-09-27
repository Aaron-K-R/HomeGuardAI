-- Add missing columns to face_profiles table
ALTER TABLE face_profiles ADD COLUMN face_features VARCHAR(1000);
ALTER TABLE face_profiles ADD COLUMN recognition_count INTEGER DEFAULT 0;
