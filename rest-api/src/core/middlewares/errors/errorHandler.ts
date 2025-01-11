import { AuthError } from '@core/middlewares/errors/auth.error';
import { CustomError } from '@core/middlewares/errors/custom.error';
import { NextFunction, Request, Response } from 'express';
import { z } from 'zod';
import { fromZodError } from 'zod-validation-error';

// Middleware for not found routes
export const notFoundErrorHandler = (req: Request, res: Response, next: NextFunction) => {
  res.status(404);

  res.json({
    error: 'Risorsa non trovata',
  });

  return;
};

// General exception handler middleware
export const globalErrorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
  // Zod schema validation error
  if (err instanceof z.ZodError) {
    res.status(400).json({
      error: 'Validazione fallita',
      details: fromZodError(err).message,
      fields: err.errors.map((e) => ({
        path: e.path.join('.'),
        message: e.message,
      })),
    });
    return;
  }

  // Accounted for, HTTP related error
  if (err instanceof CustomError) {
    // If it is an auth error, sets headers available in Authorization Error object
    if (err instanceof AuthError && err.authorizationError === true) {
      res.set(err.authHeaders);
    }

    // `cause` is a custom property on error object
    // that may contain any data type
    const error = err?.cause || err?.message;
    const providedFeedback = err?.feedback;

    // respond with error and conditionally include feedback if provided
    res.status(err.status || 500).json({
      error: error,
      ...(providedFeedback && { feedback: providedFeedback }),
    });

    return;
  }

  // Default error if an unexpected Express error is thrown
  res.status(500).json({ error: 'Qualcosa e` andato storto...' });
  return;
};
