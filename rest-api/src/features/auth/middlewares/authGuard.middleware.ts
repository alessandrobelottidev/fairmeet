import { AuthError } from '@core/errors/auth.error';
import { Role } from '@core/interfaces/roles.interface';
import secrets from '@core/secrets';
import { NextFunction, Request, RequestHandler, Response } from 'express';
import jsonwebtoken, { JwtPayload } from 'jsonwebtoken';

const requireAuthentication: RequestHandler = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    if (!req.headers.authorization) {
      throw new AuthError('Authentication Error', 401, 'No credentials sent!');
    }

    const authHeader = req.headers.authorization;
    if (authHeader == null || !authHeader.startsWith('Bearer '))
      throw new AuthError('Authentication Error', 401, 'You are unauthenticated!', {
        error: 'invalid_access_token',
        error_description: 'unknown authentication scheme',
      });

    const accessTokenParts = authHeader.split(' ');
    const aTkn = accessTokenParts[1];

    const decoded = jsonwebtoken.verify(aTkn, secrets.ACCESS_TOKEN.secret) as JwtPayload;

    // Attach authenticated user and Access Token to request object
    req.body.user = { id: decoded._id ?? '' };
    req.body.accessToken = aTkn;
    next();
  } catch (err: any) {
    // Authentication check didn't go well
    console.log(err);

    if (err.name === 'TokenExpiredError')
      return next(
        new AuthError('Authentication Error', 401, 'Token lifetime exceeded!', {
          error: 'expired_access_token',
          error_description: 'access token is expired',
        }),
      );

    next(err);
  }
};

const requireAuthAndRoles = (allowedRoles: Role[]): RequestHandler[] => {
  return [
    requireAuthentication,
    (req, res, next) => {
      try {
        const authHeader = req.headers.authorization;
        const accessTokenParts = authHeader!.split(' '); // I'm sure it exists only because there are checks in requireAuthentication already
        const accessToken = accessTokenParts[1];

        const decodedAccessToken = jsonwebtoken.verify(
          accessToken,
          secrets.ACCESS_TOKEN.secret,
        ) as JwtPayload;

        const role: Role = decodedAccessToken.role ?? '';

        // Check if role is not in the allowedRoles, if it is not return 403 not enough permissions
        if (!allowedRoles.includes(role)) {
          throw new AuthError('Authorization Error', 403, 'Non hai il ruolo richiesto');
        }

        next();
      } catch (err: any) {
        // Authorization didn't go well
        if (err.name === 'TokenExpiredError')
          return next(
            new AuthError('Authentication Error', 401, 'Token lifetime exceeded!', {
              error: 'expired_access_token',
              error_description: 'access token is expired',
            }),
          );

        next(err);
      }
    },
  ];
};

export { requireAuthentication, requireAuthAndRoles };
