export interface Train {
  id: string;
  name: string;
  type: 'passenger' | 'freight' | 'express';
  priority: number;
  currentSection: string;
  status: 'running' | 'delayed' | 'on_hold' | 'completed';
  eta: string;
  delay: number;
  route: string[];
  currentPosition: number;
  speed: number;
}

export interface AIDecision {
  trainId: string;
  action: 'allow' | 'hold' | 'reroute';
  reason: string;
  estimatedDelay: number;
  confidence: number;
  timestamp: string;
}

export interface KPIs {
  totalTrains: number;
  onTimePerformance: number;
  averageDelay: number;
  trackUtilization: number;
  throughput: number;
  completedJourneys: number;
}

export interface SimulationResult {
  scenario: string;
  improvedDelay: number;
  throughputIncrease: number;
  recommendations: string[];
}

export interface User {
  id: string;
  username: string;
  role: 'operator' | 'admin';
}