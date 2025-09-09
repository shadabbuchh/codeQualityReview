import { eq } from 'drizzle-orm';
import type { NodePgDatabase } from 'drizzle-orm/node-postgres';
import type * as schema from '../db/schema';
import { schemas } from '../db/schema';
import { log } from '../utils/index';

export const schemaRepo = (db: NodePgDatabase<typeof schema>) => ({
  create: (p: schema.NewSchema) =>
    db
      .insert(schemas)
      .values(p)
      .returning()
      .then(r => r[0]),

  findById: (id: string) =>
    db.query.schemas.findFirst({ where: eq(schemas.id, id) }),

  findByConnectionId: (connectionId: string) =>
    db.query.schemas.findMany({
      where: eq(schemas.connectionId, connectionId),
    }),

  findAll: () => db.select().from(schemas),

  update: async (id: string, c: Partial<schema.Schema>) => {
    log.info('Updating schema');
    const [updated] = await db
      .update(schemas)
      .set(c)
      .where(eq(schemas.id, id))
      .returning();
    return updated;
  },

  delete: (id: string) => db.delete(schemas).where(eq(schemas.id, id)),
});
