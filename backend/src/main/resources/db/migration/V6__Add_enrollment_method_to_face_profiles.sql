-- Add missing enrollment_method column to face_profiles table
ALTER TABLE face_profiles ADD COLUMN enrollment_method VARCHAR(200);
