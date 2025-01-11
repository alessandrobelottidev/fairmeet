import groupValidationSchema from '../validators/group.validator';
import { createValidationHandler } from '@core/middlewares/zodValidation/validation';

export const validateCreateGroupReqParams = createValidationHandler(
  groupValidationSchema.createGroupReqParams,
);
