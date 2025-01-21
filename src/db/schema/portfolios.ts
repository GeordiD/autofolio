import { integer, sqliteTable } from 'drizzle-orm/sqlite-core';
import { users } from './users';
import { InferSelectModel } from 'drizzle-orm';

// Mostly just a connecting table to link many other things together
export const portfolios = sqliteTable('portfolios', {
  id: integer().primaryKey({ autoIncrement: true }),
  userId: integer()
    .notNull()
    .references(() => users.id),
  // TODO
  // Connection to schwab table
  // Connection to account balance type things
  // Linking point for targets
});

export type Portfolio = InferSelectModel<typeof portfolios>;
