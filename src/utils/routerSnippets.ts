import { z } from 'zod';

export const message = (msg: string) => ({
  message: msg,
});

export const messageOnlySchema = z.object({
  message: z.string(),
});
