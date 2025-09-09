-- Create seed_log table for tracking completed seed runs
CREATE TABLE IF NOT EXISTS seed_log (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL UNIQUE,
    completed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
