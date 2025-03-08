import React, { useState } from 'react';
import { GamepadIcon, AlertCircle, CheckCircle2, ArrowRight, RotateCcw } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const scenarios = [
  {
    id: 1,
    title: 'Major Data Breach',
    description: 'A significant data breach has exposed customer information. How do you respond?',
    context: 'Your company\'s database has been compromised, potentially exposing sensitive customer data including names, emails, and encrypted passwords.',
    options: [
      { id: 'a', text: 'Immediately notify all customers', score: 8, feedback: 'Excellent choice! Quick transparency builds trust and complies with data protection regulations.' },
      { id: 'b', text: 'Investigate first, then notify', score: 5, feedback: 'Reasonable, but delayed notification could increase legal risks and damage trust.' },
      { id: 'c', text: 'Issue a press release only', score: 3, feedback: 'Poor choice. Direct customer communication is essential in data breach scenarios.' },
    ],
  },
  {
    id: 2,
    title: 'Product Safety Issue',
    description: 'A safety flaw has been discovered in your main product line. What action do you take?',
    context: 'Multiple customers have reported potential safety issues with your flagship product, with two minor incidents reported.',
    options: [
      { id: 'a', text: 'Immediate recall of all products', score: 7, feedback: 'Good choice! Safety first, though consider the cost impact.' },
      { id: 'b', text: 'Issue safety guidelines to customers', score: 4, feedback: 'This might not be sufficient if the risk is significant.' },
      { id: 'c', text: 'Internal review only', score: 2, feedback: 'Risky approach that could lead to more incidents and legal issues.' },
    ],
  },
  {
    id: 3,
    title: 'Ransomware Attack',
    description: 'Your systems have been hit by ransomware. What is your immediate response?',
    context: 'Critical systems are encrypted and attackers demand cryptocurrency payment. Customer data may be at risk.',
    options: [
      { id: 'a', text: 'Engage cybersecurity experts and refuse payment', score: 9, feedback: 'Excellent! This follows best practices and maintains integrity.' },
      { id: 'b', text: 'Negotiate with attackers', score: 3, feedback: 'Dangerous approach that could encourage future attacks.' },
      { id: 'c', text: 'Pay the ransom immediately', score: 1, feedback: 'Very risky and potentially illegal. No guarantee of data recovery.' },
    ],
  },
  {
    id: 4,
    title: 'Supply Chain Disruption',
    description: 'A major supplier has suddenly ceased operations. How do you handle this?',
    context: 'Your primary component supplier has declared bankruptcy, threatening production continuity.',
    options: [
      { id: 'a', text: 'Activate backup suppliers immediately', score: 8, feedback: 'Perfect! Having and using backup suppliers shows good risk management.' },
      { id: 'b', text: 'Wait for supplier resolution', score: 4, feedback: 'Passive approach that could severely impact operations.' },
      { id: 'c', text: 'Stockpile remaining inventory', score: 5, feedback: 'Short-term solution that doesn\'t address the core issue.' },
    ],
  },
  {
    id: 5,
    title: 'Employee Misconduct',
    description: 'Senior executive involved in ethical violation. What\'s your approach?',
    context: 'Evidence suggests a senior executive has been involved in financial misconduct.',
    options: [
      { id: 'a', text: 'Launch independent investigation', score: 9, feedback: 'Excellent! Shows commitment to transparency and accountability.' },
      { id: 'b', text: 'Handle internally without disclosure', score: 3, feedback: 'Lack of transparency could backfire and damage reputation.' },
      { id: 'c', text: 'Issue warning to executive', score: 2, feedback: 'Insufficient response to serious misconduct.' },
    ],
  }
];

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 },
};

