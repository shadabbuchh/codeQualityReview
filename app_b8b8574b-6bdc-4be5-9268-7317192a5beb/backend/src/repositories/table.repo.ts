import { eq } from 'drizzle-orm';
import type { NodePgDatabase } from 'drizzle-orm/node-postgres';
import type * as schema from '../db/schema';
import { tables } from '../db/schema';
import { log } from '../utils/index';

export const tableRepo = (db: NodePgDatabase<typeof schema>) => ({
  create: (p: schema.NewTable) =>
    db
      .insert(tables)
      .values(p)
      .returning()
      .then(r => r[0]),

  findById: (id: string) =>
    db.query.tables.findFirst({ where: eq(tables.id, id) }),

  findBySchemaId: (schemaId: string) =>
    db.query.tables.findMany({ where: eq(tables.schemaId, schemaId) }),

  findAll: () => db.select().from(tables),

  update: async (id: string, c: Partial<schema.Table>) => {
    log.info('Updating table');
    const [updated] = await db
      .update(tables)
      .set(c)
      .where(eq(tables.id, id))
      .returning();
    return updated;
  },

  delete: (id: string) => db.delete(tables).where(eq(tables.id, id)),
});
