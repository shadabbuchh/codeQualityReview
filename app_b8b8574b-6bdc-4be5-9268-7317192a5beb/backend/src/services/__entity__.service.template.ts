// ⚠️  TEMPLATE FILE - DO NOT MODIFY OR DELETE ⚠️
// Copy this file to create new services (e.g., user.service.ts)
//
// TEMPLATE  –  Service factory for <Entity>
// After scaffolding:
//   1. Copy  →  src/services/user.service.ts
//   2. Replace tokens  (__entity__ → user, etc.)

import { __entity__Repo } from '../repositories/__entity__.repo.template';
import type * as schema from '../db/schema';
import type { FastifyInstance } from 'fastify';
import type { NodePgDatabase } from 'drizzle-orm/node-postgres';

export function make__Entity__Service(app: FastifyInstance) {
  const repo =
    app.repositories.__entity__ ??
    __entity__Repo(app.db as NodePgDatabase<typeof schema>);

  return {
    list: () => repo.findAll(),

    async get(id: string) {
      const found = await repo.findById(id);
      if (!found) throw new Error('<Entity> not found');
      return found;
    },

    create: (data: unknown) => repo.create(data),

    update: (id: string, changes: unknown) =>
      repo.update(id, changes),

    remove: (id: string) => repo.delete(id),
  };
}
export type __Entity__Service = ReturnType<typeof make__Entity__Service>;
