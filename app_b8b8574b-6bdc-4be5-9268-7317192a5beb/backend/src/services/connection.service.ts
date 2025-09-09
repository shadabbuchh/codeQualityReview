import type * as schema from '../db/schema';
import type { FastifyInstance } from 'fastify';

export function makeConnectionService(app: FastifyInstance) {
  const repo = app.repositories.connection;

  return {
    list: () => repo.findAll(),

    async get(id: string) {
      const found = await repo.findById(id);
      if (!found) throw new Error('Connection not found');
      return found;
    },

    create: (data: schema.NewConnection) => repo.create(data),

    update: (id: string, changes: Partial<schema.Connection>) =>
      repo.update(id, changes),

    remove: (id: string) => repo.delete(id),

    async getSchemas(connectionId: string) {
      // First verify connection exists
      const connection = await repo.findById(connectionId);
      if (!connection) throw new Error('Connection not found');

      // Get schemas for this connection
      return app.repositories.schema.findByConnectionId(connectionId);
    },
  };
}

export type ConnectionService = ReturnType<typeof makeConnectionService>;
