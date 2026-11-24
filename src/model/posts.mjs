import { z } from 'zod';

export const getPostsQuerySchema = z.object({
    username: z.string().min(1, 'username cannot be empty').optional(),
});
