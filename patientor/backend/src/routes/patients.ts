import express, { type Response } from 'express';
import { z } from 'zod';
import { v1 as uuid } from 'uuid';
import patientService from '../services/patientService.ts';
import type { NonSensitivePatient, Patient, Entry } from '../types.ts';
import { parseNewPatient, parseNewEntry } from '../utils.ts';

const router = express.Router();

router.get('/', (_req, res: Response<NonSensitivePatient[]>) => {
  res.send(patientService.getNonSensitivePatients());
});

router.post('/', (req, res) => {
  try {
    const newPatientEntry = parseNewPatient(req.body);
    const addedPatient = patientService.addPatient(newPatientEntry);
    res.json(addedPatient);
  } catch (error: unknown) {
    if (error instanceof z.ZodError) {
      res.status(400).send({ error: error.issues });
    } else {
      res.status(400).send({ error: 'unknown error' });
    }
  }
});

router.get('/:id', (req, res) => {
  const patient = patientService.getPatientById(req.params.id);
  if (patient) {
    res.send(patient);
  } else {
    res.status(404).send({ error: 'Patient not found' });
  }
});

router.post(
  '/:id/entries',
  (req, res: Response<Patient | { error: string }>) => {
    try {
      const patientId = req.params.id;
      const newEntry = parseNewEntry(req.body);

      const entryWithId: Entry = {
        id: uuid(),
        ...newEntry,
      } as Entry;

      const updatedPatient = patientService.addEntry(patientId, entryWithId);

      if (updatedPatient) {
        res.json(updatedPatient);
      } else {
        res.status(404).send({ error: 'Patient not found' });
      }
    } catch (error: unknown) {
      if (error instanceof z.ZodError) {
        const errorObject: Record<string, string> = {};
        error.issues.forEach((issue) => {
          const field = issue.path.join('.');
          errorObject[field] = issue.message;
        });

        res.status(400).json({ error: errorObject });
      } else {
        res.status(400).send({ error: 'unknown error' });
      }
    }
  },
);

export default router;
