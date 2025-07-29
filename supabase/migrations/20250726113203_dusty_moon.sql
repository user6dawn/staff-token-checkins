/*
  # Create Control Table

  1. New Tables
    - `control`
      - `id` (uuid, primary key)
      - `mode` (text, default 'register')
      - `staffid` (int4, foreign key to staff)
      - `created_at` (timestamp)

  2. Security
    - Enable RLS on control table
    - Add policies for public access
*/

-- Create control table
CREATE TABLE IF NOT EXISTS control (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  mode text DEFAULT 'register' NOT NULL,
  staffid int4 NOT NULL REFERENCES staff(staffid) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE control ENABLE ROW LEVEL SECURITY;

-- Policies for control table
CREATE POLICY "Allow public insert for control records"
  ON control
  FOR INSERT
  TO public
  WITH CHECK (true);

CREATE POLICY "Allow public read for control records"
  ON control
  FOR SELECT
  TO public
  USING (true);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_control_staffid ON control(staffid);
CREATE INDEX IF NOT EXISTS idx_control_mode ON control(mode);
CREATE INDEX IF NOT EXISTS idx_control_created_at ON control(created_at);