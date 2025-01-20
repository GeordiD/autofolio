import { FastifyInstance } from 'fastify';
import { ZodTypeProvider } from 'fastify-type-provider-zod';
import { users } from '../db/schema';
import { eq } from 'drizzle-orm';
import { db } from '../db/client';
import bcrypt from 'bcrypt';
import { z } from 'zod';

async function saltPassword(password: string): Promise<string> {
  const salt = await bcrypt.genSalt(10);
  return await bcrypt.hash(password, salt);
}

export async function authRoutes(fastify: FastifyInstance) {
  const url = '/api/auth';

  // LOGIN
  fastify.withTypeProvider<ZodTypeProvider>().route({
    method: 'POST',
    url: `${url}/login`,
    schema: {
      body: z.object({
        email: z.string().min(1),
        password: z.string().min(1),
      }),
    },
    handler: async (req, reply) => {
      const { email, password } = req.body;

      const user = await db.query.users.findFirst({
        where: eq(users.email, email),
      });
      const isPasswordValid =
        !!user && (await bcrypt.compare(password, user.passwordSalt));

      if (!user || !isPasswordValid) {
        return reply.code(401).send({
          message: 'Invalid email or password',
        });
      }

      const token = req.jwt.sign({
        id: user.id,
        email: user.email,
      });

      reply.setCookie('access_token', token, {
        path: '/',
        httpOnly: true,
        secure: true,
      });

      return { accessToken: token };
    },
  });

  // LOGOUT
  fastify.withTypeProvider<ZodTypeProvider>().route({
    url: `${url}/logout`,
    method: 'POST',
    schema: {
      response: {
        200: z.object({
          message: z.string(),
        }),
      },
    },
    handler: async (req, reply) => {
      reply.clearCookie('access_token');

      return reply.send({ message: 'Logout Successful' });
    },
  });

  // CREATE ACCOUNT
  fastify.withTypeProvider<ZodTypeProvider>().route({
    url: `${url}/create`,
    method: 'POST',
    schema: {
      body: z.object({
        email: z.string().min(8),
        password: z.string().min(8),
      }),
    },
    handler: async (req, reply) => {
      // See if a user already exists with that username
      const existingUser = await db.query.users.findFirst({
        where: eq(users.email, req.body.email),
      });

      if (existingUser) {
        reply.code(409).send({
          message: 'Email already exists, try logging in.',
        });
        return;
      }

      await db.insert(users).values({
        email: req.body.email,
        passwordSalt: await saltPassword(req.body.password),
      });
    },
  });
}
