import { ZodObject, ZodRawShape, z } from 'zod';

export function getAllResponse<T extends ZodRawShape>(schema: ZodObject<T>) {
  return z.object({
    results: z.array(schema),
    totalCount: z.number(),
  });
}
