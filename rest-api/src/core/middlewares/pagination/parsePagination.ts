import { PaginatedRequest, PaginationOptions } from './types';
import { RequestHandler } from 'express';

export const parsePagination = (options: PaginationOptions = {}): RequestHandler => {
  const { defaultSort = 'updated_at', maxLimit = 100 } = options;

  return (req: PaginatedRequest, res, next) => {
    const { page = '0', limit = '10', sortBy = defaultSort, order = 'desc' } = req.query;

    req.pagination = {
      page: Math.max(0, parseInt(page as string)),
      limit: Math.min(maxLimit, Math.max(1, parseInt(limit as string))),
      skip: 0,
      sortBy: sortBy as string,
      order: order as 'asc' | 'desc',
    };

    req.pagination.skip = req.pagination.page * req.pagination.limit;
    next();
  };
};
