/*
  # Update Employee Data RLS Policies

  1. Changes
    - Enable RLS for employee_data table
    - Add policies for authenticated and anonymous users
    - Allow authenticated users to insert and read their own data
    - Allow anonymous users to insert and read data

  2. Security
    - Authenticated users can only access their own data
    - Anonymous users can access all data (for demo purposes)
*/

-- Enable RLS
ALTER TABLE employee_data ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Users can insert their own employee data" ON employee_data;
DROP POLICY IF EXISTS "Users can read their own employee data" ON employee_data;
DROP POLICY IF EXISTS "Anyone can insert employee data" ON employee_data;
DROP POLICY IF EXISTS "Anyone can read employee data" ON employee_data;

-- Create new policies
CREATE POLICY "Anyone can insert employee data"
ON employee_data
FOR INSERT
TO anon
WITH CHECK (true);

CREATE POLICY "Anyone can read employee data"
ON employee_data
FOR SELECT
TO anon
USING (true);

CREATE POLICY "Users can insert their own employee data"
ON employee_data
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can read their own employee data"
ON employee_data
FOR SELECT
TO authenticated
USING (auth.uid() = user_id);