import { z } from 'zod';

export const getPostsQuerySchema = z.object({
    username: z.string().min(1, 'username cannot be empty').optional(),
});

export const postSchema = z.object({
    title: z.string().trim().min(1, 'is required').max(50, 'cannot be more than 50 characters'),
    content: z.string().trim().min(1, 'is required').max(1000, 'cannot be more than 1000 characters'),
})