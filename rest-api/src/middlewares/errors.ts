import { NextFunction, Request, Response } from 'express';
import { z } from 'zod';
import { fromZodError } from 'zod-validation-error';

export const errorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
  if (err instanceof z.ZodError) {
    res.status(400).json({
      error: 'Validation failed',
      details: fromZodError(err).message,
      fields: err.errors.map((e) => ({
        path: e.path.join('.'),
        message: e.message,
      })),
    });
    return;
  }

  res.status(500).json({ errors: [{ message: 'Something went wrong' }] });
};
