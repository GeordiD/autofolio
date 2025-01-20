import { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify';
import auth from '@fastify/auth';
import jwt, { FastifyJWT } from '@fastify/jwt';
import cookie from '@fastify/cookie';

export function setupAuth(fastify: FastifyInstance) {
  fastify.register(jwt, {
    secret: '123456',
  });

  fastify.register(auth);

  fastify.addHook('preHandler', (req, res, next) => {
    req.jwt = fastify.jwt;
    return next();
  });

  // cookies
  fastify.register(cookie, {
    secret: 'some-secret-key',
    hook: 'preHandler',
  });

  fastify.decorate(
    'authenticate',
    async (req: FastifyRequest, reply: FastifyReply) => {
      const token = req.cookies.access_token;

      if (!token) {
        return reply.status(401).send({ message: 'Authentication required' });
      }
      // here decoded will be a different type by default but we want it to be of user-payload type
      const decoded = req.jwt.verify<FastifyJWT['user']>(token);
      req.user = decoded;
    }
  );
}
