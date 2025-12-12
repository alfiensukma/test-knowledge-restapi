CREATE TABLE IF NOT EXISTS document_counters (
    code_type VARCHAR(20) PRIMARY KEY,
    last_sequence INT DEFAULT 0,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO document_counters (code_type, last_sequence) VALUES ('STOCK_IN', 0);