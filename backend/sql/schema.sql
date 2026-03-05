-- Create patients table
CREATE TABLE IF NOT EXISTS patients (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  student_id VARCHAR(100),
  scenario_type VARCHAR(100),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create forms table (both in-hospital and out-of-hospital)
CREATE TABLE IF NOT EXISTS forms (
  id SERIAL PRIMARY KEY,
  patient_id INTEGER NOT NULL REFERENCES patients(id) ON DELETE CASCADE,
  form_type VARCHAR(100) NOT NULL, -- 'admission', 'assessment', 'discharge', etc.
  location VARCHAR(100) NOT NULL, -- 'hospital' or 'community'
  data JSONB, -- Flexible storage for form fields
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create index for faster queries
CREATE INDEX idx_forms_patient_id ON forms(patient_id);
CREATE INDEX idx_forms_created_at ON forms(created_at);
