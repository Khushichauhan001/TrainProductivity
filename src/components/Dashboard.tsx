import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Train, 
  Brain, 
  BarChart3, 
  Settings, 
  LogOut,
  Activity,
  Clock,
  TrendingUp,
  Users,
  Gauge,
  Target
} from 'lucide-react';
import { TrainCard } from './TrainCard';
import { KPICard } from './KPICard';
import { RecommendationCard } from './RecommendationCard';
import { SimulationPanel } from './SimulationPanel';
import { apiService } from '../services/api';
import { Train as TrainType, AIDecision, KPIs } from '../types';

interface DashboardProps {
  user: any;
  onLogout: () => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ user, onLogout }) => {
  const [trains, setTrains] = useState<TrainType[]>([]);
  const [recommendations, setRecommendations] = useState<AIDecision[]>([]);
  const [kpis, setKPIs] = useState<KPIs | null>(null);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
    
    // Set up real-time updates
    const interval = setInterval(loadData, 30000); // Update every 30 seconds
    return () => clearInterval(interval);
  }, []);

  const loadData = async () => {
    try {
      const [trainsData, recommendationsData, kpisData] = await Promise.all([
        apiService.getTrains(),
        apiService.getRecommendations(),
        apiService.getKPIs()
      ]);
      
      setTrains(trainsData);
      setRecommendations(recommendationsData);
      setKPIs(kpisData);
    } catch (error) {
      console.error('Failed to load data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDecision = async (trainId: string, action: string) => {
    try {
      await apiService.makeDecision(trainId, action);
      loadData(); // Reload data after decision
    } catch (error) {
      console.error('Failed to make decision:', error);
    }
  };

  const handleApplyRecommendation = async (decision: AIDecision) => {
    try {
      await apiService.makeDecision(decision.trainId, decision.action, decision.reason);
      loadData();
    } catch (error) {
      console.error('Failed to apply recommendation:', error);
    }
  };

  const tabs = [
    { id: 'dashboard', label: 'Dashboard', icon: BarChart3 },
    { id: 'trains', label: 'Trains', icon: Train },
    { id: 'ai', label: 'AI Recommendations', icon: Brain },
    { id: 'simulation', label: 'Simulation', icon: Activity }
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            className="inline-block p-4 bg-gradient-to-r from-blue-500 to-green-500 rounded-full mb-4"
          >
            <Train className="text-white" size={32} />
          </motion.div>
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-4">
              <div className="p-2 bg-gradient-to-r from-blue-500 to-green-500 rounded-lg">
                <Train className="text-white" size={24} />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">AI Train Traffic Controller</h1>
                <p className="text-sm text-gray-600">Welcome back, {user.username}</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-sm text-gray-600">
                Role: <span className="font-medium">{user.role}</span>
              </div>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={onLogout}
                className="flex items-center space-x-2 px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors"
              >
                <LogOut size={16} />
                <span>Logout</span>
              </motion.button>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation */}
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-8">
            {tabs.map((tab) => (
              <motion.button
                key={tab.id}
                whileHover={{ y: -2 }}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 py-4 px-2 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <tab.icon size={16} />
                <span>{tab.label}</span>
              </motion.button>
            ))}
          </div>
        </div>
      </nav>

      {/* Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <AnimatePresence mode="wait">
          {activeTab === 'dashboard' && (
            <motion.div
              key="dashboard"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-8"
            >
              {/* KPIs */}
              {kpis && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6">
                  <KPICard
                    title="Total Trains"
                    value={kpis.totalTrains}
                    icon={Train}
                    color="blue"
                  />
                  <KPICard
                    title="On-Time Performance"
                    value={`${kpis.onTimePerformance}%`}
                    icon={Target}
                    trend="up"
                    trendValue="2.1%"
                    color="green"
                  />
                  <KPICard
                    title="Average Delay"
                    value={`${kpis.averageDelay}m`}
                    icon={Clock}
                    trend="down"
                    trendValue="1.5m"
                    color="yellow"
                  />
                  <KPICard
                    title="Track Utilization"
                    value={`${kpis.trackUtilization}%`}
                    icon={Gauge}
                    color="blue"
                  />
                  <KPICard
                    title="Daily Throughput"
                    value={kpis.throughput}
                    icon={TrendingUp}
                    trend="up"
                    trendValue="5%"
                    color="green"
                  />
                  <KPICard
                    title="Completed Journeys"
                    value={kpis.completedJourneys}
                    icon={Users}
                    color="blue"
                  />
                </div>
              )}

              {/* Quick Overview */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2">
                  <h2 className="text-xl font-semibold text-gray-800 mb-4">Active Trains</h2>
                  <div className="grid gap-4">
                    {trains.slice(0, 4).map((train, index) => (
                      <motion.div
                        key={train.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                      >
                        <TrainCard train={train} onDecision={handleDecision} />
                      </motion.div>
                    ))}
                  </div>
                </div>
                
                <div>
                  <h2 className="text-xl font-semibold text-gray-800 mb-4">Latest Recommendations</h2>
                  <div className="space-y-4">
                    {recommendations.slice(0, 3).map((rec, index) => (
                      <motion.div
                        key={`${rec.trainId}-${rec.timestamp}`}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                      >
                        <RecommendationCard 
                          decision={rec} 
                          onApply={handleApplyRecommendation}
                        />
                      </motion.div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'trains' && (
            <motion.div
              key="trains"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-6"
            >
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-gray-800">All Trains</h2>
                <div className="text-sm text-gray-600">
                  Total: {trains.length} trains
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {trains.map((train, index) => (
                  <motion.div
                    key={train.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <TrainCard train={train} onDecision={handleDecision} />
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}

          {activeTab === 'ai' && (
            <motion.div
              key="ai"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-6"
            >
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-gray-800">AI Recommendations</h2>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={loadData}
                  className="px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg font-medium hover:from-purple-600 hover:to-pink-600 transition-all duration-200"
                >
                  Refresh Recommendations
                </motion.button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {recommendations.map((rec, index) => (
                  <motion.div
                    key={`${rec.trainId}-${rec.timestamp}`}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <RecommendationCard 
                      decision={rec} 
                      onApply={handleApplyRecommendation}
                    />
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}

          {activeTab === 'simulation' && (
            <motion.div
              key="simulation"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <SimulationPanel />
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
};