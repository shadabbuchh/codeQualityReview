import { eq } from 'drizzle-orm';
import type { NodePgDatabase } from 'drizzle-orm/node-postgres';
import type * as schema from '../db/schema';
import { requestDrafts } from '../db/schema';
import { log } from '../utils/index';

export const requestDraftRepo = (db: NodePgDatabase<typeof schema>) => ({
  create: (p: schema.NewRequestDraft) =>
    db
      .insert(requestDrafts)
      .values(p)
      .returning()
      .then(r => r[0]),

  findById: (id: string) =>
    db.query.requestDrafts.findFirst({ where: eq(requestDrafts.id, id) }),

  findByConnectionId: (connectionId: string) =>
    db.query.requestDrafts.findMany({
      where: eq(requestDrafts.connectionId, connectionId),
    }),

  findAll: () => db.select().from(requestDrafts),

  update: async (id: string, c: Partial<schema.RequestDraft>) => {
    log.info('Updating request draft');
    const [updated] = await db
      .update(requestDrafts)
      .set(c)
      .where(eq(requestDrafts.id, id))
      .returning();
    return updated;
  },

  delete: (id: string) =>
    db.delete(requestDrafts).where(eq(requestDrafts.id, id)),
});
