import axios from 'axios';
import { Patient, PatientFormValues, NewEntry } from '../types';

import { apiBaseUrl } from '../constants';

const getAll = async () => {
  const { data } = await axios.get<Patient[]>(`${apiBaseUrl}/patients`);

  return data;
};

const create = async (object: PatientFormValues) => {
  const { data } = await axios.post<Patient>(`${apiBaseUrl}/patients`, object);

  return data;
};

const getById = async (id: string) => {
  const { data } = await axios.get<Patient>(`${apiBaseUrl}/patients/${id}`);

  return data;
};

const addEntry = async (
  patientId: string,
  entry: NewEntry,
): Promise<Patient> => {
  try {
    const { data } = await axios.post<Patient>(
      `${apiBaseUrl}/patients/${patientId}/entries`,
      entry,
    );
    return data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const errorMsg = error.response?.data?.error;

      if (typeof errorMsg === 'object' && errorMsg !== null) {
        const messages = Object.entries(errorMsg)
          .map(([field, msg]) => `${field}: ${msg}`)
          .join(', ');

        throw new Error(messages);
      }
    }
    throw new Error('Unknown error');
  }
};

export default {
  getAll,
  create,
  getById,
  addEntry,
};
