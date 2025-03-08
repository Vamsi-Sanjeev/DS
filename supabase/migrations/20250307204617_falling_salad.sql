/*
  # Insert Initial Simulation Questions

  This migration adds initial simulation questions to test the crisis management system.
*/

INSERT INTO simulation_questions (question, context, options, correct_option, feedback)
VALUES
  (
    'A major data breach has exposed customer information. What is your immediate response?',
    'Your company''s database has been compromised, potentially exposing sensitive customer data including names, emails, and encrypted passwords.',
    '[
      {"id": "a", "text": "Immediately notify all affected customers", "score": 10, "feedback": "Excellent choice! Quick transparency builds trust and complies with data protection regulations."},
      {"id": "b", "text": "Investigate first, then notify selected customers", "score": 5, "feedback": "Partial investigation is good, but delayed notification could increase legal risks."},
      {"id": "c", "text": "Issue a general press release only", "score": 2, "feedback": "Poor choice. Direct customer communication is essential in data breach scenarios."}
    ]'::jsonb,
    'a',
    'Immediate notification allows customers to take protective actions and demonstrates transparency.'
  ),
  (
    'A critical system failure has caused service disruption. How do you proceed?',
    'Multiple core services are down affecting 80% of your customers. Initial assessment suggests a 4-hour minimum recovery time.',
    '[
      {"id": "a", "text": "Activate backup systems and notify all stakeholders", "score": 10, "feedback": "Perfect! Quick recovery and transparent communication are essential."},
      {"id": "b", "text": "Focus on technical recovery only", "score": 4, "feedback": "Technical recovery is important but stakeholder communication is crucial."},
      {"id": "c", "text": "Wait for full assessment before taking action", "score": 2, "feedback": "Delayed response can lead to greater customer dissatisfaction and reputation damage."}
    ]'::jsonb,
    'a',
    'Rapid response with clear communication helps maintain stakeholder trust during outages.'
  ),
  (
    'An employee has posted controversial comments on social media. What action do you take?',
    'A senior employee''s personal social media post has gone viral, potentially damaging company reputation.',
    '[
      {"id": "a", "text": "Issue immediate statement distancing company from comments", "score": 8, "feedback": "Good response to protect company reputation while addressing the issue."},
      {"id": "b", "text": "Conduct internal review before public response", "score": 10, "feedback": "Excellent! Balanced approach considering both internal policy and public relations."},
      {"id": "c", "text": "Ignore the situation", "score": 2, "feedback": "Ignoring the situation can lead to escalation and reputation damage."}
    ]'::jsonb,
    'b',
    'Balanced approach protects both employee rights and company reputation.'
  );