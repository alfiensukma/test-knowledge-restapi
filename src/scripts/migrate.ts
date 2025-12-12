import fs from 'fs';
import path from 'path';
import pool from '../config/database';

const migrate = async () => {
    const client = await pool.connect();

    try {
        await client.query(`
        CREATE TABLE IF NOT EXISTS _migrations (
            id SERIAL PRIMARY KEY,
            filename VARCHAR(255) NOT NULL,
            executed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
        `);

        const migrationsDir = path.join(__dirname, '../../migrations');
        const files = fs.readdirSync(migrationsDir).sort();

        for (const file of files) {
        if (!file.endsWith('.sql')) continue;

        const check = await client.query('SELECT * FROM _migrations WHERE filename = $1', [file]);
        if (check.rowCount === 0) {
            console.log(`Executing: ${file}`);
            
            const filePath = path.join(migrationsDir, file);
            const sql = fs.readFileSync(filePath, 'utf-8');

            await client.query('BEGIN');
            try {
                await client.query(sql);
                await client.query('INSERT INTO _migrations (filename) VALUES ($1)', [file]);
                await client.query('COMMIT');
                console.log(`Success: ${file}`);
            } catch (err) {
                await client.query('ROLLBACK');
                console.error(`Failed: ${file}`);
                throw err;
            }
        } else {
            console.log(`Skipping: ${file} (Already executed)`);
        }
        }

    } catch (error) {
        console.error('Migration Error:', error);
    } finally {
        client.release();
        pool.end();
    }
};

migrate();