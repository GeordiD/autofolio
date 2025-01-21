import { FastifyInstance } from 'fastify';
import { exampleRoutes } from '../routes/example.routes';
import { authRoutes } from '../routes/auth.routes';
import { portfolioRoutes } from '@/routes/portfolio.routes';
import { portfolioTargetRoutes } from '@/routes/portfolioTargets.routes';

export const setupRoutes = (app: FastifyInstance) => {
  app.register((instance) => {
    instance.addHook('preHandler', app.authenticate);

    // Protected Routes
    app.register(exampleRoutes);
    app.register(portfolioRoutes);
    app.register(portfolioTargetRoutes);
  });

  // Unprotected Routes
  app.register(authRoutes);
};
