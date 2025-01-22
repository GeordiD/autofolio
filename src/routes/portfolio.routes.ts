import { Portfolio } from '@/db/schema/portfolios';
import { portfolioService } from '@/services/portfolio.service';
import { message, messageOnlySchema } from '@/utils/routerSnippets';
import { FastifyInstance } from 'fastify';
import { ZodTypeProvider } from 'fastify-type-provider-zod';
import { z } from 'zod';

export async function portfolioRoutes(fastify: FastifyInstance) {
  const url = '/api/portfolios';

  // CREATE
  fastify.withTypeProvider<ZodTypeProvider>().route({
    method: 'POST',
    url,
    schema: {
      response: {
        200: z.object({
          result: z.custom<Portfolio>(),
          created: z.boolean(),
        }),
        500: messageOnlySchema,
      },
    },
    handler: async (req, reply) => {
      // Allow if one does not exist, otherwise fail
      // Later they'll be more to this.

      const userId = req.user.id;
      const existingPortfolio = await portfolioService.findByUserId(userId);

      if (!existingPortfolio) {
        const newPortfolio = await portfolioService.create(userId);

        if (!newPortfolio) {
          return reply.code(500).send(message('Unable to create portfolio'));
        }

        return reply.send({
          result: newPortfolio,
          created: true,
        });
      } else {
        return reply.send({
          result: existingPortfolio,
          created: false,
        });
      }
    },
  });

  // SYNC
  fastify.withTypeProvider<ZodTypeProvider>().route({
    method: 'POST',
    url: `${url}/:id/sync`,
    schema: {
      params: z.object({
        portfolioId: z.string(),
      }),
      // For testing, let's pass in a body to sync
      // In the real version it should hit the API
    },
    handler: async (req, reply) => {
      const portfolioId = Number(req.params.portfolioId);
      const isValidPortfolio = await portfolioService.findByPortfolioId(
        portfolioId
      );

      if (!isValidPortfolio) {
        return reply
          .code(404)
          .send(message(`Unable to find portfolio ${portfolioId}.`));
      }

      // TODO, pull positions?
    },
  });
}
