import express, { type Response } from 'express';
import { z } from 'zod';
import patientService from '../services/patientService.ts';
import type { NonSensitivePatient } from '../types.ts';
import { parseNewPatient } from '../utils.ts';

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

export default router;