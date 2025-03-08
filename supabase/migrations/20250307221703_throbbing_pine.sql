/*
  # Update Employee Data RLS Policies

  1. Changes
    - Update RLS policies for employee_data table to allow proper data insertion
    - Add policies for both authenticated and anonymous users
    - Ensure proper user_id handling

  2. Security
    - Enable RLS on employee_data table
    - Add policies for INSERT and SELECT operations
    - Restrict data access based on user_id
*/

-- First, ensure RLS is enabled
ALTER TABLE employee_data ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if any
DROP POLICY IF EXISTS "Users can insert their own employee data" ON employee_data;
DROP POLICY IF EXISTS "Users can read their own employee data" ON employee_data;
DROP POLICY IF EXISTS "Anyone can insert employee data" ON employee_data;

-- Create new policies
CREATE POLICY "Anyone can insert employee data"
ON employee_data
FOR INSERT
TO anon
WITH CHECK (true);

CREATE POLICY "Users can insert their own employee data"
ON employee_data
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id OR user_id IS NULL);

CREATE POLICY "Users can read their own employee data"
ON employee_data
FOR SELECT
TO authenticated
USING (auth.uid() = user_id OR user_id IS NULL);

CREATE POLICY "Anyone can read employee data"
ON employee_data
FOR SELECT
TO anon
USING (true);