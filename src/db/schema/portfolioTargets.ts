import {
  sqliteTable,
  integer,
  text,
  real,
  primaryKey,
} from 'drizzle-orm/sqlite-core';
import { portfolios } from './portfolios';
import { InferSelectModel } from 'drizzle-orm';

export const portfolioTargets = sqliteTable(
  'portfolio_targets',
  {
    portfolioId: integer()
      .notNull()
      .references(() => portfolios.id),
    security: text().notNull(),
    percentage: real().notNull().default(0),
  },
  (table) => [primaryKey({ columns: [table.portfolioId, table.security] })]
);

export type PortfolioTarget = InferSelectModel<typeof portfolioTargets>;
