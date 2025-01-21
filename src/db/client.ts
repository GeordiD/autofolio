import { drizzle } from 'drizzle-orm/libsql';
import { users } from './schema/users';
import { examples } from './schema/examples';
import { portfolioTargets } from './schema/portfolioTargets';
import { portfolios } from './schema/portfolios';

export const db = drizzle(process.env.DB_FILE_NAME!, {
  schema: {
    examples,
    users,
    portfolios,
    portfolioTargets,
  },
});
