import type { NewPatient } from './types.ts';
import { Gender } from './types.ts';
import { z } from 'zod';

export const NewPatientSchema = z.object({
    name: z.string(),
    dateOfBirth: z.iso.date(),
    ssn: z.string(),
    gender: z.enum(Gender),
    occupation: z.string()
});

export const parseNewPatient = (object: unknown): NewPatient => {
    return NewPatientSchema.parse(object);
};

export default parseNewPatient;