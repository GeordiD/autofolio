import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core';
import { z } from 'zod';

export const examples = sqliteTable('examples', {
  id: integer().primaryKey({ autoIncrement: true }),
  name: text().notNull(),
});

export const ExampleSchema = z.object({
  id: z.number(),
  name: z.string().nonempty(),
});

export type Example = z.infer<typeof ExampleSchema>;
