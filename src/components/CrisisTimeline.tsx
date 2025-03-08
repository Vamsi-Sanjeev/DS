import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart, Legend } from 'recharts';
import { motion } from 'framer-motion';
import { format } from 'date-fns';
import type { RiskData } from '../lib/supabase';

interface CrisisTimelineProps {
  data: RiskData[];
}

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
  const { cx, cy, stroke, dataKey } = props;

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

export function CrisisTimeline({ data }: CrisisTimelineProps) {
  const chartData = data.map(item => ({
    timestamp: new Date(item.timestamp).getTime(),
    Financial: item.financial_risk,
    Cyber: item.cyber_risk,
    Reputation: item.reputation_risk
  }));

  if (data.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-xl p-6 shadow-lg border border-gray-200 flex items-center justify-center h-[400px]"
      >
        <p className="text-gray-500">No data available. Please upload risk data to view the timeline.</p>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-xl p-6 shadow-lg border border-gray-200"
    >
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-semibold text-gray-900">Crisis Risk Timeline</h2>
          <p className="text-sm text-gray-500 mt-1">Risk score trends over time</p>
        </div>
      </div>

      <div className="h-[400px]">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData}>
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
            <CartesianGrid 
              strokeDasharray="3 3" 
              stroke="#E5E7EB" 
              opacity={0.5}
            />
            <XAxis 
              dataKey="timestamp"
              type="number"
              domain={['dataMin', 'dataMax']}
              tickFormatter={(value) => format(value, 'HH:mm')}
              stroke="#6B7280"
              tick={{ fill: '#6B7280', fontSize: 12 }}
            />
            <YAxis 
              stroke="#6B7280"
              domain={[0, 100]}
              tickFormatter={(value) => `${value}%`}
              tick={{ fill: '#6B7280', fontSize: 12 }}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend 
              verticalAlign="top" 
              height={36}
              iconType="circle"
              iconSize={10}
              wrapperStyle={{ paddingBottom: '20px' }}
            />
            <Area 
              type="monotone" 
              dataKey="Financial" 
              stroke="#3B82F6" 
              fill="url(#financialGradient)"
              strokeWidth={2}
              dot={<CustomizedDot />}
              activeDot={{ r: 6, strokeWidth: 3 }}
            />
            <Area 
              type="monotone" 
              dataKey="Cyber" 
              stroke="#4F46E5" 
              fill="url(#cyberGradient)"
              strokeWidth={2}
              dot={<CustomizedDot />}
              activeDot={{ r: 6, strokeWidth: 3 }}
            />
            <Area 
              type="monotone" 
              dataKey="Reputation" 
              stroke="#10B981" 
              fill="url(#reputationGradient)"
              strokeWidth={2}
              dot={<CustomizedDot />}
              activeDot={{ r: 6, strokeWidth: 3 }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  );
}