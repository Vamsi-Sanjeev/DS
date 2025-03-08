import React, { useState, useEffect } from 'react';
import { Users, TrendingUp, AlertCircle, Building2, UserCheck, DollarSign, Upload, Shield } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend, LineChart, Line } from 'recharts';
import { motion, AnimatePresence } from 'framer-motion';
import { EmployeeDataUploader } from './EmployeeDataUploader';
import { getEmployeeData, type EmployeeData } from '../lib/supabase';

const COLORS = ['#4F46E5', '#0EA5E9', '#10B981', '#F59E0B', '#EF4444'];

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white p-4 rounded-lg shadow-lg border border-gray-200">
        <p className="font-medium text-gray-900 mb-2">{label}</p>
        {payload.map((entry: any) => (
          <div
            key={entry.dataKey}
            className="flex items-center space-x-2 mb-1"
          >
            <div 
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: entry.color }}
            />
            <p className="text-sm" style={{ color: entry.color }}>
              {entry.name}: {entry.value}
            </p>
          </div>
        ))}
      </div>
    );
  }
  return null;
};

const CustomBar = (props: any) => {
  const { x, y, width, height, fill } = props;
  const radius = 6;

  return (
    <g>
      <rect
        x={x}
        y={y}
        width={width}
        height={height}
        fill={fill}
        rx={radius}
        ry={radius}
        className="transition-all duration-300 hover:opacity-80"
      />
    </g>
  );
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

export function EmployeeRisk() {
  const [employeeData, setEmployeeData] = useState<EmployeeData[]>([]);
  const [showUploader, setShowUploader] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadEmployeeData();
    const interval = setInterval(loadEmployeeData, 30000);
    return () => clearInterval(interval);
  }, []);

  const loadEmployeeData = async () => {
    try {
      const data = await getEmployeeData();
      setEmployeeData(data);
    } catch (error) {
      console.error('Failed to load employee data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getLatestMetrics = () => {
    if (employeeData.length === 0) {
      return {
        avgWorkload: 0,
        avgSatisfaction: 0,
        avgResignationRisk: 0,
        totalEmployees: 0,
        departmentCount: 0
      };
    }

    const recentData = employeeData.slice(-5);
    const metrics = recentData.reduce((acc, curr) => ({
      workload: acc.workload + curr.workload,
      satisfaction: acc.satisfaction + curr.satisfaction,
      resignationRisk: acc.resignationRisk + curr.resignation_risk
    }), { workload: 0, satisfaction: 0, resignationRisk: 0 });

    const departments = new Set(employeeData.map(d => d.department));

    return {
      avgWorkload: Math.round(metrics.workload / recentData.length),
      avgSatisfaction: Math.round(metrics.satisfaction / recentData.length),
      avgResignationRisk: Math.round(metrics.resignationRisk / recentData.length),
      totalEmployees: employeeData.length,
      departmentCount: departments.size
    };
  };

  const metrics = getLatestMetrics();

  const departmentData = employeeData.reduce((acc, curr) => {
    const existing = acc.find(d => d.department === curr.department);
    if (existing) {
      existing.employees = (existing.employees || 0) + 1;
      existing.avgResignationRisk = Math.round(
        ((existing.avgResignationRisk * (existing.employees - 1)) + curr.resignation_risk) / existing.employees
      );
    } else {
      acc.push({
        department: curr.department,
        employees: 1,
        avgResignationRisk: curr.resignation_risk
      });
    }
    return acc;
  }, [] as any[]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Employee Risk Analysis</h1>
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

      {showUploader && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="bg-white rounded-xl p-6 shadow-lg border border-gray-200"
        >
          <EmployeeDataUploader onUploadSuccess={() => {
            loadEmployeeData();
            setShowUploader(false);
          }} />
        </motion.div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <motion.div
          whileHover={{ scale: 1.02 }}
          className="bg-gradient-to-br from-indigo-50 to-blue-50 rounded-xl p-6 border border-indigo-100 shadow-sm"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-indigo-600">Average Workload</p>
              <h3 className="text-2xl font-bold text-gray-900 mt-2">{metrics.avgWorkload}%</h3>
            </div>
            <TrendingUp className="w-8 h-8 text-indigo-600" />
          </div>
        </motion.div>

        <motion.div
          whileHover={{ scale: 1.02 }}
          className="bg-gradient-to-br from-blue-50 to-sky-50 rounded-xl p-6 border border-blue-100 shadow-sm"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-blue-600">Satisfaction Level</p>
              <h3 className="text-2xl font-bold text-gray-900 mt-2">{metrics.avgSatisfaction}%</h3>
            </div>
            <UserCheck className="w-8 h-8 text-blue-600" />
          </div>
        </motion.div>

        <motion.div
          whileHover={{ scale: 1.02 }}
          className="bg-gradient-to-br from-red-50 to-rose-50 rounded-xl p-6 border border-red-100 shadow-sm"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-red-600">Resignation Risk</p>
              <h3 className="text-2xl font-bold text-gray-900 mt-2">{metrics.avgResignationRisk}%</h3>
            </div>
            <AlertCircle className="w-8 h-8 text-red-600" />
          </div>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl p-6 shadow-lg border border-gray-200"
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold">Department Risk Analysis</h2>
            <Building2 className="w-6 h-6 text-indigo-600" />
          </div>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={departmentData}>
                <defs>
                  {COLORS.map((color, index) => (
                    <linearGradient
                      key={`gradient-${index}`}
                      id={`barGradient-${index}`}
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >
                      <stop offset="0%" stopColor={color} stopOpacity={0.8} />
                      <stop offset="100%" stopColor={color} stopOpacity={0.3} />
                    </linearGradient>
                  ))}
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" opacity={0.5} />
                <XAxis 
                  dataKey="department" 
                  stroke="#6B7280"
                  tick={{ fill: '#6B7280', fontSize: 12 }}
                />
                <YAxis 
                  stroke="#6B7280"
                  tick={{ fill: '#6B7280', fontSize: 12 }}
                />
                <Tooltip content={<CustomTooltip />} />
                <Legend />
                <Bar 
                  dataKey="avgResignationRisk" 
                  fill="url(#barGradient-0)"
                  name="Resignation Risk"
                  shape={<CustomBar />}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl p-6 shadow-lg border border-gray-200"
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold">Risk Trends</h2>
            <TrendingUp className="w-6 h-6 text-indigo-600" />
          </div>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={employeeData.slice(-30)}>
                <defs>
                  <linearGradient id="workloadGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#4F46E5" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#4F46E5" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="satisfactionGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10B981" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#10B981" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="resignationGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#EF4444" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#EF4444" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" opacity={0.5} />
                <XAxis 
                  dataKey="timestamp" 
                  stroke="#6B7280"
                  tickFormatter={(value) => new Date(value).toLocaleDateString()}
                  tick={{ fill: '#6B7280', fontSize: 12 }}
                />
                <YAxis 
                  stroke="#6B7280"
                  tick={{ fill: '#6B7280', fontSize: 12 }}
                />
                <Tooltip content={<CustomTooltip />} />
                <Legend />
                <Line 
                  type="monotone" 
                  dataKey="workload" 
                  stroke="#4F46E5"
                  strokeWidth={2}
                  name="Workload"
                  dot={<CustomizedDot />}
                  activeDot={{ r: 6, strokeWidth: 3 }}
                />
                <Line 
                  type="monotone" 
                  dataKey="satisfaction" 
                  stroke="#10B981"
                  strokeWidth={2}
                  name="Satisfaction"
                  dot={<CustomizedDot />}
                  activeDot={{ r: 6, strokeWidth: 3 }}
                />
                <Line 
                  type="monotone" 
                  dataKey="resignation_risk" 
                  stroke="#EF4444"
                  strokeWidth={2}
                  name="Resignation Risk"
                  dot={<CustomizedDot />}
                  activeDot={{ r: 6, strokeWidth: 3 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-xl p-6 shadow-lg border border-gray-200"
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold">Risk Mitigation Strategies</h2>
          <Shield className="w-6 h-6 text-indigo-600" />
        </div>
        <div className="grid md:grid-cols-3 gap-4">
          {metrics.avgResignationRisk >= 60 && (
            <motion.div
              whileHover={{ scale: 1.02, translateY: -5 }}
              className="bg-red-50 rounded-lg p-6 border border-red-100"
            >
              <AlertCircle className="w-8 h-8 text-red-600 mb-4" />
              <h3 className="font-medium text-gray-900 mb-2">High Risk Alert</h3>
              <p className="text-sm text-gray-600">
                Immediate attention required. Schedule one-on-one meetings and review workload distribution.
              </p>
            </motion.div>
          )}
          {metrics.avgWorkload >= 70 && (
            <motion.div
              whileHover={{ scale: 1.02, translateY: -5 }}
              className="bg-amber-50 rounded-lg p-6 border border-amber-100"
            >
              <TrendingUp className="w-8 h-8 text-amber-600 mb-4" />
              <h3 className="font-medium text-gray-900 mb-2">High Workload</h3>
              <p className="text-sm text-gray-600">
                Consider hiring additional staff or redistributing tasks to prevent burnout.
              </p>
            </motion.div>
          )}
          {metrics.avgSatisfaction <= 40 && (
            <motion.div
              whileHover={{ scale: 1.02, translateY: -5 }}
              className="bg-blue-50 rounded-lg p-6 border border-blue-100"
            >
              <UserCheck className="w-8 h-8 text-blue-600 mb-4" />
              <h3 className="font-medium text-gray-900 mb-2">Low Satisfaction</h3>
              <p className="text-sm text-gray-600">
                Conduct employee surveys and implement feedback-driven improvements.
              </p>
            </motion.div>
          )}
        </div>
      </motion.div>
    </div>
  );
}