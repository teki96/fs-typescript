import patients from '../../data/patients.ts';
import { v1 as uuid } from 'uuid';
import type { NonSensitivePatient, Patient } from '../types.ts';

const getPatients = (): Patient[] => {  
  return patients;
};

const getNonSensitivePatients = (): NonSensitivePatient[] => {
    return patients.map(({ id, name, dateOfBirth, gender, occupation }) => ({
        id, name, dateOfBirth, gender, occupation
    }));
};

const addPatient = ( entry : Omit<Patient, 'id'> ): Patient => {
    const newPatient = {
        id: uuid(),
        ...entry
    };
    patients.push(newPatient);
    return newPatient;
};

export default {
  getPatients,
  getNonSensitivePatients,
  addPatient
};