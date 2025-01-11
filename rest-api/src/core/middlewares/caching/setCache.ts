import { CacheOptions } from './types';
import { RequestHandler } from 'express';

export const setCache = (options: CacheOptions = {}): RequestHandler => {
  const { timeout = 900 } = options;

  return (req, res, next) => {
    if (timeout > 0) {
      res.setHeader('Cache-Control', `public, max-age=${timeout}`);
    }
    next();
  };
};
