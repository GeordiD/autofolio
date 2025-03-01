import { JWT } from '@fastify/jwt';

// adding jwt property to req
// authenticate property to FastifyInstance
declare module 'fastify' {
  interface FastifyRequest {
    jwt: JWT;
  }
  export interface FastifyInstance {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    authenticate: any;
  }
}

type UserPayload = {
  id: number;
  email: string;
  name: string;
};

declare module '@fastify/jwt' {
  interface FastifyJWT {
    user: UserPayload;
  }
}
