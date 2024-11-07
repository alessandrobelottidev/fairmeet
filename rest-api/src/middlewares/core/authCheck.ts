import { AuthError } from '@errors/auth.error';
import secrets from '@src/secrets';
import { NextFunction, Request, RequestHandler, Response } from 'express';
import jsonwebtoken, { JwtPayload } from 'jsonwebtoken';

const requireAuthentication: RequestHandler = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    if (!req.headers.authorization) {
      throw new AuthError('Authentication Error', 403, 'No credentials sent!');
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

export default requireAuthentication;
