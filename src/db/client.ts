import { drizzle } from 'drizzle-orm/libsql';
import { tables } from './schema';

export const db = drizzle(process.env.DB_FILE_NAME!, { schema: tables });
