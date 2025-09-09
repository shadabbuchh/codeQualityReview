/**
 * ⚠️  AUTO-GENERATED FILE - DO NOT MODIFY ⚠️
 *
 * This file contains TypeScript types generated from OpenAPI specifications.
 * Use these types for type-safe API development.
 */

export interface paths {
  '/connections': {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    /** List all configured connections */
    get: operations['getConnections'];
    put?: never;
    /** Create a new connection */
    post: operations['createConnection'];
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  '/connections/{id}': {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    /** Get connection by ID */
    get: operations['getConnectionById'];
    /** Update connection */
    put: operations['updateConnection'];
    post?: never;
    /** Delete connection */
    delete: operations['deleteConnection'];
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  '/connections/{id}/schemas': {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    /** List schemas for a connection */
    get: operations['getConnectionSchemas'];
    put?: never;
    post?: never;
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  '/schemas/{id}/tables': {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    /** List tables for a schema */
    get: operations['getTablesForSchema'];
    put?: never;
    post?: never;
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  '/tables/{id}': {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    /** Get table by ID */
    get: operations['getTableById'];
    put?: never;
    post?: never;
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  '/tables/{id}/crud-templates': {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    /** Get Quick CRUD templates for table */
    get: operations['getQuickCrudTemplates'];
    put?: never;
    post?: never;
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  '/drafts': {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    get?: never;
    put?: never;
    /** Create draft (REST or SQL) */
    post: operations['createDraft'];
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  '/drafts/{id}': {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    /** Get draft by ID */
    get: operations['getDraftById'];
    /** Update draft */
    put: operations['updateDraft'];
    post?: never;
    /** Delete draft */
    delete: operations['deleteDraft'];
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  '/drafts/{id}/validate': {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    get?: never;
    put?: never;
    /** Validate draft and return warnings */
    post: operations['validateDraft'];
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
}
export type webhooks = Record<string, never>;
export interface components {
  schemas: {
    Connection: {
      /** Format: uuid */
      id: string;
      name: string;
      /** @enum {string} */
      type: 'database' | 'api';
      config: Record<string, never>;
      /** @enum {string} */
      status: 'active' | 'error' | 'disconnected';
      /** Format: date-time */
      createdAt: string;
      /** Format: date-time */
      updatedAt: string;
    };
    ConnectionCreateInput: {
      name: string;
      /** @enum {string} */
      type: 'database' | 'api';
      config: Record<string, never>;
    };
    ConnectionUpdateInput: {
      name: string;
      config: Record<string, never>;
      /** @enum {string} */
      status: 'active' | 'error' | 'disconnected';
    };
    Schema: {
      /** Format: uuid */
      id: string;
      /** Format: uuid */
      connectionId: string;
      name: string;
      /** Format: date-time */
      createdAt: string;
      /** Format: date-time */
      updatedAt: string;
    };
    Table: {
      /** Format: uuid */
      id: string;
      /** Format: uuid */
      schemaId: string;
      name: string;
      columns: components['schemas']['TableColumn'][];
      relationships: components['schemas']['TableRelationship'][];
      validationRules?: components['schemas']['ValidationRule'][];
      /** Format: date-time */
      createdAt: string;
      /** Format: date-time */
      updatedAt: string;
    };
    TableColumn: {
      name: string;
      type: string;
      nullable: boolean;
      default?: string | null;
      constraints?: string[];
    };
    TableRelationship: {
      /** @enum {string} */
      type: 'one-to-one' | 'one-to-many' | 'many-to-one' | 'many-to-many';
      targetTable: string;
      sourceColumn: string;
      targetColumn: string;
    };
    ValidationRule: {
      field: string;
      rule: string;
      params?: Record<string, never>;
    };
    RequestDraft: {
      /** Format: uuid */
      id: string;
      /** Format: uuid */
      connectionId: string;
      /** @enum {string} */
      type: 'rest' | 'sql';
      title?: string | null;
      content: string;
      validationWarnings?: components['schemas']['ValidationWarning'][];
      /** Format: date-time */
      createdAt: string;
      /** Format: date-time */
      updatedAt: string;
    };
    RequestDraftCreateInput: {
      /** Format: uuid */
      connectionId: string;
      /** @enum {string} */
      type: 'rest' | 'sql';
      title?: string | null;
      content: string;
    };
    RequestDraftUpdateInput: {
      content: string;
      title?: string | null;
    };
    ValidationWarning: {
      /** Format: uuid */
      id: string;
      /** Format: uuid */
      draftId: string;
      message: string;
      field?: string | null;
      /** @enum {string} */
      severity: 'info' | 'warning' | 'error';
      /** Format: date-time */
      createdAt: string;
      /** Format: date-time */
      updatedAt: string;
    };
    ErrorResponse: {
      code: string;
      message: string;
      details?: string;
      fieldErrors?: {
        field?: string;
        message?: string;
      }[];
    };
  };
  responses: {
    /** @description Resource not found */
    NotFoundError: {
      headers: {
        [name: string]: unknown;
      };
      content: {
        'application/json': components['schemas']['ErrorResponse'];
      };
    };
    /** @description Resource conflict (e.g. duplicate name) */
    ConflictError: {
      headers: {
        [name: string]: unknown;
      };
      content: {
        'application/json': components['schemas']['ErrorResponse'];
      };
    };
  };
  parameters: {
    ConnectionId: string;
    SchemaId: string;
    TableId: string;
    DraftId: string;
  };
  requestBodies: never;
  headers: never;
  pathItems: never;
}
export type $defs = Record<string, never>;
export interface operations {
  getConnections: {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    requestBody?: never;
    responses: {
      /** @description List of connections */
      200: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          'application/json': components['schemas']['Connection'][];
        };
      };
    };
  };
  createConnection: {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    requestBody: {
      content: {
        'application/json': components['schemas']['ConnectionCreateInput'];
      };
    };
    responses: {
      /** @description Connection created */
      201: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          'application/json': components['schemas']['Connection'];
        };
      };
      409: components['responses']['ConflictError'];
    };
  };
  getConnectionById: {
    parameters: {
      query?: never;
      header?: never;
      path: {
        id: components['parameters']['ConnectionId'];
      };
      cookie?: never;
    };
    requestBody?: never;
    responses: {
      /** @description Connection details */
      200: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          'application/json': components['schemas']['Connection'];
        };
      };
      404: components['responses']['NotFoundError'];
    };
  };
  updateConnection: {
    parameters: {
      query?: never;
      header?: never;
      path: {
        id: components['parameters']['ConnectionId'];
      };
      cookie?: never;
    };
    requestBody: {
      content: {
        'application/json': components['schemas']['ConnectionUpdateInput'];
      };
    };
    responses: {
      /** @description Connection updated */
      200: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          'application/json': components['schemas']['Connection'];
        };
      };
      404: components['responses']['NotFoundError'];
    };
  };
  deleteConnection: {
    parameters: {
      query?: never;
      header?: never;
      path: {
        id: components['parameters']['ConnectionId'];
      };
      cookie?: never;
    };
    requestBody?: never;
    responses: {
      /** @description Connection deleted */
      204: {
        headers: {
          [name: string]: unknown;
        };
        content?: never;
      };
      404: components['responses']['NotFoundError'];
    };
  };
  getConnectionSchemas: {
    parameters: {
      query?: never;
      header?: never;
      path: {
        id: components['parameters']['ConnectionId'];
      };
      cookie?: never;
    };
    requestBody?: never;
    responses: {
      /** @description List of schemas */
      200: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          'application/json': components['schemas']['Schema'][];
        };
      };
      404: components['responses']['NotFoundError'];
    };
  };
  getTablesForSchema: {
    parameters: {
      query?: never;
      header?: never;
      path: {
        id: components['parameters']['SchemaId'];
      };
      cookie?: never;
    };
    requestBody?: never;
    responses: {
      /** @description List of tables */
      200: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          'application/json': components['schemas']['Table'][];
        };
      };
      404: components['responses']['NotFoundError'];
    };
  };
  getTableById: {
    parameters: {
      query?: never;
      header?: never;
      path: {
        id: components['parameters']['TableId'];
      };
      cookie?: never;
    };
    requestBody?: never;
    responses: {
      /** @description Table details */
      200: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          'application/json': components['schemas']['Table'];
        };
      };
      404: components['responses']['NotFoundError'];
    };
  };
  getQuickCrudTemplates: {
    parameters: {
      query?: never;
      header?: never;
      path: {
        id: components['parameters']['TableId'];
      };
      cookie?: never;
    };
    requestBody?: never;
    responses: {
      /** @description CRUD templates */
      200: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          'application/json': {
            create?: string;
            read?: string;
            update?: string;
            delete?: string;
          };
        };
      };
      404: components['responses']['NotFoundError'];
    };
  };
  createDraft: {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    requestBody: {
      content: {
        'application/json': components['schemas']['RequestDraftCreateInput'];
      };
    };
    responses: {
      /** @description Draft created */
      201: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          'application/json': components['schemas']['RequestDraft'];
        };
      };
    };
  };
  getDraftById: {
    parameters: {
      query?: never;
      header?: never;
      path: {
        id: components['parameters']['DraftId'];
      };
      cookie?: never;
    };
    requestBody?: never;
    responses: {
      /** @description Draft details */
      200: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          'application/json': components['schemas']['RequestDraft'];
        };
      };
      404: components['responses']['NotFoundError'];
    };
  };
  updateDraft: {
    parameters: {
      query?: never;
      header?: never;
      path: {
        id: components['parameters']['DraftId'];
      };
      cookie?: never;
    };
    requestBody: {
      content: {
        'application/json': components['schemas']['RequestDraftUpdateInput'];
      };
    };
    responses: {
      /** @description Draft updated */
      200: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          'application/json': components['schemas']['RequestDraft'];
        };
      };
      404: components['responses']['NotFoundError'];
    };
  };
  deleteDraft: {
    parameters: {
      query?: never;
      header?: never;
      path: {
        id: components['parameters']['DraftId'];
      };
      cookie?: never;
    };
    requestBody?: never;
    responses: {
      /** @description Draft deleted */
      204: {
        headers: {
          [name: string]: unknown;
        };
        content?: never;
      };
      404: components['responses']['NotFoundError'];
    };
  };
  validateDraft: {
    parameters: {
      query?: never;
      header?: never;
      path: {
        id: components['parameters']['DraftId'];
      };
      cookie?: never;
    };
    requestBody?: never;
    responses: {
      /** @description Validation result */
      200: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          'application/json': {
            warnings?: components['schemas']['ValidationWarning'][];
          };
        };
      };
      404: components['responses']['NotFoundError'];
    };
  };
}
