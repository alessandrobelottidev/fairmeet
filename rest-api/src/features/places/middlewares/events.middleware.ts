import { eventValidationSchema } from '@features/places/validators/event.validator';
import e from 'express';

export const validateEventSchema: e.RequestHandler = async (req, res, next) => {
  try {
    // Parse and transform the data.
    // If there's an error it will be raised as a z.zodError
    const validatedData = await eventValidationSchema.parseAsync(req.body);

    // Replace req.body with the validated and transformed data
    req.body = validatedData;

    next();
  } catch (error) {
    next(error);
  }
};
