import { Request } from 'express';

export interface PaginationOptions {
  defaultSort?: string;
  maxLimit?: number;
}

export interface PaginatedRequest extends Request {
  pagination?: {
    page: number;
    limit: number;
    skip: number;
    sortBy: string;
    order: 'asc' | 'desc';
  };
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    totalDocs: number;
    totalPages: number;
    currentPage: number;
    limit: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
    nextPage: number | null;
    prevPage: number | null;
  };
}
