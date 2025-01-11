import { FieldSelectionRequest } from '../fieldSelection/types';
import { PaginatedRequest, PaginatedResponse } from '../pagination/types';
import { QueryHooks } from './types';
import { RequestHandler } from 'express';
import { Model } from 'mongoose';

export const executeQuery = (model: Model<any>, hooks: QueryHooks = {}): RequestHandler => {
  return async (req: PaginatedRequest & FieldSelectionRequest, res, next) => {
    try {
      const { pagination, selectedFields } = req;

      // Don't require pagination for findById operations
      let query = model.find();

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

      if (hooks.preQuery) {
        await hooks.preQuery(query, req);
      }

      // Handle both single document and list scenarios
      let documents;
      let totalDocs;

      if (pagination) {
        [documents, totalDocs] = await Promise.all([query.lean(), model.countDocuments()]);
      } else {
        documents = await query.lean();
        totalDocs = Array.isArray(documents) ? documents.length : 1;
      }

      const finalData = hooks.postQuery ? await hooks.postQuery(documents) : documents;

      if (!pagination) {
        // For non-paginated requests (like getById), return the data directly
        res.status(200).json(finalData);
        return;
      }

      // For paginated requests, return the standard paginated response
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
      console.error('executeQuery error:', error); // Add this for debugging
      next(error);
    }
  };
};
