/*
  # Employee Risk Tracking Schema

  1. New Tables
    - `employee_data`
      - `id` (uuid, primary key)
      - `timestamp` (timestamptz)
      - `workload` (numeric) - Workload level (0-100)
      - `satisfaction` (numeric) - Employee satisfaction level (0-100)
      - `resignation_risk` (numeric) - Calculated resignation risk (0-100)
      - `department` (text) - Department name
      - `created_at` (timestamptz)
      - `user_id` (uuid) - Reference to users table

  2. Security
    - Enable RLS on employee_data table
    - Add policies for authenticated users
*/

CREATE TABLE IF NOT EXISTS employee_data (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  timestamp timestamptz NOT NULL DEFAULT now(),
  workload numeric NOT NULL CHECK (workload >= 0 AND workload <= 100),
  satisfaction numeric NOT NULL CHECK (satisfaction >= 0 AND satisfaction <= 100),
  resignation_risk numeric NOT NULL CHECK (resignation_risk >= 0 AND resignation_risk <= 100),
  department text NOT NULL,
  created_at timestamptz DEFAULT now(),
  user_id uuid REFERENCES auth.users(id)
);

ALTER TABLE employee_data ENABLE ROW LEVEL SECURITY;

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