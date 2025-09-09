import healthRoutes from './health.route';

/**
 * Route exports
 *
 * Health route is kept as a traditional route since it's infrastructure/monitoring,
 * not part of the business API that should be in the OpenAPI specification.
 *
 * Business API routes are now handled automatically by fastify-openapi-glue.
 */
export { healthRoutes };
