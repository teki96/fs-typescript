import {
  Entry,
  HealthCheckEntry,
  HospitalEntry,
  OccupationalHealthcareEntry,
} from '../../types';
import FavoriteIcon from '@mui/icons-material/Favorite';
import AssignmentIcon from '@mui/icons-material/Assignment';
import LocalHospitalIcon from '@mui/icons-material/LocalHospital';
import { Box, Typography } from '@mui/material';

const assertNever = (value: never): never => {
  throw new Error(
    `Unhandled discriminated union member: ${JSON.stringify(value)}`,
  );
};

const HealthCheckEntryDisplay = ({ entry }: { entry: HealthCheckEntry }) => {
  const getHeartIcon = (rating: number) => {
    switch (rating) {
      case 0:
        return <FavoriteIcon style={{ color: 'green' }} />;
      case 1:
        return <FavoriteIcon style={{ color: 'yellow' }} />;
      case 2:
        return <FavoriteIcon style={{ color: 'orange' }} />;
      case 3:
        return <FavoriteIcon style={{ color: 'red' }} />;
    }
  };

  return (
    <Box
      sx={{ border: '1px solid #ddd', padding: 2, marginY: 1, borderRadius: 1 }}
    >
      <Typography>
        {entry.date} <LocalHospitalIcon fontSize="small" />
      </Typography>
      <Typography>
        <em>{entry.description}</em>
      </Typography>
      <Typography>{getHeartIcon(entry.healthCheckRating)}</Typography>
      <Typography variant="caption">diagnose by {entry.specialist}</Typography>
    </Box>
  );
};

const HospitalEntryDisplay = ({ entry }: { entry: HospitalEntry }) => {
  return (
    <Box
      sx={{ border: '1px solid #ddd', padding: 2, marginY: 1, borderRadius: 1 }}
    >
      <Typography>
        {entry.date} <LocalHospitalIcon fontSize="small" />
      </Typography>
      <Typography>
        <em>{entry.description}</em>
      </Typography>
      <Typography>
        Discharge: {entry.discharge.date} - {entry.discharge.criteria}
      </Typography>
      <Typography variant="caption">diagnose by {entry.specialist}</Typography>
    </Box>
  );
};

const OccupationalHealthcareEntryDisplay = ({
  entry,
}: {
  entry: OccupationalHealthcareEntry;
}) => {
  return (
    <Box
      sx={{ border: '1px solid #ddd', padding: 2, marginY: 1, borderRadius: 1 }}
    >
      <Typography>
        {entry.date} <AssignmentIcon fontSize="small" /> {entry.employerName}
      </Typography>
      <Typography>
        <em>{entry.description}</em>
      </Typography>
      {entry.sickLeave && (
        <Typography>
          Sick leave: {entry.sickLeave.startDate} to {entry.sickLeave.endDate}
        </Typography>
      )}
      <Typography variant="caption">Specialist: {entry.specialist}</Typography>
    </Box>
  );
};

const EntryDetails = ({ entry }: { entry: Entry }) => {
  switch (entry.type) {
    case 'HealthCheck':
      return <HealthCheckEntryDisplay entry={entry} />;
    case 'Hospital':
      return <HospitalEntryDisplay entry={entry} />;
    case 'OccupationalHealthcare':
      return <OccupationalHealthcareEntryDisplay entry={entry} />;
    default:
      return assertNever(entry);
  }
};

export default EntryDetails;
