import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import type { FastifyInstance } from 'fastify';

export type DrizzleDB = ReturnType<typeof drizzle>;

export class DatabaseConnection {
  private static instance: DatabaseConnection | null;
  private pool: Pool;
  private db: DrizzleDB;

  private constructor(databaseUrl: string) {
    this.pool = new Pool({ connectionString: databaseUrl });
    this.db = drizzle(this.pool);
  }

  static getInstance(databaseUrl: string): DatabaseConnection {
    if (!databaseUrl) {
      throw new Error('Database URL is required');
    }

    if (!DatabaseConnection.instance) {
      DatabaseConnection.instance = new DatabaseConnection(databaseUrl);
    }
    return DatabaseConnection.instance;
  }

  getDb(): DrizzleDB {
    return this.db;
  }

  getPool(): Pool {
    return this.pool;
  }

  async close() {
    await this.pool.end();
    DatabaseConnection.instance = null;
  }
}

// Convenience function to get database instance
// Requires a Fastify instance to access validated config
export function getDatabase(fastifyApp: FastifyInstance): DrizzleDB {
  if (!fastifyApp?.config?.APP_DATABASE_URL) {
    throw new Error(
      'APP_DATABASE_URL not found in Fastify app.config. Ensure @fastify/env plugin is properly registered.'
    );
  }
  return DatabaseConnection.getInstance(
    fastifyApp.config.APP_DATABASE_URL
  ).getDb();
}

// Convenience function to get pool instance
// Requires a Fastify instance to access validated config
export function getPool(fastifyApp: FastifyInstance): Pool {
  if (!fastifyApp?.config?.APP_DATABASE_URL) {
    throw new Error(
      'APP_DATABASE_URL not found in Fastify app.config. Ensure @fastify/env plugin is properly registered.'
    );
  }
  return DatabaseConnection.getInstance(
    fastifyApp.config.APP_DATABASE_URL
  ).getPool();
}
