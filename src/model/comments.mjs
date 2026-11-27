import { z } from 'zod';

export const commentsSchema = z.object({
    content: z.string().trim().min(1, 'is required').max(750, 'cannot be more than 750 characters'),
})