/*
  # Update RLS policies for anonymous access

  1. Changes
    - Enable anonymous access to risk_data table
    - Add policies for anonymous data access and insertion
    
  2. Security
    - Allow anonymous users to read and write risk data
    - Maintain basic security through anon key restrictions
*/

-- Update RLS policies for risk_data table
ALTER TABLE risk_data ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Anyone can read risk data" ON risk_data;
CREATE POLICY "Anyone can read risk data"
ON risk_data
FOR SELECT
TO anon
USING (true);

DROP POLICY IF EXISTS "Anyone can insert risk data" ON risk_data;
CREATE POLICY "Anyone can insert risk data"
ON risk_data
FOR INSERT
TO anon
WITH CHECK (true);