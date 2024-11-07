import z from 'zod';

const fetchUserProfileSchema = z.object({
  params: z.object({
    id: z.string().min(1, { message: 'User id missing' }),
  }),
});

const userValidationSchema = {
  fetchUserProfileSchema,
};

export default userValidationSchema;
