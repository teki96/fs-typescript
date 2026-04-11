import type { NewPatient, NewEntry } from './types.ts';
import { Gender, HealthCheckRating } from './types.ts';
import { z } from 'zod';

export const NewPatientSchema = z.object({
  name: z.string(),
  dateOfBirth: z.iso.date(),
  ssn: z.string(),
  gender: z.enum(Gender),
  occupation: z.string(),
});

const baseSchema = z.object({
  description: z.string(),
  date: z.iso.date(),
  specialist: z.string(),
  diagnosisCodes: z.array(z.string()).optional(),
  type: z.string(),
});

const healthCheckSchema = baseSchema.extend({
  type: z.literal('HealthCheck'),
  healthCheckRating: z.union([
    z.literal(HealthCheckRating.Healthy),
    z.literal(HealthCheckRating.LowRisk),
    z.literal(HealthCheckRating.HighRisk),
    z.literal(HealthCheckRating.CriticalRisk),
  ]),
});

const hostpitalSchema = baseSchema.extend({
  type: z.literal('Hospital'),
  discharge: z.object({
    date: z.iso.date(),
    criteria: z.string(),
  }),
});

const occupationalSchema = baseSchema.extend({
  type: z.literal('OccupationalHealthcare'),
  employerName: z.string(),
  sickLeave: z
    .object({
      startDate: z.iso.date(),
      endDate: z.iso.date(),
    })
    .optional(),
});

export const NewEntrySchema = z.discriminatedUnion('type', [
  healthCheckSchema,
  hostpitalSchema,
  occupationalSchema,
]);

export const parseNewEntry = (object: unknown): NewEntry => {
  return NewEntrySchema.parse(object);
};

export const parseNewPatient = (object: unknown): NewPatient => {
  return NewPatientSchema.parse(object);
};
