import {
  sqliteTable,
  integer,
  text,
  real,
  primaryKey,
} from 'drizzle-orm/sqlite-core';
import { portfolios } from './portfolios';
import { InferSelectModel } from 'drizzle-orm';

export const portfolioSlices = sqliteTable(
  'portfolio_slices',
  {
    portfolioId: integer()
      .notNull()
      .references(() => portfolios.id),
    security: text().notNull(),
    percentage: real().notNull().default(0),
  },
  (table) => ({
    pk: primaryKey({ columns: [table.portfolioId, table.security] }),
  })
);

export type PortfolioSlice = InferSelectModel<typeof portfolioSlices>;
