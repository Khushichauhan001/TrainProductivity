const express = require('express');
const { dbGet, dbAll, dbRun } = require('../database');
const aiEngine = require('../aiEngine');
const auth = require('../middleware/auth');
const router = express.Router();

router.get('/recommendations', auth, async (req, res) => {
  try {
    const trains = await dbAll('SELECT * FROM trains ORDER BY priority DESC');
    const recommendations = aiEngine.generateRecommendations(trains);
    
    res.json(recommendations);
  } catch (error) {
    res.status(500).json({ error: 'Failed to generate recommendations' });
  }
});

router.post('/simulate', (req, res) => {
  try {
    const { scenario = 'priority_optimization' } = req.body;
    const results = aiEngine.generateSimulation(scenario);
    
    const logId = `sim-${Date.now()}`;
    
    // Store simulation log
    await dbRun(`
      INSERT INTO simulation_logs (id, scenario, results, user_id)
      VALUES (?, ?, ?, ?)
    `, [logId, scenario, JSON.stringify(results), req.user.id]);

    res.json(results);
  } catch (error) {
    res.status(500).json({ error: 'Simulation failed' });
  }
});

router.get('/kpis', auth, async (req, res) => {
  try {
    const trains = await dbAll('SELECT * FROM trains');
    const decisions = await dbAll('SELECT * FROM decisions WHERE timestamp > datetime("now", "-1 day")');
    
    const kpis = aiEngine.calculateKPIs(trains, decisions);
    
    res.json(kpis);
  } catch (error) {
    res.status(500).json({ error: 'Failed to calculate KPIs' });
  }
});

module.exports = router;