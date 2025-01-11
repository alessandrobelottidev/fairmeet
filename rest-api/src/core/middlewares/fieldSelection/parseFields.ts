import { FieldSelectionOptions, FieldSelectionRequest } from './types';
import { RequestHandler } from 'express';
import { Document, Model } from 'mongoose';

export const parseFields = <T extends Document>(
  model: Model<T>,
  options: FieldSelectionOptions = {},
): RequestHandler => {
  return (req: FieldSelectionRequest, res, next) => {
    const { fields } = req.query;
    const { allowedFields } = options;

    if (fields) {
      const requestedFields = (fields as string).split(',');
      req.selectedFields = allowedFields
        ? requestedFields.filter((field) => allowedFields.includes(field))
        : requestedFields.filter((field) => field in model.schema.paths);
    }

    next();
  };
};
