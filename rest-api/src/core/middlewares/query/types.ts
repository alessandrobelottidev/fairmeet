import { Request } from 'express';

export interface QueryHooks {
  preQuery?: (query: any, req: Request) => Promise<void> | void;
  postQuery?: (data: any) => Promise<any> | any;
}
