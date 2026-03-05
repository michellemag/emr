# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

EMR System is a web application for Victoria University medical students to practice filling out Electronic Medical Records. The system supports both in-hospital and out-of-hospital scenarios with various patient types (pregnant, aged care, eating disorder, standard cases).

**Tech Stack:**
- Backend: Node.js with Express + TypeScript
- Frontend: React + TypeScript with Vite
- Database: PostgreSQL
- Monorepo structure using npm workspaces

## Development Commands

### Initial Setup
```bash
# Clone and install dependencies
npm run install-all

# Setup environment variables
cp backend/.env.example backend/.env
# Edit backend/.env with local PostgreSQL credentials
```

### Database Setup
```bash
# Create PostgreSQL database
createdb emr_db

# Create user (if needed)
createuser -P emr_user  # password: password (for dev only)

# Load schema
psql emr_db -U emr_user -f backend/sql/schema.sql
```

### Development
```bash
# Run both backend and frontend (from root)
npm run dev

# OR run separately:
npm run dev --workspace backend    # Port 3001
npm run dev --workspace frontend   # Port 3000
```

### Build
```bash
npm run build
```

### Run Tests
```bash
npm test --workspace backend
```

## Architecture Overview

### Project Structure
```
emr/
├── backend/           # Express API server
│   ├── src/
│   │   └── index.ts   # Main server file with API endpoints
│   └── sql/
│       └── schema.sql # Database schema
├── frontend/          # React application
│   ├── src/
│   │   ├── App.tsx           # Main app component
│   │   └── components/       # React components
│   └── index.html    # Entry point
└── package.json       # Root package.json (workspaces)
```

### Database Design

**patients** table: Stores patient records with scenario type
- `id`, `name`, `student_id`, `scenario_type`, `created_at`

**forms** table: Stores EMR forms (flexible JSON structure)
- `id`, `patient_id`, `form_type`, `location`, `data` (JSONB), `created_at`, `updated_at`
- form_type: 'admission', 'assessment', 'vital_signs', 'discharge'
- location: 'hospital' or 'community'

### Data Flow

1. Student creates a simulated patient (with scenario type)
2. Student opens patient and creates forms (admission, assessment, etc.)
3. Forms are stored with flexible JSON data structure
4. Forms can be viewed/edited with full history

## Common Development Tasks

### Adding a New Form Type
1. Add option to `FORM_TYPES` in `frontend/src/components/FormBuilder.tsx`
2. Form will automatically appear in the form type dropdown

### Adding Scenario Types
1. Update `SCENARIO_TYPES` in `frontend/src/components/PatientForm.tsx`
2. Update logic in FormBuilder if special handling is needed

### Adding Database Fields
1. Modify `backend/sql/schema.sql`
2. Create migration or run schema updates
3. Update TypeScript interfaces in backend/frontend as needed

### API Endpoints
- `GET /health` - Health check
- `GET /api/patients` - List all patients
- `POST /api/patients` - Create patient
- `GET /api/forms/:patient_id` - Get forms for patient
- `POST /api/forms` - Create new form

## Extension Points

The JSON structure in the `forms.data` field is flexible and can be extended:
- Currently: `chief_complaint`, `medical_history`, `current_medications`, `physical_exam`, `notes`
- Can add specialized fields per scenario type
- Can validate/process differently based on `form_type` and `scenario_type`

## Frontend Navigation

The app has three main views:
1. **Patient List** - Browse and select patients
2. **Create Patient** - Add new simulated patient
3. **EMR Form View** - Create and view forms for selected patient

## Notes for Future Development

- Frontend styling is basic CSS - consider adding a CSS framework (Tailwind, Bootstrap) when expanding UI
- Form validation is minimal - add client-side validation before backend submission
- No authentication yet - will need user management for students/instructors
- No export functionality yet - plan for PDF export of forms
- Scenario-specific fields can be added by extending the form data structure
