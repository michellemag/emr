# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

EMR System is a web application for Victoria University medical students to practice filling out Electronic Medical Records. The system supports both in-hospital and out-of-hospital scenarios with various patient types (pregnant, aged care, eating disorder, standard cases).

**Tech Stack:**
- Backend: Node.js with Express + TypeScript
- Frontend: React + TypeScript with Vite
- Database: SQLite (file-based, no server required)
- Monorepo structure using npm workspaces

## Development Commands

### Initial Setup
```bash
# Clone and install dependencies
npm run install-all

# Setup environment variables
cp backend/.env.example backend/.env
# No further configuration needed - SQLite uses default ./emr.db
```

### Database Setup
SQLite database is automatically initialized on first server startup. No manual setup required.

The database file (`emr.db`) is created in the `backend/` directory and persists across restarts.

### Development
```bash
# Run both backend and frontend (from root)
npm run dev

# OR run separately:
npm run dev --workspace backend    # Port 3001
npm run dev --workspace frontend   # Port 3000 (proxies /api to backend)
```

### Build for Production
```bash
npm run build
```

This builds both the frontend (creates dist/) and backend (creates dist/ with compiled TypeScript).

### Production Start
```bash
npm start
```

Starts the backend server which serves both the API and the frontend static files on a single port.

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
│   └── index.html            # Entry point
├── package.json              # Root package.json (workspaces)
├── render.yaml               # Render Blueprint configuration (recommended for deployment)
├── Procfile                  # Render deployment config (alternative method)
└── RENDER_BLUEPRINT_DEPLOY.md # Blueprint deployment guide
```

### Server Architecture

**Development:** Frontend (Vite) and Backend (Express) run on separate ports with API proxy configured in Vite.

**Production:** Backend serves both:
- REST API endpoints at `/api/*`
- Frontend static files (React build) at `/` with fallback to `index.html` for client-side routing

The backend's `src/index.ts` is configured to:
1. Serve `/api/*` endpoints for the API
2. Serve static files from `frontend/dist/`
3. Fallback non-API requests to `index.html` to support React routing

### Database Design

**patients** table: Stores patient records with scenario type
- `id`, `name`, `student_id`, `scenario_type`, `created_at`

**forms** table: Stores EMR forms (flexible JSON structure)
- `id`, `patient_id`, `form_type`, `location`, `data` (TEXT/JSON), `created_at`, `updated_at`
- form_type: 'admission', 'assessment', 'vital_signs', 'discharge'
- location: 'hospital' or 'community'
- **Note**: JSON data is stored as TEXT in SQLite (parsed as JSON in application)

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

## Deployment

### Render Deployment (Blueprint - Recommended)
The simplest way to deploy is using Render's Blueprint feature with SQLite:

1. Commit code: `git push origin main`
2. Go to https://render.com/ → **New +** → **Blueprint**
3. Connect your GitHub repository
4. Render will automatically create the web service
5. Database is automatically initialized on first startup

The `render.yaml` file defines:
- **emr-api** web service with build and start commands
- Automatic environment variable setup (`DATABASE_PATH=./emr.db`)
- **No separate database service needed** (using SQLite)

See `RENDER_BLUEPRINT_DEPLOY.md` for detailed instructions.

### Alternative: Manual Render Deployment
For manual setup or `Procfile`-based deployment:

**Build Command:** `npm install && npm run install-all && npm run build`

**Start Command:** `npm run start`

**Environment Variables:**
- `DATABASE_PATH`: Path to SQLite database file (default: `./emr.db`)
- `NODE_ENV`: `production`

The `Procfile` provides the same build and start commands for Render's classic deployment method.

### Other Platforms
For non-Render deployment:
1. Run `npm run build` to create frontend and backend builds
2. Run `npm start` to start the server
3. Set `DATABASE_PATH` environment variable if needed (default: `./emr.db`)
4. Server listens on `PORT` environment variable (default 3001)

## Key Development Notes

- **Database**: Uses SQLite (file-based, no server required). Database file (`emr.db`) is gitignored and created on first run. Each deployment gets its own database instance.
- **Frontend Styling**: Currently uses basic CSS (`src/index.css`). Consider Tailwind or Bootstrap when expanding UI.
- **Form Validation**: Minimal client-side validation - API accepts any JSON in form data. Add validation as requirements become clearer.
- **Authentication**: Not yet implemented. When adding, consider student/instructor roles.
- **Form Data Structure**: The `forms.data` field in the database stores JSON as TEXT. Frontend should `JSON.parse()` when retrieving and `JSON.stringify()` when sending.
- **Vite Proxy**: In development, the frontend proxies `/api` requests to `http://localhost:3001`. This is configured in `frontend/vite.config.ts`.
- **SQLite Backend**: Uses `sqlite3` npm package with callback-based API. Parameters use `?` placeholders instead of `$1, $2`.
