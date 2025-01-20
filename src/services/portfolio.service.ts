import { db } from '@/db/client';
import { portfolios } from '@/db/schema/portfolios';
import { eq } from 'drizzle-orm';

export const portfolioService = {
  findByUserId: async (userId: number) => {
    return db.query.portfolios.findFirst({
      where: eq(portfolios.userId, userId),
    });
  },

  findByPortfolioId: async (portfolioId: number) => {
    return db.query.portfolios.findFirst({
      where: eq(portfolios.id, portfolioId),
    });
  },

  create: async (userId: number) => {
    const result = await db
      .insert(portfolios)
      .values({
        userId,
      })
      .returning();

    return result.length ? result.at(0) : undefined;
  },
};
