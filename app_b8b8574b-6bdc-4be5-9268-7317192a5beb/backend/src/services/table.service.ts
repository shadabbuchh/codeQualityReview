import type * as schema from '../db/schema';
import type { FastifyInstance } from 'fastify';

export function makeTableService(app: FastifyInstance) {
  const repo = app.repositories.table;

  return {
    list: () => repo.findAll(),

    async get(id: string) {
      const found = await repo.findById(id);
      if (!found) throw new Error('Table not found');
      return found;
    },

    create: (data: schema.NewTable) => repo.create(data),

    update: (id: string, changes: Partial<schema.Table>) =>
      repo.update(id, changes),

    remove: (id: string) => repo.delete(id),

    async getQuickCrudTemplates(tableId: string) {
      const table = await repo.findById(tableId);
      if (!table) throw new Error('Table not found');

      const columns = table.columns as Array<{
        name: string;
        type: string;
        primaryKey?: boolean;
        nullable?: boolean;
      }>;

      // Generate CRUD templates based on table structure
      const primaryKeyColumn = columns.find(col => col.primaryKey);
      const insertableColumns = columns.filter(
        col =>
          !col.primaryKey &&
          col.name !== 'created_at' &&
          col.name !== 'updated_at'
      );

      return {
        create: {
          type: 'sql' as const,
          content: `INSERT INTO ${table.name} (${insertableColumns.map(col => col.name).join(', ')}) 
VALUES (${insertableColumns.map(() => '?').join(', ')});`,
        },
        read: {
          type: 'sql' as const,
          content: `SELECT * FROM ${table.name} WHERE ${primaryKeyColumn?.name || 'id'} = ?;`,
        },
        update: {
          type: 'sql' as const,
          content: `UPDATE ${table.name} 
SET ${insertableColumns.map(col => `${col.name} = ?`).join(', ')}
WHERE ${primaryKeyColumn?.name || 'id'} = ?;`,
        },
        delete: {
          type: 'sql' as const,
          content: `DELETE FROM ${table.name} WHERE ${primaryKeyColumn?.name || 'id'} = ?;`,
        },
      };
    },
  };
}

export type TableService = ReturnType<typeof makeTableService>;
