import React, { useState } from 'react';
import { Newspaper, ExternalLink, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface NewsItem {
  id: string;
  title: string;
  source: string;
  timestamp: string;
  priority: 'high' | 'medium' | 'low';
  url: string;
  content: string;
  impact: string;
  recommendations: string[];
}

const mockNews: NewsItem[] = [
  {
    id: '1',
    title: 'Global Supply Chain Disruption Affects Tech Industry',
    source: 'Reuters',
    timestamp: '2 hours ago',
    priority: 'high',
    url: '#',
    content: `A major disruption in the global supply chain is causing significant delays and increased costs across the technology industry. Multiple factors including geopolitical tensions, transportation bottlenecks, and raw material shortages have contributed to this crisis.

The impact is particularly severe in semiconductor manufacturing, affecting production schedules for various electronic devices and automotive components.`,
    impact: 'Potential 30% increase in component costs and 3-6 month delivery delays',
    recommendations: [
      'Diversify supplier network across multiple regions',
      'Increase safety stock levels for critical components',
      'Develop alternative sourcing strategies',
      'Review and update risk management protocols'
    ]
  },
  {
    id: '2',
    title: 'New Cybersecurity Threats Emerge in Financial Sector',
    source: 'Bloomberg',
    timestamp: '3 hours ago',
    priority: 'medium',
    url: '#',
    content: `Security researchers have identified a new strain of malware specifically targeting financial institutions. The sophisticated attack vector exploits previously unknown vulnerabilities in common banking software.

Initial reports suggest several institutions have already been targeted, though robust security measures have prevented any significant breaches so far.`,
    impact: 'Potential exposure of sensitive financial data and transaction systems',
    recommendations: [
      'Conduct immediate security audit of all systems',
      'Update all software to latest security patches',
      'Enhance monitoring of network activities',
      'Review incident response procedures'
    ]
  },
  {
    id: '3',
    title: 'Market Volatility Increases Due to Geopolitical Tensions',
    source: 'Financial Times',
    timestamp: '4 hours ago',
    priority: 'high',
    url: '#',
    content: `Global markets are experiencing increased volatility as geopolitical tensions rise in key regions. Major stock indices have shown significant fluctuations, with technology and energy sectors being particularly affected.

Analysts suggest this volatility might persist for several weeks as diplomatic efforts continue to address the underlying issues.`,
    impact: 'Market volatility affecting investment portfolios and business planning',
    recommendations: [
      'Review and adjust investment strategies',
      'Strengthen hedging positions',
      'Monitor international developments closely',
      'Prepare contingency plans for extended market instability'
    ]
  }
];

const priorityColors = {
  high: 'bg-red-100/80 text-red-800 border border-red-200',
  medium: 'bg-amber-100/80 text-amber-800 border border-amber-200',
  low: 'bg-emerald-100/80 text-emerald-800 border border-emerald-200'
};

export function LiveDataPanel() {
  const [selectedNews, setSelectedNews] = useState<NewsItem | null>(null);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-indigo-100"
    >
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-semibold text-gray-900 flex items-center">
            <Newspaper className="w-6 h-6 text-indigo-600 mr-2" />
            Live News Feed
          </h2>
          <p className="text-sm text-gray-500 mt-1">Real-time industry updates</p>
        </div>
      </div>

      <div className="space-y-4">
        {mockNews.map((news) => (
          <motion.div
            key={news.id}
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            whileHover={{ scale: 1.02, translateY: -2 }}
            className="bg-white rounded-lg p-4 shadow-sm border border-indigo-50 hover:shadow-md transition-all duration-200"
          >
            <div className="flex items-start justify-between">
              <div className="space-y-1">
                <div className="flex items-center space-x-2">
                  <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${priorityColors[news.priority]}`}>
                    {news.priority.charAt(0).toUpperCase() + news.priority.slice(1)} Priority
                  </span>
                  <span className="text-sm text-gray-500">{news.timestamp}</span>
                </div>
                <h3 className="font-medium text-gray-900 group-hover:text-indigo-600 transition-colors">
                  {news.title}
                </h3>
                <div className="flex items-center mt-2">
                  <span className="text-sm text-gray-600">{news.source}</span>
                  <button
                    onClick={() => setSelectedNews(news)}
                    className="ml-2 text-indigo-600 hover:text-indigo-800 inline-flex items-center text-sm font-medium"
                  >
                    Read more
                    <ExternalLink className="w-4 h-4 ml-1" />
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <AnimatePresence>
        {selectedNews && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
            onClick={() => setSelectedNews(null)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-xl p-6 max-w-2xl w-full max-h-[80vh] overflow-y-auto"
              onClick={e => e.stopPropagation()}
            >
              <div className="flex justify-between items-start mb-4">
                <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${priorityColors[selectedNews.priority]}`}>
                  {selectedNews.priority.charAt(0).toUpperCase() + selectedNews.priority.slice(1)} Priority
                </span>
                <button
                  onClick={() => setSelectedNews(null)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              
              <h2 className="text-xl font-semibold text-gray-900 mb-2">{selectedNews.title}</h2>
              
              <div className="flex items-center text-sm text-gray-500 mb-4">
                <span>{selectedNews.source}</span>
                <span className="mx-2">•</span>
                <span>{selectedNews.timestamp}</span>
              </div>

              <div className="prose max-w-none">
                <h3 className="text-lg font-medium text-gray-900 mb-2">Situation Overview</h3>
                <p className="text-gray-700 mb-4 whitespace-pre-line">{selectedNews.content}</p>

                <h3 className="text-lg font-medium text-gray-900 mb-2">Potential Impact</h3>
                <p className="text-gray-700 mb-4">{selectedNews.impact}</p>

                <h3 className="text-lg font-medium text-gray-900 mb-2">Recommended Actions</h3>
                <ul className="list-disc pl-5 space-y-2">
                  {selectedNews.recommendations.map((rec, index) => (
                    <li key={index} className="text-gray-700">{rec}</li>
                  ))}
                </ul>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}