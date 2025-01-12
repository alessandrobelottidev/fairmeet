import { z } from 'zod';

// Validation for sending a message
const sendMessageParams = z.object({
  content: z
    .string()
    .min(1, 'Message content cannot be empty')
    .max(500, 'Message content exceeds 500 characters'),
  groupId: z.string().uuid('Invalid group ID format'),
});

// Validation for message-specific operations
const messageOperationParams = z.object({
  messageId: z.string().uuid('Invalid message ID format'),
  groupId: z.string().uuid('Invalid group ID format'),
});

const messageValidationSchema = {
  sendMessageParams,
  messageOperationParams,
};

export default messageValidationSchema;
