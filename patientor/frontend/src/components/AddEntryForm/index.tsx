import { useState } from 'react';
import { NewEntry, Diagnosis, HealthCheckRating } from '../../types';
import {
  Box,
  Button,
  TextField,
  Alert,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  OutlinedInput,
  Chip,
} from '@mui/material';
import patientService from '../../services/patients';

interface AddEntryFormProps {
  patientId: string;
  onEntryAdded: (entry: NewEntry) => void;
  onCancel: () => void;
  diagnoses: Record<string, Diagnosis>;
}

const AddEntryForm = ({
  patientId,
  diagnoses,
  onEntryAdded,
  onCancel,
}: AddEntryFormProps) => {
  const [date, setDate] = useState('');
  const [description, setDescription] = useState('');
  const [specialist, setSpecialist] = useState('');
  const [employerName, setEmployerName] = useState('');
  const [dischargeDate, setDischargeDate] = useState('');
  const [dischargeCriteria, setDischargeCriteria] = useState('');
  const [sickLeaveStart, setSickLeaveStart] = useState('');
  const [sickLeaveEnd, setSickLeaveEnd] = useState('');
  const [healthCheckRating, setHealthCheckRating] =
    useState<HealthCheckRating>(0);
  const [diagnosisCodes, setDiagnosisCodes] = useState<string[]>([]);

  const [error, setError] = useState('');

  type EntryType = 'HealthCheck' | 'Hospital' | 'OccupationalHealthcare';
  const [type, setType] = useState<EntryType>('HealthCheck');

  const handleSubmit = async (e: React.SyntheticEvent) => {
    e.preventDefault();
    setError('');

    try {
      let newEntry: NewEntry;

      switch (type) {
        case 'HealthCheck':
          newEntry = {
            type,
            date,
            description,
            specialist,
            healthCheckRating: healthCheckRating as HealthCheckRating,
            diagnosisCodes: diagnosisCodes.length ? diagnosisCodes : undefined,
          };
          break;

        case 'Hospital':
          newEntry = {
            type,
            date,
            description,
            specialist,
            diagnosisCodes: diagnosisCodes.length ? diagnosisCodes : undefined,
            discharge: {
              date: dischargeDate,
              criteria: dischargeCriteria,
            },
          };
          break;

        case 'OccupationalHealthcare':
          newEntry = {
            type,
            date,
            description,
            specialist,
            diagnosisCodes: diagnosisCodes.length ? diagnosisCodes : undefined,
            employerName,
            sickLeave:
              sickLeaveStart && sickLeaveEnd
                ? {
                    startDate: sickLeaveStart,
                    endDate: sickLeaveEnd,
                  }
                : undefined,
          };
          break;

        default:
          throw new Error('Unknown entry type');
      }

      await patientService.addEntry(patientId, newEntry);
      onEntryAdded(newEntry);

      setDate('');
      setDescription('');
      setSpecialist('');
      setEmployerName('');
      setDischargeDate('');
      setDischargeCriteria('');
      setSickLeaveStart('');
      setSickLeaveEnd('');
      setHealthCheckRating(0);
      setDiagnosisCodes([]);
    } catch (err) {
      console.error('Error adding entry:', err);
      if (err instanceof Error) {
        console.log(err);
        setError(err.message);
      } else {
        setError('An unknown error occurred while adding the entry');
      }
    }
  };

  const handleCancel = () => {
    setDate('');
    setDescription('');
    setSpecialist('');
    setEmployerName('');
    setDischargeDate('');
    setDischargeCriteria('');
    setSickLeaveStart('');
    setSickLeaveEnd('');
    setHealthCheckRating(0);
    setDiagnosisCodes([]);
    setError('');
    onCancel();
  };

  return (
    <Box
      component="form"
      onSubmit={handleSubmit}
      sx={{
        border: '2px dashed #999',
        padding: '20px',
        marginTop: '20px',
        borderRadius: '4px',
      }}
    >
      <Box
        sx={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '20px' }}
      >
        New HealthCheck Entry
      </Box>

      {error && (
        <Alert severity="error" sx={{ marginBottom: '20px' }}>
          {error}
        </Alert>
      )}

      <Box sx={{ marginBottom: '15px' }}>
        <FormControl fullWidth required>
          <InputLabel>Entry Type</InputLabel>

          <Select
            value={type}
            onChange={(e) => setType(e.target.value as EntryType)}
            label="Entry Type"
          >
            <MenuItem value="HealthCheck">Health Check</MenuItem>
            <MenuItem value="Hospital">Hospital</MenuItem>
            <MenuItem value="OccupationalHealthcare">
              Occupational Healthcare
            </MenuItem>
          </Select>
        </FormControl>
      </Box>

      <Box sx={{ marginBottom: '15px' }}>
        <FormControl fullWidth required>
          <InputLabel shrink>Date</InputLabel>
          <TextField
            label="Date"
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            fullWidth
            required
            InputLabelProps={{ shrink: true }}
          />
        </FormControl>
      </Box>

      <Box sx={{ marginBottom: '15px' }}>
        <TextField
          label="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          fullWidth
          required
        />
      </Box>

      <Box sx={{ marginBottom: '15px' }}>
        <TextField
          label="Specialist"
          value={specialist}
          onChange={(e) => setSpecialist(e.target.value)}
          fullWidth
          required
        />
      </Box>
      {type === 'HealthCheck' && (
        <Box sx={{ marginBottom: '15px' }}>
          <FormControl fullWidth required>
            <InputLabel>Health Check Rating</InputLabel>
            <Select
              value={healthCheckRating}
              onChange={(e) =>
                setHealthCheckRating(e.target.value as HealthCheckRating)
              }
              label="Health Check Rating *"
            >
              <MenuItem value={0}>0 — Healthy</MenuItem>
              <MenuItem value={1}>1 — Low Risk</MenuItem>
              <MenuItem value={2}>2 — High Risk</MenuItem>
              <MenuItem value={3}>3 — Critical Risk</MenuItem>
            </Select>
          </FormControl>
        </Box>
      )}
      {type === 'Hospital' && (
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            gap: 2,
            marginBottom: 2,
          }}
        >
          <TextField
            type="date"
            label="Discharge Date"
            InputLabelProps={{ shrink: true }}
            value={dischargeDate}
            onChange={(e) => setDischargeDate(e.target.value)}
            required
            fullWidth
          />

          <TextField
            label="Discharge Criteria"
            value={dischargeCriteria}
            onChange={(e) => setDischargeCriteria(e.target.value)}
            required
            fullWidth
          />
        </Box>
      )}
      {type === 'OccupationalHealthcare' && (
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            gap: 2,
            marginBottom: 2,
          }}
        >
          <TextField
            label="Employer Name"
            value={employerName}
            onChange={(e) => setEmployerName(e.target.value)}
            required
            fullWidth
          />

          <TextField
            type="date"
            label="Sick Leave Start"
            InputLabelProps={{ shrink: true }}
            value={sickLeaveStart}
            onChange={(e) => setSickLeaveStart(e.target.value)}
            fullWidth
          />

          <TextField
            type="date"
            label="Sick Leave End"
            InputLabelProps={{ shrink: true }}
            value={sickLeaveEnd}
            onChange={(e) => setSickLeaveEnd(e.target.value)}
            fullWidth
          />
        </Box>
      )}
      <Box sx={{ marginBottom: '20px' }}>
        <FormControl fullWidth>
          <InputLabel>Diagnosis Codes</InputLabel>
          <Select
            multiple
            value={diagnosisCodes}
            onChange={(e) =>
              setDiagnosisCodes(
                typeof e.target.value === 'string'
                  ? e.target.value.split(',')
                  : e.target.value,
              )
            }
            input={<OutlinedInput label="Diagnosis Codes" />}
            renderValue={(selected) => (
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                {selected.map((value) => (
                  <Chip key={value} label={value} />
                ))}
              </Box>
            )}
          >
            {Object.values(diagnoses).map((diagnosis) => (
              <MenuItem key={diagnosis.code} value={diagnosis.code}>
                {diagnosis.code} — {diagnosis.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>
      <Box sx={{ display: 'flex', gap: '10px' }}>
        <Button
          type="submit"
          variant="contained"
          sx={{
            backgroundColor: '#1976d2',
            color: 'white',
            padding: '10px 20px',
            textTransform: 'none',
            fontSize: '1rem',
            fontWeight: 'bold',
          }}
        >
          ADD
        </Button>
        <Button
          type="button"
          onClick={handleCancel}
          variant="outlined"
          sx={{
            color: '#1976d2',
            borderColor: '#1976d2',
            padding: '10px 20px',
            textTransform: 'none',
            fontSize: '1rem',
            fontWeight: 'bold',
          }}
        >
          CANCEL
        </Button>
      </Box>
    </Box>
  );
};

export default AddEntryForm;
