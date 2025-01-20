import Fastify from 'fastify';
import { exampleRoutes } from '../routes/example.routes';
import {
  serializerCompiler,
  validatorCompiler,
} from 'fastify-type-provider-zod';
import { authRoutes } from '../routes/auth.routes';
import { setupAuth } from './auth';
import { setupLogger } from './setupLogger';

const env =
  process.env.ENVIRONMENT === 'development' ? 'development' : 'production';

const app = Fastify({
  logger: setupLogger(env),
});

setupAuth(app);

// Add schema validator and serializer
app.setValidatorCompiler(validatorCompiler);
app.setSerializerCompiler(serializerCompiler);

app.register((instance) => {
  instance.addHook('preHandler', app.authenticate);

  // Protected Routes
  app.register(exampleRoutes);
});

// Unprotected Routes
app.register(authRoutes);

export const initServer = async () => {
  try {
    await app.listen({ port: 3000 });
  } catch (err) {
    app.log.error(err);
    process.exit(1);
  }
};
