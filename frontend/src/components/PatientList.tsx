interface Patient {
  id: number
  name: string
  student_id: string
  scenario_type: string
  created_at: string
}

interface PatientListProps {
  patients: Patient[]
  loading: boolean
  onSelectPatient: (patient: Patient) => void
  onRefresh: () => void
}

export default function PatientList({
  patients,
  loading,
  onSelectPatient,
  onRefresh,
}: PatientListProps) {
  if (loading) {
    return <div className="card">Loading patients...</div>
  }

  if (patients.length === 0) {
    return (
      <div className="card">
        <p>No patients created yet. Create one to get started.</p>
      </div>
    )
  }

  const scenarioLabels: Record<string, string> = {
    standard: 'Standard Case',
    pregnant: 'Pregnant',
    aged_care: 'Aged Care',
    eating_disorder: 'Eating Disorder',
  }

  return (
    <div>
      <div style={{ marginBottom: '20px' }}>
        <button onClick={onRefresh}>Refresh</button>
      </div>

      <div className="grid">
        {patients.map(patient => (
          <div key={patient.id} className="card">
            <h3>{patient.name}</h3>
            <p><strong>ID:</strong> {patient.id}</p>
            <p><strong>Student:</strong> {patient.student_id || 'N/A'}</p>
            <p><strong>Scenario:</strong> {scenarioLabels[patient.scenario_type] || patient.scenario_type}</p>
            <p style={{ fontSize: '12px', color: '#666' }}>
              Created: {new Date(patient.created_at).toLocaleDateString()}
            </p>
            <button onClick={() => onSelectPatient(patient)} style={{ width: '100%', marginTop: '10px' }}>
              Open EMR
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}
