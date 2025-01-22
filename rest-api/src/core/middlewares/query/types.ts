import { Request } from 'express';
import { FilterQuery } from 'mongoose';

export interface QueryHooks {
  preQuery?: (
    query: any,
    req: Request,
  ) =>
    | Promise<void | { additionalQuery?: FilterQuery<any> }>
    | void
    | { additionalQuery?: FilterQuery<any> };
  postQuery?: (data: any) => Promise<any> | any;
}

export interface QueryOptions {
  showFutureOnly?: boolean;
}
