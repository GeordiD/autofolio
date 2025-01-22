import { portfolios } from '@/db/schema/portfolios';
import {
  integer,
  primaryKey,
  sqliteTable,
  text,
} from 'drizzle-orm/sqlite-core';

export const positions = sqliteTable(
  'positions',
  {
    portfolioId: integer()
      .notNull()
      .references(() => portfolios.id),
    security: text().notNull(),
  },
  (table) => [primaryKey({ columns: [table.portfolioId, table.security] })]
);
