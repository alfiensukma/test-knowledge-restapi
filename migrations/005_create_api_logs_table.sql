CREATE TABLE IF NOT EXISTS api_logs (
    id SERIAL PRIMARY KEY,
    endpoint VARCHAR(255) NOT NULL,
    status_code INT,
    response_body TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);