import { integer } from 'drizzle-orm/sqlite-core';

export const primaryKey = {
  id: integer().primaryKey({ autoIncrement: true }),
};
