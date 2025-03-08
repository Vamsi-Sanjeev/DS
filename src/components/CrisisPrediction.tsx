import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Activity, AlertCircle, TrendingUp, Shield, Upload } from 'lucide-react';
import { format } from 'date-fns';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { getPredictionData, subscribeToPredictionData, uploadPredictionData, type PredictionData } from '../lib/supabase';

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white p-4 rounded-lg shadow-lg border border-gray-200">
        <p className="font-medium text-gray-900 mb-2">{format(new Date(label), 'MMM d, yyyy HH:mm')}</p>
        {payload.map((entry: any) => (
          <div
            key={entry.name}
            className="flex items-center space-x-2 mb-1"
          >
            <div 
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: entry.color }}
            />
            <p className="text-sm" style={{ color: entry.color }}>
              {entry.name}: {entry.value}%
            </p>
          </div>
        ))}
      </div>
    );
  }
  return null;
};

const CustomizedDot = (props: any) => {
  const { cx, cy, stroke } = props;

  return (
    <circle
      cx={cx}
      cy={cy}
      r={4}
      stroke={stroke}
      strokeWidth={2}
      fill="white"
      className="transition-all duration-300 hover:r-6"
    />
  );
};

export function CrisisPrediction() {
  const [data, setData] = useState<PredictionData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showUploader, setShowUploader] = useState(false);

  useEffect(() => {
    loadPredictionData();

    // Subscribe to real-time updates
    const unsubscribe = subscribeToPredictionData((newData) => {
      setData(newData);
    });

    return () => {
      unsubscribe();
    };
  }, []);

  const loadPredictionData = async () => {
    try {
      setError(null);
      const predictionData = await getPredictionData();
      setData(predictionData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load prediction data');
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = async (file: File) => {
    try {
      setError(null);
      setLoading(true);
      await uploadPredictionData(file);
      await loadPredictionData();
      setShowUploader(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to upload prediction data');
    } finally {
      setLoading(false);
    }
  };

  const getLatestRisks = () => {
    if (data.length === 0) return { financial: 0, cyber: 0, reputation: 0 };
    const latest = data[data.length - 1];
    return {
      financial: latest.financial_risk,
      cyber: latest.cyber_risk,
      reputation: latest.reputation_risk
    };
  };

  const latestRisks = getLatestRisks();

  if (loading) {
    return (
      <div className="min-h-[600px] flex items-center justify-center">
        <div className="text-center">
          <Activity className="w-8 h-8 text-indigo-600 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading prediction data...</p>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Crisis Prediction</h1>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => setShowUploader(!showUploader)}
          className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
        >
          <Upload className="w-4 h-4 mr-2" />
          Upload Data
        </motion.button>
      </div>

      {error && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-red-50 text-red-800 p-4 rounded-lg mb-6 flex items-start"
        >
          <AlertCircle className="w-5 h-5 mr-2 flex-shrink-0 mt-0.5" />
          <p className="text-sm">{error}</p>
        </motion.div>
      )}

      {showUploader && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="bg-white rounded-xl p-6 shadow-lg border border-gray-200"
        >
          <div className="bg-indigo-50 rounded-lg p-4 mb-4">
            <h3 className="text-sm font-medium text-indigo-800 mb-2">CSV Format Requirements:</h3>
            <div className="text-xs text-indigo-700 space-y-1">
              <p>• First row must contain headers: timestamp, financial_risk, cyber_risk, reputation_risk</p>
              <p>• Timestamp format: YYYY-MM-DDTHH:mm:ss (e.g., 2024-03-01T00:00:00)</p>
              <p>• Risk values must be numbers between 0 and 100</p>
            </div>
          </div>

          <input
            type="file"
            accept=".csv"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) handleFileUpload(file);
            }}
            className="block w-full text-sm text-gray-500
              file:mr-4 file:py-2 file:px-4
              file:rounded-full file:border-0
              file:text-sm file:font-semibold
              file:bg-indigo-50 file:text-indigo-700
              hover:file:bg-indigo-100"
          />
        </motion.div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <motion.div
          whileHover={{ scale: 1.02 }}
          className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-100"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-blue-600">Financial Risk Prediction</p>
              <h3 className="text-2xl font-bold text-gray-900 mt-2">{latestRisks.financial}%</h3>
            </div>
            <TrendingUp className="w-8 h-8 text-blue-600" />
          </div>
        </motion.div>

        <motion.div
          whileHover={{ scale: 1.02 }}
          className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-xl p-6 border border-indigo-100"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-indigo-600">Cyber Risk Prediction</p>
              <h3 className="text-2xl font-bold text-gray-900 mt-2">{latestRisks.cyber}%</h3>
            </div>
            <Shield className="w-8 h-8 text-indigo-600" />
          </div>
        </motion.div>

        <motion.div
          whileHover={{ scale: 1.02 }}
          className="bg-gradient-to-br from-emerald-50 to-green-50 rounded-xl p-6 border border-emerald-100"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-emerald-600">Reputation Risk Prediction</p>
              <h3 className="text-2xl font-bold text-gray-900 mt-2">{latestRisks.reputation}%</h3>
            </div>
            <Activity className="w-8 h-8 text-emerald-600" />
          </div>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-xl p-6 shadow-lg border border-gray-200"
      >
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-semibold text-gray-900 flex items-center">
              <Activity className="w-6 h-6 text-indigo-600 mr-2" />
              Risk Prediction Trends
            </h2>
            <p className="text-sm text-gray-500 mt-1">AI-powered risk prediction analysis</p>
          </div>
        </div>

        <div className="h-[400px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data}>
              <defs>
                <linearGradient id="financialGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#3B82F6" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="cyberGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#4F46E5" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#4F46E5" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="reputationGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10B981" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#10B981" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" opacity={0.5} />
              <XAxis
                dataKey="timestamp"
                tickFormatter={(value) => format(new Date(value), 'HH:mm')}
                stroke="#6B7280"
                tick={{ fill: '#6B7280', fontSize: 12 }}
              />
              <YAxis
                stroke="#6B7280"
                tick={{ fill: '#6B7280', fontSize: 12 }}
                domain={[0, 100]}
                tickFormatter={(value) => `${value}%`}
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend
                verticalAlign="top"
                height={36}
                iconType="circle"
                iconSize={10}
                wrapperStyle={{ paddingBottom: '20px' }}
              />
              <Line
                type="monotone"
                dataKey="financial_risk"
                name="Financial Risk"
                stroke="#3B82F6"
                strokeWidth={2}
                dot={<CustomizedDot />}
                activeDot={{ r: 6, strokeWidth: 3 }}
              />
              <Line
                type="monotone"
                dataKey="cyber_risk"
                name="Cyber Risk"
                stroke="#4F46E5"
                strokeWidth={2}
                dot={<CustomizedDot />}
                activeDot={{ r: 6, strokeWidth: 3 }}
              />
              <Line
                type="monotone"
                dataKey="reputation_risk"
                name="Reputation Risk"
                stroke="#10B981"
                strokeWidth={2}
                dot={<CustomizedDot />}
                activeDot={{ r: 6, strokeWidth: 3 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </motion.div>
    </motion.div>
  );
}