export function CrisisSimulation() {
  const [currentScenario, setCurrentScenario] = useState(0);
  const [selectedOptions, setSelectedOptions] = useState<string[]>([]);
  const [showFeedback, setShowFeedback] = useState(false);
  const [totalScore, setTotalScore] = useState(0);
  const [showContext, setShowContext] = useState(false);

  const handleOptionSelect = (optionId: string) => {
    const newSelectedOptions = [...selectedOptions];
    newSelectedOptions[currentScenario] = optionId;
    setSelectedOptions(newSelectedOptions);

    const option = scenarios[currentScenario].options.find(opt => opt.id === optionId);
    if (option) {
      setTotalScore(prev => prev + option.score);
    }

    if (currentScenario < scenarios.length - 1) {
      setTimeout(() => {
        setCurrentScenario(prev => prev + 1);
        setShowContext(false);
      }, 500);
    } else {
      setShowFeedback(true);
    }
  };

  const resetSimulation = () => {
    setCurrentScenario(0);
    setSelectedOptions([]);
    setShowFeedback(false);
    setTotalScore(0);
    setShowContext(false);
  };

  const scenario = scenarios[currentScenario];
  const maxScore = scenarios.reduce((acc, s) => acc + Math.max(...s.options.map(o => o.score)), 0);
  const scorePercentage = (totalScore / maxScore) * 100;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-200">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-semibold text-gray-900 flex items-center">
              <GamepadIcon className="w-6 h-6 text-blue-600 mr-2" />
              Crisis Simulation Training
            </h2>
            <p className="text-sm text-gray-500 mt-1">Test your crisis management skills</p>
          </div>
        </div>

        <AnimatePresence mode="wait">
          {!showFeedback ? (
            <motion.div
              key="scenario"
              {...fadeInUp}
              className="space-y-6"
            >
              <div className="bg-blue-50 rounded-lg p-6">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-medium text-blue-900 text-lg">{scenario.title}</h3>
                    <p className="mt-2 text-blue-800">{scenario.description}</p>
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setShowContext(!showContext)}
                    className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                  >
                    {showContext ? 'Hide Context' : 'Show Context'}
                  </motion.button>
                </div>
                <AnimatePresence>
                  {showContext && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="mt-4 p-4 bg-white rounded-lg border border-blue-100"
                    >
                      <p className="text-gray-700">{scenario.context}</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <div className="space-y-3">
                {scenario.options.map((option) => (
                  <motion.button
                    key={option.id}
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.99 }}
                    onClick={() => handleOptionSelect(option.id)}
                    className="w-full text-left px-6 py-4 rounded-lg border hover:border-blue-500 hover:bg-blue-50 transition-colors flex items-center justify-between group"
                  >
                    <span>{option.text}</span>
                    <ArrowRight className="w-4 h-4 text-blue-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </motion.button>
                ))}
              </div>

              <div className="flex justify-between items-center mt-4">
                <span className="text-sm text-gray-500">
                  Scenario {currentScenario + 1} of {scenarios.length}
                </span>
                <div className="w-32 h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-blue-500 transition-all duration-300"
                    style={{ width: `${((currentScenario + 1) / scenarios.length) * 100}%` }}
                  />
                </div>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="feedback"
              {...fadeInUp}
              className="space-y-6"
            >
              <div className="bg-green-50 rounded-lg p-6 text-center">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 200, damping: 15 }}
                >
                  <CheckCircle2 className="w-16 h-16 text-green-500 mx-auto mb-4" />
                </motion.div>
                <h3 className="text-xl font-medium text-green-900">Simulation Complete!</h3>
                <div className="mt-4 flex justify-center">
                  <div className="relative w-32 h-32">
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-3xl font-bold text-green-700">
                        {Math.round(scorePercentage)}%
                      </span>
                    </div>
                    <svg className="transform -rotate-90 w-32 h-32">
                      <circle
                        cx="64"
                        cy="64"
                        r="60"
                        fill="none"
                        stroke="#E5E7EB"
                        strokeWidth="8"
                      />
                      <circle
                        cx="64"
                        cy="64"
                        r="60"
                        fill="none"
                        stroke="#22C55E"
                        strokeWidth="8"
                        strokeDasharray={`${scorePercentage * 3.77} 377`}
                      />
                    </svg>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h4 className="font-medium text-gray-900">Scenario Feedback:</h4>
                {scenarios.map((scenario, index) => {
                  const selectedOption = scenario.options.find(
                    opt => opt.id === selectedOptions[index]
                  );
                  return (
                    <div key={scenario.id} className="bg-white rounded-lg border p-4">
                      <h5 className="font-medium text-gray-800">{scenario.title}</h5>
                      <p className="text-sm text-gray-600 mt-1">Your choice: {selectedOption?.text}</p>
                      <p className="text-sm text-gray-600 mt-2">{selectedOption?.feedback}</p>
                    </div>
                  );
                })}
              </div>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={resetSimulation}
                className="w-full py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center justify-center"
              >
                <RotateCcw className="w-4 h-4 mr-2" />
                Try Again
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}