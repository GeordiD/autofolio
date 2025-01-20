import { portfolioService } from '@/services/portfolio.service';
import { portfolioSliceService } from '@/services/portfolioSlice.service';
import { message, messageOnlySchema } from '@/utils/routerSnippets';
import { FastifyInstance } from 'fastify';
import { ZodTypeProvider } from 'fastify-type-provider-zod';
import { z } from 'zod';

export async function portfolioSlicesRoutes(fastify: FastifyInstance) {
  const url = '/api/portfolios/:portfolioId/slices';

  fastify.withTypeProvider<ZodTypeProvider>().route({
    method: 'PUT',
    url,
    schema: {
      params: z.object({
        portfolioId: z.string(),
      }),
      body: z.array(
        z.object({
          security: z.string(),
          percentage: z.number(),
        })
      ),
      response: {
        200: z.array(
          z.object({
            security: z.string(),
            percentage: z.number(),
          })
        ),
        404: messageOnlySchema,
      },
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

      const result = await portfolioSliceService.updateSlicesTo(
        portfolioId,
        req.body
      );

      reply.send(result);
    },
  });

  fastify.withTypeProvider<ZodTypeProvider>().route({
    method: 'GET',
    url,
    schema: {
      params: z.object({
        portfolioId: z.string(),
      }),
      response: {
        200: z.array(
          z.object({
            security: z.string(),
            percentage: z.number(),
            portfolioId: z.number(),
          })
        ),
        404: messageOnlySchema,
      },
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

      const results = await portfolioSliceService.findByPortfolio(portfolioId);

      reply.send(results);
    },
  });
}
