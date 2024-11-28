import { placeValidationSchema } from '@features/places/validators/place.validators';
import { z } from 'zod';

export const eventValidationSchema = placeValidationSchema.extend({
  startDateTimeZ: z.string().datetime(),
  // .min(new Date());
  endDateTimeZ: z.string().datetime(),
});

// Type inference from the Zod schema
export type EventSchemaType = z.infer<typeof eventValidationSchema>;
