import fp from 'fastify-plugin';
import type { FastifyInstance } from 'fastify';
import { runMigrations } from '../db/migrations';
import { runSeeds } from '../db/seed-runner';
import { log } from '../utils/logger';

// Startup hook that runs database migrations and seeds before the server starts
// Fails startup if migration fails, but allows startup to continue if seeds fail
export default fp(async (app: FastifyInstance) => {
  app.addHook('onReady', async () => {
    // Run migrations first - these are critical and will fail startup if they fail
    try {
      log.info('Running database migrations on startup...');
      await runMigrations(app);
      log.info('Database migrations completed successfully');
    } catch (error: unknown) {
      const errorToLog =
        error instanceof Error ? error : new Error(String(error));
      log.error({ err: errorToLog }, 'Failed to run database migrations');
      log.error('Failing startup due to database migration error');
      process.exit(1);
    }

    // Run seeds separately - these are optional and won't fail startup
    try {
      log.info('Running database seeds on startup...');
      await runSeeds(app);
      log.info('Database seeds completed successfully');
    } catch (seedError: unknown) {
      const errorToLog =
        seedError instanceof Error ? seedError : new Error(String(seedError));
      log.error({ err: errorToLog }, 'Failed to run database seeds');
      log.warn(
        '⚠️  Seed migration failed, but application will continue running'
      );
      log.warn('You may need to run seeds manually or fix the seed scripts');
    }

    log.info('✅ Database setup completed successfully');
  });
});
