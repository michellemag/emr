import { useState, useEffect } from 'react'
import PatientForm from './components/PatientForm'
import PatientList from './components/PatientList'
import FormBuilder from './components/FormBuilder'
import axios from 'axios'

interface Patient {
  id: number
  name: string
  student_id: string
  scenario_type: string
  created_at: string
}

function App() {
  const [patients, setPatients] = useState<Patient[]>([])
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null)
  const [view, setView] = useState<'list' | 'form' | 'emr'>('list')
  const [loading, setLoading] = useState(false)

  const fetchPatients = async () => {
    try {
      setLoading(true)
      const response = await axios.get('/api/patients')
      setPatients(response.data)
    } catch (error) {
      console.error('Failed to fetch patients:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchPatients()
  }, [])

  const handlePatientCreated = (newPatient: Patient) => {
    setPatients([...patients, newPatient])
    setView('list')
  }

  const handleSelectPatient = (patient: Patient) => {
    setSelectedPatient(patient)
    setView('emr')
  }

  return (
    <div className="container">
      <div className="header">
        <h1>EMR System - Victoria University</h1>
        <p>Electronic Medical Record System for Student Learning</p>
      </div>

      <div className="nav-buttons" style={{ marginBottom: '20px' }}>
        <button onClick={() => setView('list')} style={{ marginRight: '10px' }}>
          Patient List
        </button>
        <button onClick={() => setView('form')}>
          Create New Patient
        </button>
      </div>

      {view === 'list' && (
        <PatientList
          patients={patients}
          loading={loading}
          onSelectPatient={handleSelectPatient}
          onRefresh={fetchPatients}
        />
      )}

      {view === 'form' && (
        <PatientForm onPatientCreated={handlePatientCreated} />
      )}

      {view === 'emr' && selectedPatient && (
        <FormBuilder
          patient={selectedPatient}
          onBack={() => setView('list')}
        />
      )}
    </div>
  )
}

export default App
