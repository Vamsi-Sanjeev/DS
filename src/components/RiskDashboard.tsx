import React, { useState, useEffect } from 'react';
import { RiskScoreCard } from './RiskScoreCard';
import { LiveDataPanel } from './LiveDataPanel';
import { CrisisTimeline } from './CrisisTimeline';
import { DataUploader } from './DataUploader';
import { motion } from 'framer-motion';
import { Shield, TrendingUp, AlertOctagon, Upload } from 'lucide-react';
import { getRiskData, type RiskData } from '../lib/supabase';

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 }
};

export function RiskDashboard() {
  const [riskData, setRiskData] = useState<RiskData[]>([]);
  const [showUploader, setShowUploader] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadRiskData();
    const interval = setInterval(loadRiskData, 30000);
    return () => clearInterval(interval);
  }, []);

  const loadRiskData = async () => {
    try {
      setError(null);
      const data = await getRiskData();
      if (data.length === 0) {
        setError('No risk data available. Please upload data to begin analysis.');
      }
      setRiskData(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load risk data');
      console.error('Failed to load risk data:', err);
    } finally {
      setLoading(false);
    }
  };

  const getLatestRiskScores = () => {
    if (riskData.length === 0) return { financial: 0, cyber: 0, reputation: 0 };
    
    const recentData = riskData.slice(-5);
    const avgScores = recentData.reduce((acc, curr) => ({
      financial: acc.financial + curr.financial_risk,
      cyber: acc.cyber + curr.cyber_risk,
      reputation: acc.reputation + curr.reputation_risk
    }), { financial: 0, cyber: 0, reputation: 0 });

    return {
      financial: Math.round(avgScores.financial / recentData.length),
      cyber: Math.round(avgScores.cyber / recentData.length),
      reputation: Math.round(avgScores.reputation / recentData.length)
    };
  };

  const calculateTrend = (metric: 'financial_risk' | 'cyber_risk' | 'reputation_risk') => {
    if (riskData.length < 2) return { trend: 'stable' as const, change: 0 };

    const recentData = riskData.slice(-5);
    if (recentData.length < 2) return { trend: 'stable' as const, change: 0 };

    const current = recentData[recentData.length - 1][metric];
    const previous = recentData[0][metric];
    const change = ((current - previous) / previous) * 100;

    return {
      trend: change > 0 ? 'up' as const : 'down' as const,
      change: Math.abs(Math.round(change))
    };
  };

  const latestScores = getLatestRiskScores();

  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="space-y-6"
    >
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Risk Overview</h1>
        <div className="flex items-center space-x-4">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setShowUploader(!showUploader)}
            className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
          >
            <Upload className="w-4 h-4 mr-2" />
            Upload Data
          </motion.button>
          <div className="flex items-center space-x-2 text-sm text-gray-500">
            <div className="flex items-center">
              <div className="w-3 h-3 rounded-full bg-green-500 mr-2"></div>
              Normal
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 rounded-full bg-yellow-500 mr-2"></div>
              Warning
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 rounded-full bg-red-500 mr-2"></div>
              Critical
            </div>
          </div>
        </div>
      </div>

      {error && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-amber-50 text-amber-800 p-4 rounded-lg mb-6 flex items-start"
        >
          <AlertOctagon className="w-5 h-5 mr-2 flex-shrink-0 mt-0.5" />
          <p>{error}</p>
        </motion.div>
      )}

      {showUploader && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="bg-white rounded-xl p-6 shadow-lg border border-gray-200"
        >
          <DataUploader onUploadSuccess={() => {
            loadRiskData();
            setShowUploader(false);
          }} />
        </motion.div>
      )}

      <motion.div variants={item} className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <RiskScoreCard
          title="Financial Risk"
          score={latestScores.financial}
          {...calculateTrend('financial_risk')}
          icon={TrendingUp}
          color={latestScores.financial >= 70 ? 'red' : latestScores.financial >= 40 ? 'yellow' : 'green'}
        />
        <RiskScoreCard
          title="Cyber Risk"
          score={latestScores.cyber}
          {...calculateTrend('cyber_risk')}
          icon={Shield}
          color={latestScores.cyber >= 70 ? 'red' : latestScores.cyber >= 40 ? 'yellow' : 'green'}
        />
        <RiskScoreCard
          title="Reputation Risk"
          score={latestScores.reputation}
          {...calculateTrend('reputation_risk')}
          icon={AlertOctagon}
          color={latestScores.reputation >= 70 ? 'red' : latestScores.reputation >= 40 ? 'yellow' : 'green'}
        />
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <motion.div variants={item} className="lg:col-span-2">
          <CrisisTimeline data={riskData} />
        </motion.div>
        <motion.div variants={item}>
          <LiveDataPanel />
        </motion.div>
      </div>
    </motion.div>
  );
}