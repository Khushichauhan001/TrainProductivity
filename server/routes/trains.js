const express = require('express');
const { dbGet, dbAll, dbRun } = require('../database');
const aiEngine = require('../aiEngine');
const { authenticateToken } = require('../middleware/auth');
const router = express.Router();

router.use(authenticateToken);

router.get('/', async (req, res) => {
  try {
    const trains = await dbAll(`
      SELECT * FROM trains 
      ORDER BY priority DESC, eta ASC
    `);

    const trainsWithParsedRoute = trains.map(train => ({
      ...train,
      route: JSON.parse(train.route)
    }));

    res.json(trainsWithParsedRoute);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch trains' });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const train = await dbGet('SELECT * FROM trains WHERE id = ?', [req.params.id]);
    
    if (!train) {
      return res.status(404).json({ error: 'Train not found' });
    }

    res.json({
      ...train,
      route: JSON.parse(train.route)
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch train' });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;
    
    const updateFields = [];
    const values = [];
    
    Object.keys(updates).forEach(key => {
      if (key === 'route' && Array.isArray(updates[key])) {
        updateFields.push('route = ?');
        values.push(JSON.stringify(updates[key]));
      } else if (key !== 'id') {
        updateFields.push(`${key} = ?`);
        values.push(updates[key]);
      }
    });
    
    if (updateFields.length === 0) {
      return res.status(400).json({ error: 'No valid fields to update' });
    }
    
    updateFields.push('updated_at = CURRENT_TIMESTAMP');
    values.push(id);
    
    const query = `UPDATE trains SET ${updateFields.join(', ')} WHERE id = ?`;
    const result = await dbRun(query, values);
    
    if (result.changes === 0) {
      return res.status(404).json({ error: 'Train not found' });
    }
    
    const updatedTrain = await dbGet('SELECT * FROM trains WHERE id = ?', [id]);
    res.json({
      ...updatedTrain,
      route: JSON.parse(updatedTrain.route)
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update train' });
  }
});

router.post('/decision', async (req, res) => {
  try {
    const { trainId, action, reason } = req.body;
    
    if (!trainId || !action) {
      return res.status(400).json({ error: 'Train ID and action required' });
    }

    const train = await dbGet('SELECT * FROM trains WHERE id = ?', [trainId]);
    if (!train) {
      return res.status(404).json({ error: 'Train not found' });
    }

    const allTrains = await dbAll('SELECT * FROM trains');
    const decision = aiEngine.generateDecision(train, allTrains);
    
    // Store decision in database
    const decisionId = 'decision-' + Date.now();
    await dbRun(`
      INSERT INTO decisions (id, train_id, action, reason, estimated_delay, confidence, user_id)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `, [
      decisionId,
      decision.trainId,
      decision.action,
      reason || decision.reason,
      decision.estimatedDelay,
      decision.confidence,
      req.user.userId
    ]);

    res.json(decision);
  } catch (error) {
    res.status(500).json({ error: 'Failed to process decision' });
  }
});

module.exports = router;