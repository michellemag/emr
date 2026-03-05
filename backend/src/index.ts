import express from 'express';
import cors from 'cors';
import { Pool } from 'pg';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

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
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

pool.on('error', (err) => {
  console.error('Unexpected error on idle client', err);
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

// Patient endpoints
app.get('/api/patients', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM patients');
    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch patients' });
  }
});

app.post('/api/patients', async (req, res) => {
  try {
    const { name, student_id, scenario_type } = req.body;
    const result = await pool.query(
      'INSERT INTO patients (name, student_id, scenario_type, created_at) VALUES ($1, $2, $3, NOW()) RETURNING *',
      [name, student_id, scenario_type]
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to create patient' });
  }
});

// EMR Form endpoints
app.get('/api/forms/:patient_id', async (req, res) => {
  try {
    const { patient_id } = req.params;
    const result = await pool.query(
      'SELECT * FROM forms WHERE patient_id = $1 ORDER BY created_at DESC',
      [patient_id]
    );
    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch forms' });
  }
});

app.post('/api/forms', async (req, res) => {
  try {
    const { patient_id, form_type, location, data } = req.body;
    const result = await pool.query(
      `INSERT INTO forms (patient_id, form_type, location, data, created_at)
       VALUES ($1, $2, $3, $4, NOW()) RETURNING *`,
      [patient_id, form_type, location, JSON.stringify(data)]
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to create form' });
  }
});

// Fallback to serve index.html for client-side routing
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../../frontend/dist/index.html'));
});

app.listen(port, () => {
  console.log(`EMR API server running on port ${port}`);
});
