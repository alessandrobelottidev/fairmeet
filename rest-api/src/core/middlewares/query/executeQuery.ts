import { FieldSelectionRequest } from '../fieldSelection/types';
import { PaginatedRequest, PaginatedResponse } from '../pagination/types';
import { QueryHooks } from './types';
import { RequestHandler } from 'express';
import { Model } from 'mongoose';

export const executeQuery = (model: Model<any>, hooks: QueryHooks = {}): RequestHandler => {
  return async (req: PaginatedRequest & FieldSelectionRequest, res, next) => {
    try {
      const { pagination, selectedFields } = req;
      let query = model.find();
      let countQuery;

      if (pagination) {
        const { skip, limit, sortBy, order } = pagination;
        query = query
          .sort({ [sortBy]: order })
          .skip(skip)
          .limit(limit);
      }

      if (selectedFields?.length) {
        query = query.select(selectedFields.join(' '));
      }

      let additionalQuery = {};
      if (hooks.preQuery) {
        const result = await hooks.preQuery(query, req);
        if (result?.additionalQuery) {
          additionalQuery = result.additionalQuery;
          countQuery = model.countDocuments(additionalQuery);
        }
      }

      if (!countQuery) {
        countQuery = model.countDocuments(additionalQuery);
      }

      const [documents, totalDocs] = await Promise.all([query.lean(), countQuery]);

      const finalData = hooks.postQuery ? await hooks.postQuery(documents) : documents;

      if (!pagination) {
        res.status(200).json(finalData);
        return;
      }

      const totalPages = Math.ceil(totalDocs / pagination.limit);
      const hasNextPage = pagination.page < totalPages - 1;
      const hasPrevPage = pagination.page > 0;

      const response: PaginatedResponse<any> = {
        data: finalData,
        pagination: {
          totalDocs,
          totalPages,
          currentPage: pagination.page,
          limit: pagination.limit,
          hasNextPage,
          hasPrevPage,
          nextPage: hasNextPage ? pagination.page + 1 : null,
          prevPage: hasPrevPage ? pagination.page - 1 : null,
        },
      };

      res.status(200).json(response);
    } catch (error) {
      console.error('executeQuery error:', error);
      next(error);
    }
  };
};
