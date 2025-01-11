import { z } from 'zod';

const createGroupReqParams = z.object({
  name: z.string(),
  description: z.string(),
});

const groupValidationSchema = {
  createGroupReqParams,
};

export default groupValidationSchema;
