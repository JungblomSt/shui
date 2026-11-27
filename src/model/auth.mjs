// SCHEMAS

import { z } from 'zod';

export const loginSchema = z.object({
  username: z.string().trim().min(1, 'is required'),
  password: z.string().trim().min(1, 'is required')
});

// Stina och stina är olika användarnamn.

export const registerSchema = z.object({
  username: z
    .string()
    .trim()
    .min(3, { message: 'Username must be at least 3 characters long' })
    .max(20, { message: 'Username must be at most 20 characters long' }),
  password: z
    .string()
    .trim()
    .min(8, { message: 'Password must be at least 8 characters long' })
    .max(20, { message: 'Password must be at most 20 characters long' })
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/, { message: 'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character' })
});