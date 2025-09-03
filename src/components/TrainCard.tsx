import React from 'react';
import { motion } from 'framer-motion';
import { Train, Clock, AlertTriangle, CheckCircle, Pause } from 'lucide-react';
import { Train as TrainType } from '../types';

interface TrainCardProps {
  train: TrainType;
  onDecision?: (trainId: string, action: string) => void;
}

export const TrainCard: React.FC<TrainCardProps> = ({ train, onDecision }) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'running': return 'text-green-600 bg-green-50';
      case 'delayed': return 'text-red-600 bg-red-50';
      case 'on_hold': return 'text-yellow-600 bg-yellow-50';
      case 'completed': return 'text-blue-600 bg-blue-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'running': return <CheckCircle size={16} />;
      case 'delayed': return <AlertTriangle size={16} />;
      case 'on_hold': return <Pause size={16} />;
      case 'completed': return <CheckCircle size={16} />;
      default: return <Clock size={16} />;
    }
  };

  const getPriorityColor = (priority: number) => {
    if (priority >= 8) return 'bg-red-100 text-red-800';
    if (priority >= 6) return 'bg-yellow-100 text-yellow-800';
    return 'bg-green-100 text-green-800';
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4, boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)' }}
      className="bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-300 p-6 border border-gray-100"
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-gradient-to-r from-blue-500 to-green-500 rounded-lg">
            <Train className="text-white" size={20} />
          </div>
          <div>
            <h3 className="font-semibold text-gray-800">{train.name}</h3>
            <p className="text-sm text-gray-500">{train.id}</p>
          </div>
        </div>
        <span className={`px-2 py-1 rounded-full text-xs font-semibold ${getPriorityColor(train.priority)}`}>
          P{train.priority}
        </span>
      </div>

      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-600">Status:</span>
          <div className={`flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(train.status)}`}>
            {getStatusIcon(train.status)}
            <span className="capitalize">{train.status.replace('_', ' ')}</span>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-600">Current Section:</span>
          <span className="text-sm font-medium">{train.currentSection}</span>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-600">ETA:</span>
          <span className="text-sm font-medium">{train.eta}</span>
        </div>

        {train.delay > 0 && (
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">Delay:</span>
            <span className="text-sm font-medium text-red-600">+{train.delay} min</span>
          </div>
        )}

        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-600">Speed:</span>
          <span className="text-sm font-medium">{train.speed} km/h</span>
        </div>
      </div>

      <div className="mt-4 pt-4 border-t border-gray-100">
        <div className="text-xs text-gray-500 mb-2">Route Progress</div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className="bg-gradient-to-r from-blue-500 to-green-500 h-2 rounded-full transition-all duration-300"
            style={{ width: `${(train.currentPosition / train.route.length) * 100}%` }}
          ></div>
        </div>
        <div className="text-xs text-gray-500 mt-1">
          {train.currentPosition}/{train.route.length} stations
        </div>
      </div>

      {onDecision && train.status !== 'completed' && (
        <div className="mt-4 flex space-x-2">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => onDecision(train.id, 'allow')}
            className="flex-1 px-3 py-2 bg-green-100 text-green-700 rounded-lg text-xs font-medium hover:bg-green-200 transition-colors"
          >
            Allow
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => onDecision(train.id, 'hold')}
            className="flex-1 px-3 py-2 bg-yellow-100 text-yellow-700 rounded-lg text-xs font-medium hover:bg-yellow-200 transition-colors"
          >
            Hold
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => onDecision(train.id, 'reroute')}
            className="flex-1 px-3 py-2 bg-blue-100 text-blue-700 rounded-lg text-xs font-medium hover:bg-blue-200 transition-colors"
          >
            Reroute
          </motion.button>
        </div>
      )}
    </motion.div>
  );
};