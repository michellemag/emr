import { useState, useEffect } from 'react'
import axios from 'axios'

interface Patient {
  id: number
  name: string
  scenario_type: string
}

interface Form {
  id: number
  form_type: string
  location: string
  data: any
  created_at: string
}

interface FormBuilderProps {
  patient: Patient
  onBack: () => void
}

const FORM_TYPES = [
  { value: 'admission', label: 'Admission Form' },
  { value: 'assessment', label: 'Patient Assessment' },
  { value: 'vital_signs', label: 'Vital Signs' },
  { value: 'discharge', label: 'Discharge Summary' },
]

const LOCATIONS = [
  { value: 'hospital', label: 'In-Hospital' },
  { value: 'community', label: 'Out-of-Hospital / Community' },
]

export default function FormBuilder({ patient, onBack }: FormBuilderProps) {
  const [forms, setForms] = useState<Form[]>([])
  const [showNewForm, setShowNewForm] = useState(false)
  const [formType, setFormType] = useState('admission')
  const [location, setLocation] = useState('hospital')
  const [formData, setFormData] = useState({
    chief_complaint: '',
    medical_history: '',
    current_medications: '',
    physical_exam: '',
    notes: '',
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const fetchForms = async () => {
    try {
      const response = await axios.get(`/api/forms/${patient.id}`)
      setForms(response.data)
    } catch (err) {
      console.error('Failed to fetch forms:', err)
    }
  }

  useEffect(() => {
    fetchForms()
  }, [patient.id])

  const handleFormDataChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmitForm = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const response = await axios.post('/api/forms', {
        patient_id: patient.id,
        form_type: formType,
        location,
        data: formData,
      })
      setForms([response.data, ...forms])
      setShowNewForm(false)
      setFormData({
        chief_complaint: '',
        medical_history: '',
        current_medications: '',
        physical_exam: '',
        notes: '',
      })
    } catch (err) {
      setError('Failed to save form. Please try again.')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const getFormTypeLabel = (type: string) => {
    return FORM_TYPES.find(f => f.value === type)?.label || type
  }

  const getLocationLabel = (loc: string) => {
    return LOCATIONS.find(l => l.value === loc)?.label || loc
  }

  return (
    <div>
      <button onClick={onBack} style={{ marginBottom: '20px' }}>
        ← Back to Patients
      </button>

      <div className="card">
        <h2>{patient.name}</h2>
        <p><strong>Scenario:</strong> {patient.scenario_type}</p>
        <p><strong>Patient ID:</strong> {patient.id}</p>
      </div>

      {error && <div className="error">{error}</div>}

      {!showNewForm ? (
        <div className="card">
          <h3>EMR Records</h3>
          <button onClick={() => setShowNewForm(true)} style={{ marginBottom: '20px' }}>
            + New Form
          </button>

          {forms.length === 0 ? (
            <p>No forms yet. Create one to get started.</p>
          ) : (
            <div>
              {forms.map(form => (
                <div key={form.id} style={{ marginBottom: '20px', padding: '15px', borderLeft: '4px solid #3498db', backgroundColor: '#f9f9f9' }}>
                  <h4>{getFormTypeLabel(form.form_type)}</h4>
                  <p><strong>Location:</strong> {getLocationLabel(form.location)}</p>
                  <p><strong>Date:</strong> {new Date(form.created_at).toLocaleString()}</p>
                  <details style={{ marginTop: '10px' }}>
                    <summary>View Details</summary>
                    <pre style={{ marginTop: '10px', backgroundColor: '#f5f5f5', padding: '10px', borderRadius: '4px', overflow: 'auto' }}>
                      {JSON.stringify(form.data, null, 2)}
                    </pre>
                  </details>
                </div>
              ))}
            </div>
          )}
        </div>
      ) : (
        <div className="card">
          <h3>New Form</h3>
          <form onSubmit={handleSubmitForm}>
            <div className="form-group">
              <label htmlFor="formType">Form Type</label>
              <select
                id="formType"
                value={formType}
                onChange={(e) => setFormType(e.target.value)}
                style={{ width: '100%' }}
              >
                {FORM_TYPES.map(type => (
                  <option key={type.value} value={type.value}>
                    {type.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="location">Location</label>
              <select
                id="location"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                style={{ width: '100%' }}
              >
                {LOCATIONS.map(loc => (
                  <option key={loc.value} value={loc.value}>
                    {loc.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="chief_complaint">Chief Complaint</label>
              <input
                id="chief_complaint"
                type="text"
                name="chief_complaint"
                value={formData.chief_complaint}
                onChange={handleFormDataChange}
                placeholder="Primary reason for visit"
                style={{ width: '100%' }}
              />
            </div>

            <div className="form-group">
              <label htmlFor="medical_history">Medical History</label>
              <textarea
                id="medical_history"
                name="medical_history"
                value={formData.medical_history}
                onChange={handleFormDataChange}
                placeholder="Past medical conditions and relevant history"
                rows={4}
                style={{ width: '100%' }}
              />
            </div>

            <div className="form-group">
              <label htmlFor="current_medications">Current Medications</label>
              <textarea
                id="current_medications"
                name="current_medications"
                value={formData.current_medications}
                onChange={handleFormDataChange}
                placeholder="List of current medications"
                rows={3}
                style={{ width: '100%' }}
              />
            </div>

            <div className="form-group">
              <label htmlFor="physical_exam">Physical Examination</label>
              <textarea
                id="physical_exam"
                name="physical_exam"
                value={formData.physical_exam}
                onChange={handleFormDataChange}
                placeholder="Findings from physical examination"
                rows={4}
                style={{ width: '100%' }}
              />
            </div>

            <div className="form-group">
              <label htmlFor="notes">Additional Notes</label>
              <textarea
                id="notes"
                name="notes"
                value={formData.notes}
                onChange={handleFormDataChange}
                placeholder="Any additional clinical notes"
                rows={4}
                style={{ width: '100%' }}
              />
            </div>

            <div>
              <button type="submit" disabled={loading} style={{ marginRight: '10px' }}>
                {loading ? 'Saving...' : 'Save Form'}
              </button>
              <button
                type="button"
                onClick={() => setShowNewForm(false)}
                style={{ backgroundColor: '#95a5a6' }}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  )
}
