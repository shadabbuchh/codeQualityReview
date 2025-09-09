-- Create enums
CREATE TYPE connection_type AS ENUM ('database', 'api');
CREATE TYPE connection_status AS ENUM ('active', 'error', 'disconnected');
CREATE TYPE request_type AS ENUM ('rest', 'sql');
CREATE TYPE validation_severity AS ENUM ('info', 'warning', 'error');

-- Create connections table
CREATE TABLE connections (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(100) NOT NULL,
    type CONNECTION_TYPE NOT NULL,
    config JSONB NOT NULL,
    status CONNECTION_STATUS NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- Create schemas table
CREATE TABLE schemas (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    connection_id UUID NOT NULL REFERENCES connections (id),
    name VARCHAR(100) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- Create tables table
CREATE TABLE tables (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    schema_id UUID NOT NULL REFERENCES schemas (id),
    name VARCHAR(100) NOT NULL,
    columns JSONB NOT NULL,
    relationships JSONB NOT NULL,
    validation_rules JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- Create request_drafts table
CREATE TABLE request_drafts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    connection_id UUID NOT NULL REFERENCES connections (id),
    type REQUEST_TYPE NOT NULL,
    title VARCHAR(100),
    content TEXT NOT NULL,
    validation_warnings JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- Create validation_warnings table
CREATE TABLE validation_warnings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    draft_id UUID NOT NULL REFERENCES request_drafts (id),
    message VARCHAR(255) NOT NULL,
    field VARCHAR(100),
    severity VALIDATION_SEVERITY NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- Create indexes for performance
CREATE INDEX idx_schemas_connection_id ON schemas (connection_id);
CREATE INDEX idx_tables_schema_id ON tables (schema_id);
CREATE INDEX idx_request_drafts_connection_id ON request_drafts (connection_id);
CREATE INDEX idx_validation_warnings_draft_id ON validation_warnings (draft_id);

-- Create triggers to update updated_at columns
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_connections_updated_at
BEFORE UPDATE ON connections
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_schemas_updated_at
BEFORE UPDATE ON schemas
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_tables_updated_at
BEFORE UPDATE ON tables
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_request_drafts_updated_at
BEFORE UPDATE ON request_drafts
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_validation_warnings_updated_at
BEFORE UPDATE ON validation_warnings
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
