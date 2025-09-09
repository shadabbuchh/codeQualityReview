import { readFileSync, readdirSync } from 'fs';
import { join } from 'path';
import { DatabaseConnection, type DrizzleDB } from './connection';
import type { FastifyInstance } from 'fastify';

interface SeedLogEntry {
  id: number;
  name: string;
  completed_at: Date;
}

export class SeedRunner {
  private db: DrizzleDB;
  private connection: DatabaseConnection;

  constructor(fastifyApp: FastifyInstance) {
    if (!fastifyApp?.config?.APP_DATABASE_URL) {
      throw new Error(
        'APP_DATABASE_URL not found in Fastify app.config. Ensure @fastify/env plugin is properly registered.'
      );
    }
    this.connection = DatabaseConnection.getInstance(
      fastifyApp.config.APP_DATABASE_URL
    );
    this.db = this.connection.getDb();
  }

  private getSeedFiles(): Array<{ name: string; path: string }> {
    const migrationsDir = join(process.cwd(), 'src', 'db', 'migrations');

    try {
      const files = readdirSync(migrationsDir)
        // Only numbered seed .sql files, e.g., 006-seed-initial-users.sql
        .filter(file => file.endsWith('.sql') && /^\d+-seed-/i.test(file))
        // Skip template files with placeholders if any
        .filter(
          file =>
            !file.includes('__entity__') && !file.includes('__entityPlural__')
        )
        .sort();

      return files.map(file => ({
        name: file,
        path: join(migrationsDir, file),
      }));
    } catch (error) {
      console.warn(
        `Seed SQL files directory not found: ${migrationsDir}`,
        error
      );
      return [];
    }
  }

  private async getCompletedSeeds(): Promise<Set<string>> {
    try {
      const result = await this.connection
        .getPool()
        .query<SeedLogEntry>('SELECT name FROM seed_log');
      return new Set(result.rows.map((row: SeedLogEntry) => row.name));
    } catch (error) {
      console.warn('Could not fetch completed seeds:', error);
      return new Set();
    }
  }

  private async logSeed(name: string) {
    await this.connection
      .getPool()
      .query('INSERT INTO seed_log (name) VALUES ($1)', [name]);
  }

  async runSeeds() {
    console.log('🌱 Running database seeds...');

    const seedFiles = this.getSeedFiles();
    const completedSeeds = await this.getCompletedSeeds();

    if (seedFiles.length === 0) {
      console.log('📝 No seed files found');
      return;
    }

    const failedSeeds: string[] = [];
    let successCount = 0;

    for (const { name, path } of seedFiles) {
      if (completedSeeds.has(name)) {
        console.log(`⏭️  Skipping seed ${name}: already applied`);
        continue;
      }

      console.log(`🔧 Running seed ${name}`);

      try {
        const sqlContent = readFileSync(path, 'utf-8');

        const client = await this.connection.getPool().connect();

        try {
          await client.query('BEGIN');
          await client.query(sqlContent);
          await this.logSeed(name);
          await client.query('COMMIT');

          console.log(`✅ Successfully applied seed ${name}`);
          successCount++;
        } catch (error) {
          await client.query('ROLLBACK');
          throw error;
        } finally {
          client.release();
        }
      } catch (error) {
        console.error(`❌ Error running seed ${name}:`, error);
        failedSeeds.push(name);
        continue;
      }
    }

    if (failedSeeds.length > 0) {
      console.log(
        `⚠️  Seed summary: ${successCount} successful, ${failedSeeds.length} failed`
      );
      console.log(`❌ Failed seeds: ${failedSeeds.join(', ')}`);
      throw new Error(
        `${failedSeeds.length} seed(s) failed to apply. See logs above for details.`
      );
    } else {
      console.log('✅ All seeds completed successfully!');
    }
  }

  async close() {
    await this.connection.close();
  }
}

export async function runSeeds(fastifyApp: FastifyInstance) {
  const runner = new SeedRunner(fastifyApp);
  try {
    await runner.runSeeds();
  } finally {
    await runner.close();
  }
}
