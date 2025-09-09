-- Seed sample connections for development
INSERT INTO connections (name, type, config, status) VALUES
(
    'Local Development Database',
    'database',
    '{"host": "localhost", "port": 5432, "database": "devdb",
      "dialect": "postgresql"}',
    'active'
),
(
    'Production API',
    'api',
    '{"baseUrl": "https://api.example.com", 
      "auth": {"type": "bearer"}}',
    'active'
),
(
    'Staging Database',
    'database',
    '{"host": "staging.db.example.com", "port": 5432, 
      "database": "stagingdb", "dialect": "postgresql"}',
    'disconnected'
),
(
    'Analytics API',
    'api',
    '{"baseUrl": "https://analytics.example.com/api", 
      "auth": {"type": "apikey"}}',
    'error'
);

-- Add some sample schemas for the development database connection
WITH dev_connection AS (
    SELECT id
    FROM connections
    WHERE name = 'Local Development Database'
)

INSERT INTO schemas (connection_id, name)
SELECT
    dc.id,
    s_names.schema_name
FROM dev_connection AS dc
CROSS JOIN (
    VALUES
    ('public'),
    ('user_data'),
    ('analytics')
) AS s_names (schema_name);

-- Add some sample tables for the public schema
WITH public_schema AS (
    SELECT s.id
    FROM schemas AS s
    INNER JOIN
        connections
            AS
            c
        ON
            s.connection_id
            = c.id
    WHERE
        c.name = 'Local Development Database'
        AND s.name = 'public'
)

INSERT INTO tables (schema_id, name, columns, relationships)
SELECT
    ps.id,
    td.name,
    td.columns,
    td.relationships
FROM public_schema AS ps
CROSS JOIN (
    VALUES
    (
        'users',
        '[
          {"name": "id", "type": "uuid", "primaryKey": true}, 
          {"name": "email", "type": "varchar", "nullable": false}, 
          {"name": "name", "type": "varchar", "nullable": false}, 
          {"name": "created_at", "type": "timestamp", "nullable": false}
        ]',
        '[]'
    ),
    (
        'projects',
        '[
          {"name": "id", "type": "uuid", "primaryKey": true}, 
          {"name": "name", "type": "varchar", "nullable": false}, 
          {"name": "description", "type": "text", "nullable": true}, 
          {"name": "owner_id", "type": "uuid", "nullable": false}, 
          {"name": "created_at", "type": "timestamp", "nullable": false}
        ]',
        '[
          {"type": "belongsTo", "table": "users", "localKey": "owner_id", 
           "foreignKey": "id"}
        ]'
    ),
    (
        'tasks',
        '[
          {"name": "id", "type": "uuid", "primaryKey": true}, 
          {"name": "title", "type": "varchar", "nullable": false}, 
          {"name": "status", "type": "varchar", "nullable": false}, 
          {"name": "project_id", "type": "uuid", "nullable": false}, 
          {"name": "assignee_id", "type": "uuid", "nullable": true}, 
          {"name": "created_at", "type": "timestamp", "nullable": false}
        ]',
        '[
          {"type": "belongsTo", "table": "projects", "localKey": "project_id", 
           "foreignKey": "id"}, 
          {"type": "belongsTo", "table": "users", "localKey": "assignee_id", 
           "foreignKey": "id"}
        ]'
    )
) AS td (name, columns, relationships);
