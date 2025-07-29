/*
  # Staff Check-in System Schema

  1. New Tables
    - `staff`
      - `staffID` (uuid, primary key)
      - `staffName` (text, not null)
      - `tag` (text, unique, not null)
      - `fingerprint_id` (text, unique, nullable)
      - `created_at` (timestamp)
    
    - `cafeRegister`
      - `registerID` (uuid, primary key) 
      - `staffID` (uuid, foreign key to staff)
      - `timeCollected` (timestamp, default now())

  2. Security
    - Enable RLS on both tables
    - Add policies for authenticated access
    - Public read access for staff lookup by tag
*/

-- Create staff table
CREATE TABLE IF NOT EXISTS staff (
  staffID uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  staffName text NOT NULL,
  tag text UNIQUE NOT NULL,
  fingerprint_id text UNIQUE,
  created_at timestamptz DEFAULT now()
);

-- Create cafeRegister table  
CREATE TABLE IF NOT EXISTS cafeRegister (
  registerID uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  staffID uuid NOT NULL REFERENCES staff(staffID) ON DELETE CASCADE,
  timeCollected timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE staff ENABLE ROW LEVEL SECURITY;
ALTER TABLE cafeRegister ENABLE ROW LEVEL SECURITY;

-- Policies for staff table
CREATE POLICY "Allow public read access for staff lookup"
  ON staff
  FOR SELECT
  TO public
  USING (true);

-- Policies for cafeRegister table  
CREATE POLICY "Allow public insert for check-ins"
  ON cafeRegister
  FOR INSERT
  TO public
  WITH CHECK (true);

CREATE POLICY "Allow public read for check-ins"
  ON cafeRegister
  FOR SELECT
  TO public
  USING (true);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_staff_tag ON staff(tag);
CREATE INDEX IF NOT EXISTS idx_staff_fingerprint ON staff(fingerprint_id);
CREATE INDEX IF NOT EXISTS idx_cafe_register_staff_id ON cafeRegister(staffID);
CREATE INDEX IF NOT EXISTS idx_cafe_register_time ON cafeRegister(timeCollected);

-- Insert sample data
INSERT INTO staff (staffName, tag, fingerprint_id) VALUES
  ('John Doe', 'JD001', 'fp_001'),
  ('Jane Smith', 'JS002', 'fp_002'),
  ('Mike Johnson', 'MJ003', 'fp_003'),
  ('Sarah Wilson', 'SW004', 'fp_004')
ON CONFLICT (tag) DO NOTHING;