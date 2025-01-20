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

export const users = sqliteTable('users', {
  id: integer().primaryKey({ autoIncrement: true }),
  email: text().notNull().unique(),
  passwordSalt: text().notNull(),
});

export const FullUserSchema = z.object({
  id: z.number(),
  email: z.string(),
  passwordSalt: z.string(),
});
export const UserSchema = FullUserSchema.omit({ passwordSalt: true });

export type FullUser = z.infer<typeof FullUserSchema>;
export type User = Omit<FullUser, 'passwordSalt'>;

export const tables = {
  examples,
  users,
};
