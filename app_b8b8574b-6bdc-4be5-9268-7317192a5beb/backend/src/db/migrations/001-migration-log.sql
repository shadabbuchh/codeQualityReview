-- System setup migration: migration_log table and utility functions

-- Create migration_log table for tracking applied migrations
CREATE TABLE IF NOT EXISTS migration_log (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL UNIQUE,
    sql_content TEXT NOT NULL,
    completed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create utility function for automatic timestamp updates
CREATE OR REPLACE FUNCTION UPDATE_UPDATED_AT_COLUMN()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;
