import { db } from '@/db/client';
import {
  PortfolioTarget,
  portfolioTargets as table,
} from '@/db/schema/portfolioTargets';
import { and, eq, or } from 'drizzle-orm';

type PortfolioTargetKey = {
  portfolioId: number;
  security: string;
};

const byKey = (key: PortfolioTargetKey) =>
  and(eq(table.portfolioId, key.portfolioId), eq(table.security, key.security));

export class PortfolioTargetService {
  async updateTargetsTo(
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
    if (toRemove.length) {
      await this.delete(
        toRemove.map((security) => ({ portfolioId, security }))
      );
    }

    if (toAddOrUpdate) {
      const createOrUpdates = toAddOrUpdate.map((x) =>
        this.createOrUpdate({
          portfolioId,
          ...x,
        })
      );
      await Promise.all(createOrUpdates);
    }

    return await this.findByPortfolio(portfolioId);
  }

  async createOrUpdate(value: PortfolioTarget) {
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
    return db.query.portfolioTargets.findMany({
      where: eq(table.portfolioId, portfolioId),
    });
  }

  async find(key: PortfolioTargetKey) {
    return db.query.portfolioTargets.findFirst({
      where: byKey(key),
    });
  }

  async delete(keyOrKeys: PortfolioTargetKey | PortfolioTargetKey[]) {
    if (Array.isArray(keyOrKeys)) {
      return db.delete(table).where(or(...keyOrKeys.map((x) => byKey(x))));
    } else {
      return db.delete(table).where(byKey(keyOrKeys));
    }
  }
}

export const portfolioTargetService = new PortfolioTargetService();
