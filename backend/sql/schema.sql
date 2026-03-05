-- Create patients table
CREATE TABLE IF NOT EXISTS patients (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  student_id TEXT,
  scenario_type TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Create forms table (both in-hospital and out-of-hospital)
CREATE TABLE IF NOT EXISTS forms (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  patient_id INTEGER NOT NULL,
  form_type TEXT NOT NULL, -- 'admission', 'assessment', 'discharge', etc.
  location TEXT NOT NULL, -- 'hospital' or 'community'
  data TEXT, -- Flexible storage for form fields (JSON)
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY(patient_id) REFERENCES patients(id) ON DELETE CASCADE
);

-- Enable foreign keys (SQLite requires this)
PRAGMA foreign_keys = ON;

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_forms_patient_id ON forms(patient_id);
CREATE INDEX IF NOT EXISTS idx_forms_created_at ON forms(created_at);
