import { eq } from 'drizzle-orm';
import type { NodePgDatabase } from 'drizzle-orm/node-postgres';
import type * as schema from '../db/schema';
import { connections } from '../db/schema';
import { log } from '../utils/index';

export const connectionRepo = (db: NodePgDatabase<typeof schema>) => ({
  create: (p: schema.NewConnection) =>
    db
      .insert(connections)
      .values(p)
      .returning()
      .then(r => r[0]),

  findById: (id: string) =>
    db.query.connections.findFirst({ where: eq(connections.id, id) }),

  findAll: () => db.select().from(connections),

  update: async (id: string, c: Partial<schema.Connection>) => {
    log.info('Updating connection');
    const [updated] = await db
      .update(connections)
      .set(c)
      .where(eq(connections.id, id))
      .returning();
    return updated;
  },

  delete: (id: string) => db.delete(connections).where(eq(connections.id, id)),
});
