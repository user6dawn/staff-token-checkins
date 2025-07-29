/*
  # Update Staff Table Column Names

  1. Changes
    - Rename `staffID` column to `staffid` (int4)
    - Rename `tag` column to `tag` (int4) 
    - Update foreign key references in cafeRegister table

  2. Security
    - Maintain existing RLS policies
    - Update indexes to match new column names
*/

-- First, drop the foreign key constraint
ALTER TABLE cafeRegister DROP CONSTRAINT IF EXISTS cafeRegister_staffID_fkey;

-- Drop existing indexes
DROP INDEX IF EXISTS idx_staff_tag;
DROP INDEX IF EXISTS idx_cafe_register_staff_id;

-- Rename columns in staff table
ALTER TABLE staff RENAME COLUMN staffID TO staffid;
ALTER TABLE staff ALTER COLUMN staffid TYPE int4;
ALTER TABLE staff ALTER COLUMN tag TYPE int4;

-- Update the cafeRegister table to match
ALTER TABLE cafeRegister RENAME COLUMN staffID TO staffid;
ALTER TABLE cafeRegister ALTER COLUMN staffid TYPE int4;

-- Recreate the foreign key constraint
ALTER TABLE cafeRegister ADD CONSTRAINT cafeRegister_staffid_fkey 
  FOREIGN KEY (staffid) REFERENCES staff(staffid) ON DELETE CASCADE;

-- Recreate indexes with new column names
CREATE INDEX IF NOT EXISTS idx_staff_tag ON staff(tag);
CREATE INDEX IF NOT EXISTS idx_cafe_register_staffid ON cafeRegister(staffid);

-- Clear existing sample data and insert new data with correct types
DELETE FROM cafeRegister;
DELETE FROM staff;

-- Insert sample data with integer IDs
INSERT INTO staff (staffid, staffName, tag, fingerprint_id) VALUES
  (1, 'John Doe', 1001, 'fp_001'),
  (2, 'Jane Smith', 1002, 'fp_002'),
  (3, 'Mike Johnson', 1003, 'fp_003'),
  (4, 'Sarah Wilson', 1004, 'fp_004')
ON CONFLICT (staffid) DO NOTHING;