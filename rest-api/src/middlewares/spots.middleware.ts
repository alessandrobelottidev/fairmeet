import e from "express";
import { spotValidationSchema } from "@validators/spot.validator";

export const validateSpot: e.RequestHandler = async (req, res, next) => {
  try {
    // Parse and transform the data.
    // If there's an error it will be raised as a z.zodError
    const validatedData = await spotValidationSchema.parseAsync(req.body);

    // Replace req.body with the validated and transformed data
    req.body = validatedData;

    next();
  } catch (error) {
    next(error);
  }
};
