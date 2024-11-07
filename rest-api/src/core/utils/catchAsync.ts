import { RequestHandler } from 'express';

export const catchAsync = (routeHandler: RequestHandler) => {
  return (async (req, res, next) => {
    try {
      await routeHandler(req, res, next);
    } catch (err) {
      next(err);
    }
  }) as RequestHandler;
};
