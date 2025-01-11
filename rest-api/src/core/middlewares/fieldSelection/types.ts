import { Request } from 'express';

export interface FieldSelectionRequest extends Request {
  selectedFields?: string[];
}

export interface FieldSelectionOptions {
  allowedFields?: string[];
}
