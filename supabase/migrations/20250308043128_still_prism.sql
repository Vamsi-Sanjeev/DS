/*
  # Add prediction data table

  1. New Tables
    - `prediction_data`
      - `id` (uuid, primary key)
      - `timestamp` (timestamptz)
      - `financial_risk` (numeric)
      - `cyber_risk` (numeric)
      - `reputation_risk` (numeric)
      - `created_at` (timestamptz)
      - `user_id` (uuid, foreign key to users)

  2. Security
    - Enable RLS on `prediction_data` table
    - Add policies for authenticated users to read their own data
    - Add policies for authenticated users to insert their own data
*/

CREATE TABLE IF NOT EXISTS prediction_data (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  timestamp timestamptz NOT NULL DEFAULT now(),
  financial_risk numeric NOT NULL CHECK (financial_risk >= 0 AND financial_risk <= 100),
  cyber_risk numeric NOT NULL CHECK (cyber_risk >= 0 AND cyber_risk <= 100),
  reputation_risk numeric NOT NULL CHECK (reputation_risk >= 0 AND reputation_risk <= 100),
  created_at timestamptz DEFAULT now(),
  user_id uuid REFERENCES auth.users(id)
);

ALTER TABLE prediction_data ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can insert their own prediction data"
  ON prediction_data
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can read their own prediction data"
  ON prediction_data
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);