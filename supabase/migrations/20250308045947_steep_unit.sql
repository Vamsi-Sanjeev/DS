/*
  # Crisis Prediction System Schema

  1. New Tables
    - `risk_data`: Stores historical risk data
      - `id` (uuid, primary key)
      - `timestamp` (timestamptz)
      - `financial_risk` (numeric, 0-100)
      - `cyber_risk` (numeric, 0-100)
      - `reputation_risk` (numeric, 0-100)
      - `created_at` (timestamptz)
      - `user_id` (uuid, foreign key)

    - `prediction_data`: Stores AI-generated predictions
      - `id` (uuid, primary key)
      - `timestamp` (timestamptz)
      - `financial_risk` (numeric, 0-100)
      - `cyber_risk` (numeric, 0-100)
      - `reputation_risk` (numeric, 0-100)
      - `created_at` (timestamptz)
      - `user_id` (uuid, foreign key)

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users to read/write their own data
    - Add policies for anonymous users to read public data
*/

-- Create risk_data table if it doesn't exist
CREATE TABLE IF NOT EXISTS risk_data (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  timestamp timestamptz NOT NULL DEFAULT now(),
  financial_risk numeric NOT NULL CHECK (financial_risk >= 0 AND financial_risk <= 100),
  cyber_risk numeric NOT NULL CHECK (cyber_risk >= 0 AND cyber_risk <= 100),
  reputation_risk numeric NOT NULL CHECK (reputation_risk >= 0 AND reputation_risk <= 100),
  created_at timestamptz DEFAULT now(),
  user_id uuid REFERENCES auth.users(id)
);

-- Enable RLS for risk_data
ALTER TABLE risk_data ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DO $$ 
BEGIN
  DROP POLICY IF EXISTS "Anyone can insert risk data" ON risk_data;
  DROP POLICY IF EXISTS "Anyone can read risk data" ON risk_data;
  DROP POLICY IF EXISTS "Users can insert their own risk data" ON risk_data;
  DROP POLICY IF EXISTS "Users can read their own risk data" ON risk_data;
END $$;

-- Create policies for risk_data
CREATE POLICY "Anyone can insert risk data"
  ON risk_data
  FOR INSERT
  TO anon
  WITH CHECK (true);

CREATE POLICY "Anyone can read risk data"
  ON risk_data
  FOR SELECT
  TO anon
  USING (true);

CREATE POLICY "Users can insert their own risk data"
  ON risk_data
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can read their own risk data"
  ON risk_data
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

-- Create prediction_data table if it doesn't exist
CREATE TABLE IF NOT EXISTS prediction_data (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  timestamp timestamptz NOT NULL DEFAULT now(),
  financial_risk numeric NOT NULL CHECK (financial_risk >= 0 AND financial_risk <= 100),
  cyber_risk numeric NOT NULL CHECK (cyber_risk >= 0 AND cyber_risk <= 100),
  reputation_risk numeric NOT NULL CHECK (reputation_risk >= 0 AND reputation_risk <= 100),
  created_at timestamptz DEFAULT now(),
  user_id uuid REFERENCES auth.users(id)
);

-- Enable RLS for prediction_data
ALTER TABLE prediction_data ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DO $$ 
BEGIN
  DROP POLICY IF EXISTS "Users can insert their own prediction data" ON prediction_data;
  DROP POLICY IF EXISTS "Users can read their own prediction data" ON prediction_data;
END $$;

-- Create policies for prediction_data
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

-- Create indexes for better query performance
DROP INDEX IF EXISTS risk_data_timestamp_idx;
DROP INDEX IF EXISTS risk_data_user_id_idx;
DROP INDEX IF EXISTS prediction_data_timestamp_idx;
DROP INDEX IF EXISTS prediction_data_user_id_idx;

CREATE INDEX risk_data_timestamp_idx ON risk_data (timestamp);
CREATE INDEX risk_data_user_id_idx ON risk_data (user_id);
CREATE INDEX prediction_data_timestamp_idx ON prediction_data (timestamp);
CREATE INDEX prediction_data_user_id_idx ON prediction_data (user_id);