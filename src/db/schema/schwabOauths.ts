import { users } from '@/db/schema/users';
import { sql } from 'drizzle-orm';
import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core';

export const schwabOauths = sqliteTable('schwab_oauths', {
  id: integer().primaryKey({ autoIncrement: true }),
  userId: integer()
    .notNull()
    .references(() => users.id),
  id_token: text().notNull(),
  access_token: text().notNull(),
  refresh_token: text().notNull(),
  updated_at: integer({ mode: 'timestamp' })
    .default(sql`(CURRENT_TIMESTAMP)`)
    .$onUpdateFn(() => new Date()),
});
