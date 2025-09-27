-- Add missing notes column to access_permissions table
ALTER TABLE access_permissions ADD COLUMN notes VARCHAR(500);
