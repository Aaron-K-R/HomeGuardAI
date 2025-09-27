-- Add missing additional_data column to access_logs table
ALTER TABLE access_logs ADD COLUMN additional_data VARCHAR(1000);
