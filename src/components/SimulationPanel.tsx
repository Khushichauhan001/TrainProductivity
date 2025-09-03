import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Play, BarChart3, TrendingUp, TrendingDown } from 'lucide-react';
import { apiService } from '../services/api';
import { SimulationResult } from '../types';

export const SimulationPanel: React.FC = () => {
  const [selectedScenario, setSelectedScenario] = useState('priority_optimization');
  const [result, setResult] = useState<SimulationResult | null>(null);
  const [loading, setLoading] = useState(false);

  const scenarios = [
    {
      id: 'priority_optimization',
      title: 'Priority Optimization',
      description: 'Optimize train priorities based on passenger vs freight classification'
    },
    {
      id: 'route_optimization',
      title: 'Route Optimization',
      description: 'Find alternative routes to reduce congestion and delays'
    },
    {
      id: 'capacity_expansion',
      title: 'Capacity Expansion',
      description: 'Simulate the impact of adding additional tracks or signals'
    }
  ];

  const runSimulation = async () => {
    setLoading(true);
    try {
      const simulationResult = await apiService.runSimulation(selectedScenario);
      setResult(simulationResult);
    } catch (error) {
      console.error('Simulation failed:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Traffic Simulation</h2>
        <p className="text-gray-600">Run "what-if" scenarios to optimize train traffic flow</p>
      </div>

      {/* Scenario Selection */}
      <div className="bg-white rounded-xl shadow-md p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Select Scenario</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {scenarios.map((scenario) => (
            <motion.div
              key={scenario.id}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setSelectedScenario(scenario.id)}
              className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                selectedScenario === scenario.id
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <h4 className="font-semibold text-gray-800 mb-2">{scenario.title}</h4>
              <p className="text-sm text-gray-600">{scenario.description}</p>
            </motion.div>
          ))}
        </div>

        <div className="mt-6">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={runSimulation}
            disabled={loading}
            className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-green-500 text-white rounded-lg font-semibold hover:from-blue-600 hover:to-green-600 transition-all duration-200 disabled:opacity-50"
          >
            <Play size={16} />
            <span>{loading ? 'Running Simulation...' : 'Run Simulation'}</span>
          </motion.button>
        </div>
      </div>

      {/* Results */}
      {result && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl shadow-md p-6"
        >
          <h3 className="text-lg font-semibold text-gray-800 mb-6">Simulation Results</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <div className="flex items-center space-x-2 mb-2">
                <TrendingDown className="text-green-600" size={20} />
                <span className="text-green-800 font-semibold">Delay Reduction</span>
              </div>
              <div className="text-2xl font-bold text-green-700">
                -{result.improvedDelay} minutes
              </div>
              <p className="text-sm text-green-600">Average delay improvement</p>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-center space-x-2 mb-2">
                <TrendingUp className="text-blue-600" size={20} />
                <span className="text-blue-800 font-semibold">Throughput Increase</span>
              </div>
              <div className="text-2xl font-bold text-blue-700">
                +{result.throughputIncrease}%
              </div>
              <p className="text-sm text-blue-600">Daily throughput improvement</p>
            </div>
          </div>

          <div>
            <h4 className="font-semibold text-gray-800 mb-3">Recommendations</h4>
            <div className="space-y-2">
              {result.recommendations.map((recommendation, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg"
                >
                  <BarChart3 className="text-blue-500" size={16} />
                  <span className="text-gray-700">{recommendation}</span>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
};