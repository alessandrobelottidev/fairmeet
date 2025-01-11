import { socialMediaHandlesSchema } from '@core/schemas/socialMediaHandlesSchema';
import { z } from 'zod';

export const placeValidationSchema = z.object({
  title: z
    .string()
    .min(3, 'Title must be at least 3 characters')
    .max(100, 'Title must not exceed 100 characters')
    .trim(),

  address: z.string().min(5, 'Address must be at least 5 characters').trim(),

  description: z.string().min(10, 'Description must be at least 10 characters').trim(),

  location: z.object({
    type: z.enum(['Point']),
    coordinates: z.number().array(),
  }),

  abstract: z.string().trim().optional(),

  email: z.string().email('Invalid email address').toLowerCase().optional(),

  socialMediaHandles: socialMediaHandlesSchema.optional(),

  featuredImageUrl: z.string().url('Invalid featured image URL').optional(),

  updated_at: z
    .date()
    .optional()
    .default(() => new Date()),
});
