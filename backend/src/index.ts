import express from 'express';
import cors from 'cors';
import sqlite3 from 'sqlite3';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

dotenv.config();

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();
const port = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Serve static files from frontend build
app.use(express.static(path.join(__dirname, '../../frontend/dist')));

// Database connection
const databasePath = process.env.DATABASE_PATH || path.join(__dirname, '../emr.db');
const db = new sqlite3.Database(databasePath, (err) => {
  if (err) {
    console.error('Database connection error:', err);
  } else {
    console.log('Connected to SQLite database');
  }
});

// Enable foreign keys and initialize schema
db.serialize(() => {
  db.run('PRAGMA foreign_keys = ON');

  // Initialize database schema if it doesn't exist
  const schema = fs.readFileSync(path.join(__dirname, '../sql/schema.sql'), 'utf-8');
  const statements = schema.split(';').filter(stmt => stmt.trim());

  for (const statement of statements) {
    if (statement.trim()) {
      db.run(statement.trim());
    }
  }
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

// Patient endpoints
app.get('/api/patients', (req, res) => {
  db.all('SELECT * FROM patients', (err, rows) => {
    if (err) {
      console.error(err);
      res.status(500).json({ error: 'Failed to fetch patients' });
    } else {
      res.json(rows || []);
    }
  });
});

app.post('/api/patients', (req, res) => {
  const { name, student_id, scenario_type } = req.body;
  const query = `INSERT INTO patients (name, student_id, scenario_type, created_at)
                 VALUES (?, ?, ?, CURRENT_TIMESTAMP)`;

  db.run(query, [name, student_id, scenario_type], function(err) {
    if (err) {
      console.error(err);
      res.status(500).json({ error: 'Failed to create patient' });
    } else {
      // Fetch the inserted row to return it
      db.get('SELECT * FROM patients WHERE id = ?', [this.lastID], (err, patient) => {
        if (err) {
          console.error(err);
          res.status(500).json({ error: 'Failed to fetch created patient' });
        } else {
          res.status(201).json(patient);
        }
      });
    }
  });
});

// EMR Form endpoints
app.get('/api/forms/:patient_id', (req, res) => {
  const { patient_id } = req.params;
  db.all(
    'SELECT * FROM forms WHERE patient_id = ? ORDER BY created_at DESC',
    [patient_id],
    (err, rows) => {
      if (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to fetch forms' });
      } else {
        res.json(rows || []);
      }
    }
  );
});

app.post('/api/forms', (req, res) => {
  const { patient_id, form_type, location, data } = req.body;
  const query = `INSERT INTO forms (patient_id, form_type, location, data, created_at)
                 VALUES (?, ?, ?, ?, CURRENT_TIMESTAMP)`;

  db.run(query, [patient_id, form_type, location, JSON.stringify(data)], function(err) {
    if (err) {
      console.error(err);
      res.status(500).json({ error: 'Failed to create form' });
    } else {
      // Fetch the inserted row to return it
      db.get('SELECT * FROM forms WHERE id = ?', [this.lastID], (err, form) => {
        if (err) {
          console.error(err);
          res.status(500).json({ error: 'Failed to fetch created form' });
        } else {
          res.status(201).json(form);
        }
      });
    }
  });
});

// Fallback to serve index.html for client-side routing
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../../frontend/dist/index.html'));
});

app.listen(port, () => {
  console.log(`EMR API server running on port ${port}`);
});
