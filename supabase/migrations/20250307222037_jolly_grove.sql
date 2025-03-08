/*
  # Disable RLS for Employee Data Table

  1. Changes
    - Disable Row Level Security for employee_data table
    - Remove existing RLS policies

  2. Security
    - WARNING: This removes row-level security restrictions
    - All users will have full access to the table
*/

-- Drop existing policies
DROP POLICY IF EXISTS "Users can insert their own employee data" ON employee_data;
DROP POLICY IF EXISTS "Users can read their own employee data" ON employee_data;
DROP POLICY IF EXISTS "Anyone can insert employee data" ON employee_data;
DROP POLICY IF EXISTS "Anyone can read employee data" ON employee_data;

-- Disable RLS
ALTER TABLE employee_data DISABLE ROW LEVEL SECURITY;