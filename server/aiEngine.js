class AITrafficController {
  constructor() {
    this.decisionHistory = [];
    this.currentCapacity = {
      'Section A-B': 0.7,
      'Section B-C': 0.8,
      'Section C-D': 0.6,
      'Section A-C': 0.5,
      'Section B-D': 0.9
    };
  }

  generateDecision(train, allTrains) {
    const decision = {
      trainId: train.id,
      action: 'allow',
      reason: '',
      estimatedDelay: 0,
      confidence: 0.85,
      timestamp: new Date().toISOString()
    };

    // Priority-based decision making
    if (train.priority >= 8) {
      decision.action = 'allow';
      decision.reason = 'High priority express train - clear passage recommended';
      decision.confidence = 0.95;
    } else if (train.type === 'freight' && this.currentCapacity[train.current_section] > 0.8) {
      decision.action = 'hold';
      decision.reason = 'Section congested - hold freight train for passenger priority';
      decision.estimatedDelay = Math.floor(Math.random() * 15) + 5;
      decision.confidence = 0.88;
    } else if (train.delay > 20) {
      decision.action = 'reroute';
      decision.reason = 'Significant delay detected - alternative route recommended';
      decision.estimatedDelay = -Math.floor(Math.random() * 10) + 5;
      decision.confidence = 0.75;
    } else if (this.hasConflict(train, allTrains)) {
      decision.action = 'hold';
      decision.reason = 'Traffic conflict detected - temporary hold to optimize flow';
      decision.estimatedDelay = Math.floor(Math.random() * 10) + 3;
      decision.confidence = 0.82;
    }

    return decision;
  }

  hasConflict(train, allTrains) {
    return allTrains.some(otherTrain => 
      otherTrain.id !== train.id && 
      otherTrain.current_section === train.current_section &&
      otherTrain.status === 'running'
    );
  }

  generateSimulation(scenario) {
    const scenarios = {
      'priority_optimization': {
        improvedDelay: Math.floor(Math.random() * 15) + 5,
        throughputIncrease: Math.floor(Math.random() * 20) + 10,
        recommendations: [
          'Prioritize express trains during peak hours',
          'Implement dynamic track allocation',
          'Use predictive maintenance scheduling'
        ]
      },
      'route_optimization': {
        improvedDelay: Math.floor(Math.random() * 20) + 8,
        throughputIncrease: Math.floor(Math.random() * 25) + 15,
        recommendations: [
          'Activate alternative routes for freight',
          'Implement smart signal timing',
          'Use real-time capacity monitoring'
        ]
      },
      'capacity_expansion': {
        improvedDelay: Math.floor(Math.random() * 30) + 15,
        throughputIncrease: Math.floor(Math.random() * 40) + 25,
        recommendations: [
          'Add parallel tracks on high-traffic sections',
          'Upgrade signal systems for higher frequency',
          'Implement automated train control systems'
        ]
      }
    };

    return scenarios[scenario] || scenarios['priority_optimization'];
  }

  calculateKPIs(trains) {
    const totalTrains = trains.length;
    const onTimeTrains = trains.filter(train => train.delay <= 5).length;
    const onTimePerformance = (onTimeTrains / totalTrains) * 100;
    const averageDelay = trains.reduce((sum, train) => sum + train.delay, 0) / totalTrains;
    const completedJourneys = trains.filter(train => train.status === 'completed').length;
    
    // Simulate track utilization and throughput
    const trackUtilization = Math.floor(Math.random() * 30) + 60; // 60-90%
    const throughput = Math.floor(Math.random() * 50) + 150; // 150-200 trains/day

    return {
      totalTrains,
      onTimePerformance: Math.round(onTimePerformance * 100) / 100,
      averageDelay: Math.round(averageDelay * 100) / 100,
      trackUtilization,
      throughput,
      completedJourneys
    };
  }
}

module.exports = new AITrafficController();