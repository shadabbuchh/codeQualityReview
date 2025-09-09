import type { FastifyRequest } from 'fastify';
import type { Services } from '../services/index';

/**
 * OpenAPI operation handlers for fastify-openapi-glue
 *
 * Maps OpenAPI operationIds to service method calls.
 * Extend this class to add handlers for new entities.
 */
export class OpenAPIServiceHandlers {
  protected services: Services;

  constructor(services: Services) {
    this.services = services;
  }

  // Connection endpoints
  async getConnections() {
    const connections = await this.services.connection.list();
    return { data: connections };
  }

  async createConnection(request: FastifyRequest) {
    const body = request.body as {
      name: string;
      type: 'database' | 'api';
      config: unknown;
      status: 'active' | 'error' | 'disconnected';
    };
    const connection = await this.services.connection.create(body);
    return { data: connection };
  }

  async getConnectionById(request: FastifyRequest) {
    const params = request.params as { id: string };
    const connection = await this.services.connection.get(params.id);
    return { data: connection };
  }

  async updateConnection(request: FastifyRequest) {
    const params = request.params as { id: string };
    const body = request.body as Partial<{
      name: string;
      type: 'database' | 'api';
      config: unknown;
      status: 'active' | 'error' | 'disconnected';
    }>;
    const connection = await this.services.connection.update(params.id, body);
    return { data: connection };
  }

  async deleteConnection(request: FastifyRequest) {
    const params = request.params as { id: string };
    await this.services.connection.remove(params.id);
    return {};
  }

  async getConnectionSchemas(request: FastifyRequest) {
    const params = request.params as { id: string };
    const schemas = await this.services.connection.getSchemas(params.id);
    return { data: schemas };
  }

  // Schema and Table endpoints
  async getTablesForSchema(request: FastifyRequest) {
    const params = request.params as { schemaId: string };
    const tables = await this.services.schema.getTables(params.schemaId);
    return { data: tables };
  }

  async getTableById(request: FastifyRequest) {
    const params = request.params as { id: string };
    const table = await this.services.table.get(params.id);
    return { data: table };
  }

  async getQuickCrudTemplates(request: FastifyRequest) {
    const params = request.params as { tableId: string };
    const templates = await this.services.table.getQuickCrudTemplates(
      params.tableId
    );
    return { data: templates };
  }

  // Draft endpoints (placeholder implementations)
  async createDraft(_request: FastifyRequest) {
    // Implementation will be added in future sub-items
    return { data: null };
  }

  async getDraftById(_request: FastifyRequest) {
    // Implementation will be added in future sub-items
    return { data: null };
  }

  async updateDraft(_request: FastifyRequest) {
    // Implementation will be added in future sub-items
    return { data: null };
  }

  async deleteDraft(_request: FastifyRequest) {
    // Implementation will be added in future sub-items
    return {};
  }

  async validateDraft(_request: FastifyRequest) {
    // Implementation will be added in future sub-items
    return { data: null };
  }
}
