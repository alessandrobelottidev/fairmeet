import { socialMediaHandlesSchema } from '@core/validators/socialMediaHandlesSchema';
import { z } from 'zod';

// Main Zod schema that mirrors the ISpot interface
export const spotValidationSchema = z.object({
  title: z
    .string()
    .min(3, 'Title must be at least 3 characters')
    .max(100, 'Title must not exceed 100 characters')
    .trim(),

  address: z.string().min(5, 'Address must be at least 5 characters').trim(),

  description: z.string().min(10, 'Description must be at least 10 characters').trim(),

  latitude: z
    .number()
    .min(-90, 'Latitude must be between -90 and 90')
    .max(90, 'Latitude must be between -90 and 90'),

  longitude: z
    .number()
    .min(-180, 'Longitude must be between -180 and 180')
    .max(180, 'Longitude must be between -180 and 180'),

  abstract: z.string().trim().optional(),

  email: z.string().email('Invalid email address').toLowerCase().optional(),

  socialMediaHandles: socialMediaHandlesSchema.optional(),

  featuredImageUrl: z.string().url('Invalid featured image URL').optional(),

  updated_at: z
    .date()
    .optional()
    .default(() => new Date()),
});

// Type inference from the Zod schema
export type SpotSchemaType = z.infer<typeof spotValidationSchema>;
