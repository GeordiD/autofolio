import Fastify from 'fastify';
import {
  serializerCompiler,
  validatorCompiler,
} from 'fastify-type-provider-zod';
import { setupAuth } from './auth';
import { setupLogger } from './setupLogger';
import { setupRoutes } from '@/routes/routes';

const env =
  process.env.ENVIRONMENT === 'development' ? 'development' : 'production';

const app = Fastify({
  logger: setupLogger(env),
});

setupAuth(app);

// Add schema validator and serializer
app.setValidatorCompiler(validatorCompiler);
app.setSerializerCompiler(serializerCompiler);

setupRoutes(app);

export const initServer = async () => {
  try {
    await app.listen({ port: 3000 });
  } catch (err) {
    app.log.error(err);
    process.exit(1);
  }
};
