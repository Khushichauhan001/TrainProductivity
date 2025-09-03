const sqlite3 = require('sqlite3').verbose();
const bcrypt = require('bcryptjs');

// Create in-memory database
const db = new sqlite3.Database(':memory:');

// Promisify database methods
const dbRun = (sql, params = []) => {
  return new Promise((resolve, reject) => {
    db.run(sql, params, function(err) {
      if (err) reject(err);
      else resolve({ id: this.lastID, changes: this.changes });
    });
  });
};

const dbGet = (sql, params = []) => {
  return new Promise((resolve, reject) => {
    db.get(sql, params, (err, row) => {
      if (err) reject(err);
      else resolve(row);
    });
  });
};

const dbAll = (sql, params = []) => {
  return new Promise((resolve, reject) => {
    db.all(sql, params, (err, rows) => {
      if (err) reject(err);
      else resolve(rows);
    });
  });
};

// Initialize database
const initDatabase = async () => {
  try {
    // Create tables
    await dbRun(`
      CREATE TABLE IF NOT EXISTS users (
        id TEXT PRIMARY KEY,
        username TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL,
        role TEXT DEFAULT 'operator',
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);

    await dbRun(`
      CREATE TABLE IF NOT EXISTS trains (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        type TEXT NOT NULL,
        priority INTEGER NOT NULL,
        current_section TEXT NOT NULL,
        status TEXT NOT NULL,
        eta TEXT NOT NULL,
        delay INTEGER DEFAULT 0,
        route TEXT NOT NULL,
        current_position INTEGER DEFAULT 0,
        speed INTEGER DEFAULT 60,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);

    await dbRun(`
      CREATE TABLE IF NOT EXISTS decisions (
        id TEXT PRIMARY KEY,
        train_id TEXT NOT NULL,
        action TEXT NOT NULL,
        reason TEXT NOT NULL,
        estimated_delay INTEGER NOT NULL,
        confidence REAL NOT NULL,
        timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
        user_id TEXT,
        FOREIGN KEY (train_id) REFERENCES trains (id),
        FOREIGN KEY (user_id) REFERENCES users (id)
      )
    `);

    await dbRun(`
      CREATE TABLE IF NOT EXISTS simulation_logs (
        id TEXT PRIMARY KEY,
        scenario TEXT NOT NULL,
        results TEXT NOT NULL,
        timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
        user_id TEXT,
        FOREIGN KEY (user_id) REFERENCES users (id)
      )
    `);

    // Create default users
    const adminPassword = bcrypt.hashSync('admin123', 10);
    const operatorPassword = bcrypt.hashSync('operator123', 10);

    await dbRun(`
      INSERT OR REPLACE INTO users (id, username, password, role)
      VALUES (?, ?, ?, ?)
    `, ['admin-1', 'admin', adminPassword, 'admin']);

    await dbRun(`
      INSERT OR REPLACE INTO users (id, username, password, role)
      VALUES (?, ?, ?, ?)
    `, ['operator-1', 'operator', operatorPassword, 'operator']);

    // Sample train data
    const sampleTrains = [
      {
        id: 'train-001',
        name: 'Rajdhani Express',
        type: 'express',
        priority: 9,
        currentSection: 'Section A-B',
        status: 'running',
        eta: '14:30',
        delay: 5,
        route: JSON.stringify(['Mumbai Central', 'Borivali', 'Virar', 'Vapi', 'Surat']),
        currentPosition: 2,
        speed: 85
      },
      {
        id: 'train-002',
        name: 'Shatabdi Express',
        type: 'express',
        priority: 8,
        currentSection: 'Section B-C',
        status: 'running',
        eta: '15:45',
        delay: 0,
        route: JSON.stringify(['New Delhi', 'Ghaziabad', 'Aligarh', 'Kanpur', 'Lucknow']),
        currentPosition: 3,
        speed: 90
      },
      {
        id: 'train-003',
        name: 'Goods Train 12345',
        type: 'freight',
        priority: 4,
        currentSection: 'Section C-D',
        status: 'on_hold',
        eta: '16:20',
        delay: 15,
        route: JSON.stringify(['Chennai Central', 'Arakkonam', 'Katpadi', 'Bangalore']),
        currentPosition: 1,
        speed: 45
      },
      {
        id: 'train-004',
        name: 'Jan Shatabdi',
        type: 'passenger',
        priority: 6,
        currentSection: 'Section A-C',
        status: 'delayed',
        eta: '17:10',
        delay: 25,
        route: JSON.stringify(['Pune', 'Lonavala', 'Mumbai CST']),
        currentPosition: 1,
        speed: 65
      },
      {
        id: 'train-005',
        name: 'Duronto Express',
        type: 'express',
        priority: 9,
        currentSection: 'Section B-D',
        status: 'running',
        eta: '18:00',
        delay: 0,
        route: JSON.stringify(['Kolkata', 'Asansol', 'Dhanbad', 'Gaya', 'New Delhi']),
        currentPosition: 4,
        speed: 95
      }
    ];

    for (const train of sampleTrains) {
      await dbRun(`
        INSERT OR REPLACE INTO trains (id, name, type, priority, current_section, status, eta, delay, route, current_position, speed)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `, [
        train.id,
        train.name,
        train.type,
        train.priority,
        train.currentSection,
        train.status,
        train.eta,
        train.delay,
        train.route,
        train.currentPosition,
        train.speed
      ]);
    }

    console.log('✅ Database initialized successfully');
  } catch (error) {
    console.error('❌ Database initialization failed:', error);
    throw error;
  }
};

// Export database methods
module.exports = {
  db,
  dbRun,
  dbGet,
  dbAll,
  initDatabase
};