import patients from '../../data/patients.ts';
import { v1 as uuid } from 'uuid';
import type { NonSensitivePatient, Patient, Entry } from '../types.ts';

const getPatients = (): Patient[] => {
  return patients;
};

const getNonSensitivePatients = (): NonSensitivePatient[] => {
  return patients.map(({ id, name, dateOfBirth, gender, occupation }) => ({
    id,
    name,
    dateOfBirth,
    gender,
    occupation,
  }));
};

const addPatient = (entry: Omit<Patient, 'id'>): Patient => {
  const newPatient = {
    id: uuid(),
    ...entry,
    entries: entry.entries ?? [],
  };
  patients.push(newPatient);
  return newPatient;
};

const getPatientById = (id: string): Patient | undefined => {
  const patient = patients.find((p) => p.id === id);

  if (!patient) return undefined;

  return {
    ...patient,
    entries: patient.entries ?? [],
  };
};

const addEntry = (patientId: string, entry: Entry): Patient | undefined => {
  const patient = patients.find((p) => p.id === patientId);
  if (patient) {
    patient.entries = patient.entries ?? [];
    patient.entries.push(entry);
    return patient;
  }
  return undefined;
};

export default {
  getPatients,
  getNonSensitivePatients,
  addPatient,
  getPatientById,
  addEntry,
};
