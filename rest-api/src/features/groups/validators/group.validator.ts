import { z } from 'zod';

// Validation for creating a group
const createGroupReqParams = z.object({
  name: z
    .string()
    .min(1, 'Group name is required')
    .max(50, 'Group name must be under 50 characters'),
  description: z.string().optional(),
});

// Validation for adding or removing members
const modifyGroupMemberParams = z.object({
  userId: z.string(),
  groupId: z.string(),
});

const groupValidationSchema = {
  createGroupReqParams,
  modifyGroupMemberParams,
};

export default groupValidationSchema;
