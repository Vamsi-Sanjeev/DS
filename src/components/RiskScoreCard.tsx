import React from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';
import { motion } from 'framer-motion';
import { cn } from '../lib/utils';

interface RiskScoreCardProps {
  title: string;
  score: number;
  trend: 'up' | 'down';
  change: number;
  icon: React.ElementType;
  color: 'red' | 'yellow' | 'green';
  className?: string;
}

const colorVariants = {
  red: 'bg-gradient-to-br from-red-50 to-rose-50 border-red-200',
  yellow: 'bg-gradient-to-br from-amber-50 to-yellow-50 border-yellow-200',
  green: 'bg-gradient-to-br from-emerald-50 to-green-50 border-green-200',
};

const scoreColorVariants = {
  red: 'text-red-700',
  yellow: 'text-amber-700',
  green: 'text-emerald-700',
};

export function RiskScoreCard({ 
  title, 
  score, 
  trend, 
  change, 
  icon: Icon,
  color,
  className 
}: RiskScoreCardProps) {
  // Update risk level thresholds
  const getRiskLevel = (score: number) => {
    if (score >= 60) return 'High';
    if (score >= 30) return 'Medium';
    return 'Low';
  };

  // Update color based on new thresholds
  const getColor = (score: number) => {
    if (score >= 60) return 'red';
    if (score >= 30) return 'yellow';
    return 'green';
  };

  const currentColor = getColor(score);
  const riskLevel = getRiskLevel(score);

  return (
    <motion.div
      whileHover={{ scale: 1.02, translateY: -5 }}
      transition={{ duration: 0.2 }}
      className={cn(
        "rounded-xl p-6 border shadow-sm transition-all duration-200",
        colorVariants[currentColor],
        className
      )}
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-gray-900 font-medium flex items-center">
          <Icon className="w-5 h-5 mr-2" />
          {title}
        </h3>
        <span className={cn(
          "text-sm font-medium px-3 py-1 rounded-full transition-colors",
          currentColor === 'red' ? 'bg-red-100/80 text-red-800' :
          currentColor === 'yellow' ? 'bg-amber-100/80 text-amber-800' :
          'bg-emerald-100/80 text-emerald-800'
        )}>
          {riskLevel} Risk
        </span>
      </div>
      
      <div className="flex items-baseline">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className={cn(
            "text-3xl font-bold",
            scoreColorVariants[currentColor]
          )}
        >
          {score}
        </motion.div>
        <span className={cn(
          "ml-2 flex items-center text-sm font-medium",
          trend === 'up' ? 'text-red-600' : 'text-emerald-600'
        )}>
          {trend === 'up' ? (
            <TrendingUp className="w-4 h-4 mr-1" />
          ) : (
            <TrendingDown className="w-4 h-4 mr-1" />
          )}
          {change}%
        </span>
      </div>

      <div className="mt-4 h-2.5 bg-white/50 rounded-full overflow-hidden shadow-inner">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${score}%` }}
          transition={{ duration: 1, ease: "easeOut" }}
          className={cn(
            "h-full rounded-full shadow-sm",
            currentColor === 'red' ? 'bg-gradient-to-r from-red-500 to-rose-500' :
            currentColor === 'yellow' ? 'bg-gradient-to-r from-amber-500 to-yellow-500' :
            'bg-gradient-to-r from-emerald-500 to-green-500'
          )}
        />
      </div>
    </motion.div>
  );
}