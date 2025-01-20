import { FastifyInstance } from 'fastify';
import { ZodTypeProvider } from 'fastify-type-provider-zod';
import { z } from 'zod';

export async function templateRoutes(fastify: FastifyInstance) {
  const url = '/api/templates';

  fastify.withTypeProvider<ZodTypeProvider>().route({
    method: 'POST',
    url,
    schema: {
      body: z.object({}),
      response: {
        200: z.object({}),
      },
    },
    handler: async (req, reply) => {
      reply.send();
    },
  });

  fastify.withTypeProvider<ZodTypeProvider>().route({
    method: 'GET',
    url,
    schema: {
      response: {
        200: z.object({}),
        // 200: getAllResponse(ExampleSchema),
      },
    },
    handler: async (req, reply) => {
      reply.send();
    },
  });
}
