import React from 'react';
import { motion } from 'framer-motion';
import { Brain, CheckCircle, Clock, Route } from 'lucide-react';
import { AIDecision } from '../types';

interface RecommendationCardProps {
  decision: AIDecision;
  onApply?: (decision: AIDecision) => void;
}

export const RecommendationCard: React.FC<RecommendationCardProps> = ({ decision, onApply }) => {
  const getActionColor = (action: string) => {
    switch (action) {
      case 'allow': return 'text-green-700 bg-green-100 border-green-200';
      case 'hold': return 'text-yellow-700 bg-yellow-100 border-yellow-200';
      case 'reroute': return 'text-blue-700 bg-blue-100 border-blue-200';
      default: return 'text-gray-700 bg-gray-100 border-gray-200';
    }
  };

  const getActionIcon = (action: string) => {
    switch (action) {
      case 'allow': return <CheckCircle size={16} />;
      case 'hold': return <Clock size={16} />;
      case 'reroute': return <Route size={16} />;
      default: return <Brain size={16} />;
    }
  };

  const confidencePercentage = Math.round(decision.confidence * 100);

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      whileHover={{ scale: 1.02 }}
      className="bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-300 p-6 border border-gray-100"
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg">
            <Brain className="text-white" size={20} />
          </div>
          <div>
            <h3 className="font-semibold text-gray-800">AI Recommendation</h3>
            <p className="text-sm text-gray-500">Train {decision.trainId}</p>
          </div>
        </div>
        <div className="text-right">
          <div className="text-xs text-gray-500">Confidence</div>
          <div className="text-sm font-semibold text-gray-800">{confidencePercentage}%</div>
        </div>
      </div>

      <div className="mb-4">
        <div className={`inline-flex items-center space-x-2 px-3 py-2 rounded-lg border ${getActionColor(decision.action)}`}>
          {getActionIcon(decision.action)}
          <span className="font-medium capitalize">{decision.action}</span>
        </div>
      </div>

      <div className="mb-4">
        <p className="text-sm text-gray-700 leading-relaxed">{decision.reason}</p>
      </div>

      {decision.estimatedDelay !== 0 && (
        <div className="mb-4 p-3 bg-gray-50 rounded-lg">
          <div className="text-xs text-gray-500 mb-1">Impact</div>
          <div className={`text-sm font-medium ${decision.estimatedDelay > 0 ? 'text-red-600' : 'text-green-600'}`}>
            {decision.estimatedDelay > 0 ? '+' : ''}{decision.estimatedDelay} minutes
          </div>
        </div>
      )}

      <div className="flex items-center justify-between">
        <div className="text-xs text-gray-500">
          {new Date(decision.timestamp).toLocaleTimeString()}
        </div>
        {onApply && (
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => onApply(decision)}
            className="px-4 py-2 bg-gradient-to-r from-blue-500 to-green-500 text-white text-sm font-medium rounded-lg hover:from-blue-600 hover:to-green-600 transition-all duration-200"
          >
            Apply
          </motion.button>
        )}
      </div>
    </motion.div>
  );
};