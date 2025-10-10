import { z } from 'zod';

export const validateEnv = <T extends z.ZodRawShape>(schema: z.ZodObject<T>) => {
  const parsed = schema.safeParse(process.env);

  if (!parsed.success) {
    console.error('❌ Invalid environment variables:', parsed.error.flatten().fieldErrors);
    throw new Error('Invalid environment variables');
  }

  return parsed.data;
};

export const isPaginationValid = (page: number, limit: number): boolean => {
  return page > 0 && limit > 0 && limit <= 100;
};
