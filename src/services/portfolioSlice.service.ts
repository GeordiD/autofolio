import { db } from '@/db/client';
import {
  PortfolioSlice,
  portfolioSlices as table,
} from '@/db/schema/portfolioSlices';
import { and, eq, or } from 'drizzle-orm';

type PortfolioSliceKey = {
  portfolioId: number;
  security: string;
};

const byKey = (key: PortfolioSliceKey) =>
  and(eq(table.portfolioId, key.portfolioId), eq(table.security, key.security));

export class PortfolioSliceService {
  async updateSlicesTo(
    portfolioId: number,
    target: {
      security: string;
      percentage: number;
    }[]
  ) {
    const current = await this.findByPortfolio(portfolioId);
    const targetSecurities = target.map((x) => x.security);
    const currentSecurities = current.map((x) => x.security);

    const toRemove = currentSecurities.filter(
      (x) => !targetSecurities.includes(x)
    );
    const toAddOrUpdate = target.filter(
      (x) =>
        // Add if current does not have it
        !currentSecurities.includes(x.security) ||
        // Update if current percentage is different
        current.find((curr) => curr.security === x.security)?.percentage !==
          x.percentage
    );

    // TODO: This could be done in parallel
    await this.delete(toRemove.map((security) => ({ portfolioId, security })));
    const createOrUpdates = toAddOrUpdate.map((x) =>
      this.createOrUpdate({
        portfolioId,
        ...x,
      })
    );
    await Promise.all(createOrUpdates);

    return await this.findByPortfolio(portfolioId);
  }

  async createOrUpdate(value: PortfolioSlice) {
    const existing = await this.find({
      portfolioId: value.portfolioId,
      security: value.security,
    });

    if (!existing) {
      // create
      await db.insert(table).values(value);
    } else {
      await db.update(table).set(value).where(byKey(value));
    }
  }

  async findByPortfolio(portfolioId: number) {
    return db.query.portfolioSlices.findMany({
      where: eq(table.portfolioId, portfolioId),
    });
  }

  async find(key: PortfolioSliceKey) {
    return db.query.portfolioSlices.findFirst({
      where: byKey(key),
    });
  }

  async delete(keyOrKeys: PortfolioSliceKey | PortfolioSliceKey[]) {
    if (Array.isArray(keyOrKeys)) {
      return db.delete(table).where(or(...keyOrKeys.map((x) => byKey(x))));
    } else {
      return db.delete(table).where(byKey(keyOrKeys));
    }
  }
}

export const portfolioSliceService = new PortfolioSliceService();
