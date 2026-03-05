import { useState } from 'react'
import axios from 'axios'

interface PatientFormProps {
  onPatientCreated: (patient: any) => void
}

const SCENARIO_TYPES = [
  { value: 'standard', label: 'Standard Case' },
  { value: 'pregnant', label: 'Pregnant' },
  { value: 'aged_care', label: 'Aged Care' },
  { value: 'eating_disorder', label: 'Eating Disorder' },
]

export default function PatientForm({ onPatientCreated }: PatientFormProps) {
  const [formData, setFormData] = useState({
    name: '',
    student_id: '',
    scenario_type: 'standard',
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const response = await axios.post('/api/patients', formData)
      onPatientCreated(response.data)
      setFormData({ name: '', student_id: '', scenario_type: 'standard' })
    } catch (err) {
      setError('Failed to create patient. Please try again.')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="card">
      <h2>Create New Patient</h2>
      {error && <div className="error">{error}</div>}

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="name">Patient Name</label>
          <input
            id="name"
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            placeholder="Enter patient name"
            style={{ width: '100%' }}
          />
        </div>

        <div className="form-group">
          <label htmlFor="student_id">Student ID</label>
          <input
            id="student_id"
            type="text"
            name="student_id"
            value={formData.student_id}
            onChange={handleChange}
            placeholder="Enter your student ID"
            style={{ width: '100%' }}
          />
        </div>

        <div className="form-group">
          <label htmlFor="scenario_type">Scenario Type</label>
          <select
            id="scenario_type"
            name="scenario_type"
            value={formData.scenario_type}
            onChange={handleChange}
            style={{ width: '100%' }}
          >
            {SCENARIO_TYPES.map(scenario => (
              <option key={scenario.value} value={scenario.value}>
                {scenario.label}
              </option>
            ))}
          </select>
        </div>

        <button type="submit" disabled={loading}>
          {loading ? 'Creating...' : 'Create Patient'}
        </button>
      </form>
    </div>
  )
}
