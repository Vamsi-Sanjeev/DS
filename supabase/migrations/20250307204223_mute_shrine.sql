/*
  # Crisis Management System Database Schema

  1. New Tables
    - `risk_data`
      - `id` (uuid, primary key)
      - `timestamp` (timestamptz)
      - `financial_risk` (numeric)
      - `cyber_risk` (numeric)
      - `reputation_risk` (numeric)
      - `created_at` (timestamptz)
      - `user_id` (uuid, foreign key)

    - `simulation_questions`
      - `id` (uuid, primary key)
      - `question` (text)
      - `context` (text)
      - `options` (jsonb)
      - `correct_option` (text)
      - `feedback` (text)
      - `created_at` (timestamptz)

    - `user_responses`
      - `id` (uuid, primary key)
      - `user_id` (uuid)
      - `question_id` (uuid, foreign key)
      - `selected_option` (text)
      - `score` (integer)
      - `created_at` (timestamptz)

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users
*/

-- Risk Data Table
CREATE TABLE IF NOT EXISTS risk_data (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  timestamp timestamptz NOT NULL DEFAULT now(),
  financial_risk numeric NOT NULL,
  cyber_risk numeric NOT NULL,
  reputation_risk numeric NOT NULL,
  created_at timestamptz DEFAULT now(),
  user_id uuid REFERENCES auth.users(id)
);

ALTER TABLE risk_data ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read their own risk data"
  ON risk_data
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own risk data"
  ON risk_data
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Simulation Questions Table
CREATE TABLE IF NOT EXISTS simulation_questions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  question text NOT NULL,
  context text,
  options jsonb NOT NULL,
  correct_option text NOT NULL,
  feedback text,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE simulation_questions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read simulation questions"
  ON simulation_questions
  FOR SELECT
  TO authenticated
  USING (true);

-- User Responses Table
CREATE TABLE IF NOT EXISTS user_responses (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id),
  question_id uuid REFERENCES simulation_questions(id),
  selected_option text NOT NULL,
  score integer NOT NULL,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE user_responses ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read their own responses"
  ON user_responses
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own responses"
  ON user_responses
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);