// ⚠️  TEMPLATE FILE - DO NOT MODIFY OR DELETE ⚠️
// Copy this file to create new repositories (e.g., user.repo.ts)

// import { eq } from 'drizzle-orm';
import type { NodePgDatabase } from 'drizzle-orm/node-postgres';
import type * as schema from '../db/schema';
// import { __entityPlural__ } from '../db/schema';
// import { log } from '../utils/index';

export const __entity__Repo = (_db: NodePgDatabase<typeof schema>) => ({
  create: (_p: unknown) => {
    throw new Error('Template file - replace __entityPlural__ with actual table');
  },

  findById: (_id: string) => {
    throw new Error('Template file - replace __entityPlural__ with actual table');
  },

  findAll: () => {
    throw new Error('Template file - replace __entityPlural__ with actual table');
  },

  update: async (_id: string, _c: unknown) => {
    throw new Error('Template file - replace __entityPlural__ with actual table');
  },

  delete: (_id: string) => {
    throw new Error('Template file - replace __entityPlural__ with actual table');
  },
});
