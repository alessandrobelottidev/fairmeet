import e from "express";
import { spotSchema } from "../../validators/spot.validator";
import { fromZodError } from "zod-validation-error";
import { z } from "zod";

export const validateSpot: e.RequestHandler = async (req, res, next) => {
  try {
    // check if socialMediaHandles property exists in the req.body json and if it does convert it to a map so that zod can validate without issues
    if (req.body.socialMediaHandles) {
      req.body.socialMediaHandles = new Map(
        Object.entries(req.body.socialMediaHandles)
      );
    }

    console.log(typeof req.body.socialMediaHandles);

    // Parse and transform the data
    const validatedData = await spotSchema.parseAsync(req.body);

    // Replace req.body with the validated and transformed data
    req.body = validatedData;

    next();
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({
        error: "Validation failed",
        details: fromZodError(error).message,
        fields: error.errors.map((err) => ({
          path: err.path.join("."),
          message: err.message,
        })),
      });
    }
    next(error);
  }
};
