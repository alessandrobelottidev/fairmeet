import { z } from 'zod';

const createMeetingSchema = z.object({
  group: z.string(),
  places: z
    .array(
      z.object({
        placeId: z.string(),
        placeType: z.enum(['spot', 'event']),
      }),
    )
    .min(1, 'At least one place must be selected'),
  radius: z.object({
    center: z.object({
      type: z.literal('Point'),
      coordinates: z.tuple([
        z.number(), // longitude
        z.number(), // latitude
      ]),
    }),
    sizeInMeters: z.number().positive(),
  }),
});

const addVoteSchema = z.object({
  selectedPlaces: z.array(z.string()).min(1, 'At least one place must be selected'),
});

const finalizePlaceSchema = z.object({
  placeId: z.string(),
  placeType: z.enum(['spot', 'event']),
});

const meetingValidationSchema = {
  createMeetingSchema,
  addVoteSchema,
  finalizePlaceSchema,
};

export default meetingValidationSchema;
