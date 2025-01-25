import { schwabOauthService } from '@/services/schwab/schwabOauthService';
import { FastifyInstance } from 'fastify';
import { ZodTypeProvider } from 'fastify-type-provider-zod';
import { z } from 'zod';

export async function oauthSchwabRoutes(fastify: FastifyInstance) {
  const url = '/api/oauth/schwab';

  fastify.withTypeProvider<ZodTypeProvider>().route({
    url,
    method: 'GET',
    schema: {
      querystring: z.object({
        code: z.string(),
        session: z.string(),
      }),
    },
    handler: async (req) => {
      const userId = 1; // hardcoding for now

      await schwabOauthService.fetchToken({
        userId,
        code: req.query.code,
      });

      // TODO - redirect to whatever the home route
    },
  });

  fastify.withTypeProvider<ZodTypeProvider>().route({
    url: `${url}/:userId/refresh`,
    method: 'POST',
    schema: {
      params: z.object({
        userId: z.string(),
      }),
    },
    handler: async (req) => {
      await schwabOauthService.refreshToken(Number(req.params.userId));
    },
  });
}
