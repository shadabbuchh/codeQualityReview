import {
  pgTable,
  uuid,
  varchar,
  timestamp,
  text,
  jsonb,
  pgEnum,
} from 'drizzle-orm/pg-core';

// Workspace domain enums
export const connectionTypeEnum = pgEnum('connection_type', [
  'database',
  'api',
]);
export const connectionStatusEnum = pgEnum('connection_status', [
  'active',
  'error',
  'disconnected',
]);
export const requestTypeEnum = pgEnum('request_type', ['rest', 'sql']);
export const validationSeverityEnum = pgEnum('validation_severity', [
  'info',
  'warning',
  'error',
]);

// Workspace domain tables
export const connections = pgTable('connections', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: varchar('name', { length: 100 }).notNull(),
  type: connectionTypeEnum('type').notNull(),
  config: jsonb('config').notNull(),
  status: connectionStatusEnum('status').notNull(),
  createdAt: timestamp('created_at', { withTimezone: true })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true })
    .defaultNow()
    .notNull(),
});

export const schemas = pgTable('schemas', {
  id: uuid('id').primaryKey().defaultRandom(),
  connectionId: uuid('connection_id')
    .notNull()
    .references(() => connections.id),
  name: varchar('name', { length: 100 }).notNull(),
  createdAt: timestamp('created_at', { withTimezone: true })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true })
    .defaultNow()
    .notNull(),
});

export const tables = pgTable('tables', {
  id: uuid('id').primaryKey().defaultRandom(),
  schemaId: uuid('schema_id')
    .notNull()
    .references(() => schemas.id),
  name: varchar('name', { length: 100 }).notNull(),
  columns: jsonb('columns').notNull(),
  relationships: jsonb('relationships').notNull(),
  validationRules: jsonb('validation_rules'),
  createdAt: timestamp('created_at', { withTimezone: true })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true })
    .defaultNow()
    .notNull(),
});

export const requestDrafts = pgTable('request_drafts', {
  id: uuid('id').primaryKey().defaultRandom(),
  connectionId: uuid('connection_id')
    .notNull()
    .references(() => connections.id),
  type: requestTypeEnum('type').notNull(),
  title: varchar('title', { length: 100 }),
  content: text('content').notNull(),
  validationWarnings: jsonb('validation_warnings'),
  createdAt: timestamp('created_at', { withTimezone: true })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true })
    .defaultNow()
    .notNull(),
});

export const validationWarnings = pgTable('validation_warnings', {
  id: uuid('id').primaryKey().defaultRandom(),
  draftId: uuid('draft_id')
    .notNull()
    .references(() => requestDrafts.id),
  message: varchar('message', { length: 255 }).notNull(),
  field: varchar('field', { length: 100 }),
  severity: validationSeverityEnum('severity').notNull(),
  createdAt: timestamp('created_at', { withTimezone: true })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true })
    .defaultNow()
    .notNull(),
});

// Type exports
export type Connection = typeof connections.$inferSelect;
export type NewConnection = typeof connections.$inferInsert;

export type Schema = typeof schemas.$inferSelect;
export type NewSchema = typeof schemas.$inferInsert;

export type Table = typeof tables.$inferSelect;
export type NewTable = typeof tables.$inferInsert;

export type RequestDraft = typeof requestDrafts.$inferSelect;
export type NewRequestDraft = typeof requestDrafts.$inferInsert;

export type ValidationWarning = typeof validationWarnings.$inferSelect;
export type NewValidationWarning = typeof validationWarnings.$inferInsert;
