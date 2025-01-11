import { CustomError } from '@core/errors/custom.error';
import { NextFunction, Request, RequestHandler, Response } from 'express';

export const requireOwnershipOfThisUser: RequestHandler = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    // console.log('Auth user:', req.body.user.id);
    // console.log('Requested user:', req.params.user_id);

    if (!req.body.user || !req.params.user_id) {
      next(new CustomError('Alcune field obbligatorie non sono state inviate...', 500));
    } else {
      if (req.body.user.id !== req.params.user_id) {
        next(
          new CustomError(
            "Forbidden: Potresti essere autenticato, ma non hai l'autorizzazione per accedere a questa risorsa",
            403,
          ),
        );
      }
    }

    next();
  } catch (err) {
    next(err);
  }
};
