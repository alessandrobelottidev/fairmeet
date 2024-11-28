import { placeValidationSchema } from '@features/places/validators/place.validators';
import { z } from 'zod';

// Main Zod schema that mirrors the ISpot interface
export const spotValidationSchema = placeValidationSchema;
// Type inference from the Zod schema
export type SpotSchemaType = z.infer<typeof spotValidationSchema>;
