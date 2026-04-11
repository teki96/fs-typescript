import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Diagnosis, Patient } from '../../types';
import patientService from '../../services/patients';
import diagnosesService from '../../services/diagnoses';
import MaleIcon from '@mui/icons-material/Male';
import FemaleIcon from '@mui/icons-material/Female';
import TransgenderIcon from '@mui/icons-material/Transgender';
import { Typography, Button, Box } from '@mui/material';
import EntryDetails from '../EntryDetails';
import AddEntryForm from '../AddEntryForm';

const PatientPage = () => {
  const { id } = useParams<{ id: string }>();
  const [patient, setPatient] = useState<Patient | null>(null);
  const [diagnoses, setDiagnoses] = useState<Record<string, Diagnosis>>({});
  const [showAddEntryForm, setShowAddEntryForm] = useState(false);

  useEffect(() => {
    const fetchPatient = async () => {
      try {
        const data = await patientService.getById(id!);
        setPatient(data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchPatient();
  }, [id]);

  useEffect(() => {
    const fetchDiagnoses = async () => {
      try {
        const data = await diagnosesService.getAll();
        const diagnosesMap: Record<string, Diagnosis> = {};
        data.forEach((diagnosis) => {
          diagnosesMap[diagnosis.code] = diagnosis;
        });
        setDiagnoses(diagnosesMap);
      } catch (error) {
        console.error(error);
      }
    };

    fetchDiagnoses();
  }, []);

  const handleAddEntry = async () => {
    if (id) {
      try {
        const updatedPatient = await patientService.getById(id);
        setPatient(updatedPatient);
        setShowAddEntryForm(false);
      } catch (error) {
        console.error('Failed to refresh patient:', error);
      }
    }
  };

  if (!patient) {
    return <div>Loading...</div>;
  }

  const genderIcon = () => {
    switch (patient.gender) {
      case 'male':
        return <MaleIcon />;
      case 'female':
        return <FemaleIcon />;
      default:
        return <TransgenderIcon />;
    }
  };

  return (
    <div>
      <Typography variant="h5">
        {patient.name} {genderIcon()}
      </Typography>
      <p>ssn: {patient.ssn}</p>
      <p>occupation: {patient.occupation}</p>

      {!showAddEntryForm && (
        <Box sx={{ marginBottom: '20px' }}>
          <Button
            variant="contained"
            onClick={() => setShowAddEntryForm(true)}
            sx={{ marginTop: '10px' }}
          >
            Add New Entry
          </Button>
        </Box>
      )}

      {showAddEntryForm && id && (
        <AddEntryForm
          patientId={id}
          onEntryAdded={handleAddEntry}
          onCancel={() => setShowAddEntryForm(false)}
          diagnoses={diagnoses}
        />
      )}

      <h2>entries</h2>
      {(patient.entries ?? []).map((entry) => (
        <div key={entry.id}>
          <EntryDetails entry={entry} />
          {entry.diagnosisCodes && entry.diagnosisCodes.length > 0 && (
            <ul>
              {entry.diagnosisCodes.map((code) => (
                <li key={code}>
                  {code} {diagnoses[code]?.name}
                </li>
              ))}
            </ul>
          )}
        </div>
      ))}
    </div>
  );
};

export default PatientPage;
