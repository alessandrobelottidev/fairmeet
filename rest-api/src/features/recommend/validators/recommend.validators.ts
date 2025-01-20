import { z } from 'zod';

export const recommendValidationSchema = z.number().array().array();
