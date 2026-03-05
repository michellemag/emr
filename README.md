# EMR System - Victoria University

A web-based Electronic Medical Record (EMR) system for medical students at Victoria University to practice filling out medical forms in simulated scenarios.

## Features

- **Patient Management**: Create simulated patients with different scenarios
- **Multiple Scenarios**: Standard cases, pregnant patients, aged care, eating disorders
- **Dual-Location Support**: In-hospital and out-of-hospital/community forms
- **Flexible Forms**: Admission, Assessment, Vital Signs, Discharge Summary
- **Form History**: View all forms created for each patient
- **Simple & Extensible**: Clean architecture for adding new features

## Quick Start

### Prerequisites
- Node.js 18+
- PostgreSQL 12+
- npm or yarn

### Installation

1. **Clone and setup dependencies**
   ```bash
   npm run install-all
   ```

2. **Setup PostgreSQL Database**
   ```bash
   # Create database and user
   createdb emr_db
   createuser -P emr_user  # Enter password when prompted

   # Load schema
   psql emr_db -U emr_user -f backend/sql/schema.sql
   ```

3. **Configure environment**
   ```bash
   cp backend/.env.example backend/.env
   # Edit backend/.env with your PostgreSQL credentials
   ```

4. **Start development servers**
   ```bash
   npm run dev
   ```
   - Backend: http://localhost:3001
   - Frontend: http://localhost:3000

## Usage

1. **Create a Patient**
   - Click "Create New Patient"
   - Enter patient name, student ID, and scenario type
   - Patient is created with a unique ID

2. **Fill Out Forms**
   - Click "Open EMR" on a patient card
   - Click "+ New Form" to create a form
   - Select form type (Admission, Assessment, etc.) and location
   - Fill in the form fields
   - Save the form

3. **View Form History**
   - All forms for a patient are listed on the EMR view
   - Click "View Details" to see form content

## Project Structure

```
├── backend/           # Express.js API server
│   ├── src/
│   │   └── index.ts   # Main API endpoints
│   ├── sql/
│   │   └── schema.sql # Database schema
│   └── package.json
├── frontend/          # React.js application
│   ├── src/
│   │   ├── App.tsx
│   │   ├── components/
│   │   │   ├── PatientForm.tsx
│   │   │   ├── PatientList.tsx
│   │   │   └── FormBuilder.tsx
│   │   └── index.css
│   └── package.json
└── package.json       # Root package (monorepo)
```

## Available Scenario Types

- **Standard Case**: Regular patient assessment
- **Pregnant Student**: Pregnancy-related medical scenarios
- **Aged Care**: Elderly patient care scenarios
- **Eating Disorder**: Eating disorder related assessments

## Form Types

- **Admission**: Initial patient admission form
- **Assessment**: Patient assessment and evaluation
- **Vital Signs**: Vital signs recording
- **Discharge**: Discharge summary

## Development

### Run Tests
```bash
npm test --workspace backend
```

### Build for Production
```bash
npm run build
```

### Backend API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/health` | Health check |
| GET | `/api/patients` | List all patients |
| POST | `/api/patients` | Create new patient |
| GET | `/api/forms/:patient_id` | Get forms for patient |
| POST | `/api/forms` | Create new form |

## Future Enhancements

- User authentication (student/instructor login)
- Form validation and templates
- PDF export of forms
- Scenario-specific form templates
- Grading/feedback system for instructors
- Real patient data anonymization compliance
- Mobile app support
- Form versioning and snapshots

## Database Schema

### patients
```sql
id (PRIMARY KEY)
name (VARCHAR)
student_id (VARCHAR)
scenario_type (VARCHAR)
created_at (TIMESTAMP)
```

### forms
```sql
id (PRIMARY KEY)
patient_id (FOREIGN KEY -> patients)
form_type (VARCHAR)
location (VARCHAR: 'hospital' or 'community')
data (JSONB - flexible form content)
created_at (TIMESTAMP)
updated_at (TIMESTAMP)
```

## License

MIT

## Support

For documentation and setup guidance, see [CLAUDE.md](./CLAUDE.md)
