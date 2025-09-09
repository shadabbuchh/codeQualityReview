// ---------------------------------------------------------------------------
// repositories/index.ts
// ---------------------------------------------------------------------------
// • During "template phase" it compiles because the ambient declarations in
//   template‑placeholders.d.ts give every token the type `any`.
// • After you scaffold a real entity (user, product, …):
//     1. Copy the repo template → user.repo.ts
//     2. Replace __entity__ → user  etc.
//     3. Append `user: userRepo(app.db),` below.
// ---------------------------------------------------------------------------

import type { FastifyInstance } from 'fastify';
import type { NodePgDatabase } from 'drizzle-orm/node-postgres';
import type * as schema from '../db/schema';

// 1️⃣  Import repository factories here.
// The .template.ts suffix keeps this compiling until you rename the file.
import { __entity__Repo } from './__entity__.repo.template'; // 🡄 token import
import { connectionRepo } from './connection.repo';
import { schemaRepo } from './schema.repo';
import { tableRepo } from './table.repo';
import { requestDraftRepo } from './request-draft.repo';

// 2️⃣  Build and return an object where every repo already has app.db injected.
export const buildRepositories = (app: FastifyInstance) => ({
  __entity__: __entity__Repo(app.db as NodePgDatabase<typeof schema>), // 🡄 token entry
  connection: connectionRepo(app.db as NodePgDatabase<typeof schema>),
  schema: schemaRepo(app.db as NodePgDatabase<typeof schema>),
  table: tableRepo(app.db as NodePgDatabase<typeof schema>),
  requestDraft: requestDraftRepo(app.db as NodePgDatabase<typeof schema>),
});

// 3️⃣  Helper type — used in src/types/fastify.d.ts for `app.repositories`.
export type Repositories = ReturnType<typeof buildRepositories>;
