import { z } from 'zod';

const numberPairSchema = z.tuple([z.number(), z.number()]);

export const recommendValidationSchema = z.object({
  coordinates: z.array(numberPairSchema),
  groupSize: z.number(),
  preferences: z.object({
    maxDistance: z.number(), // in kilometers
    preferIndoor: z.boolean(),
    preferOutdoor: z.boolean(),
    activityType: z.string(),
  }),
});
