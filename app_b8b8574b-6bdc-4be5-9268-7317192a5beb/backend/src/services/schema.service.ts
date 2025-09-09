import type * as schema from '../db/schema';
import type { FastifyInstance } from 'fastify';

export function makeSchemaService(app: FastifyInstance) {
  const repo = app.repositories.schema;

  return {
    list: () => repo.findAll(),

    async get(id: string) {
      const found = await repo.findById(id);
      if (!found) throw new Error('Schema not found');
      return found;
    },

    create: (data: schema.NewSchema) => repo.create(data),

    update: (id: string, changes: Partial<schema.Schema>) =>
      repo.update(id, changes),

    remove: (id: string) => repo.delete(id),

    async getTables(schemaId: string) {
      // First verify schema exists
      const schemaEntity = await repo.findById(schemaId);
      if (!schemaEntity) throw new Error('Schema not found');

      // Get tables for this schema
      return app.repositories.table.findBySchemaId(schemaId);
    },
  };
}

export type SchemaService = ReturnType<typeof makeSchemaService>;
