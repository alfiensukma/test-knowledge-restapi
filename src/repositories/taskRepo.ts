import { query } from '../config/database';
import pool from '../config/database';

export const createTask = async (title: string, scheduledAt: string, payload: any) => {
    const sql = `
        INSERT INTO tasks (title, scheduled_at, payload, status)
        VALUES ($1, $2, $3, 'PENDING')
        RETURNING id, title, scheduled_at, status
    `;
    const result = await query(sql, [title, scheduledAt, JSON.stringify(payload)]);
    return result.rows[0];
};

export const pickDueTasks = async (limit: number = 5) => {
    const client = await pool.connect();
    try {
        await client.query('BEGIN');

        const findSql = `
            SELECT id, title, payload 
            FROM tasks 
            WHERE status = 'PENDING' 
              AND scheduled_at <= NOW()
            ORDER BY scheduled_at ASC
            LIMIT $1
            FOR UPDATE SKIP LOCKED 
        `;
        
        const result = await client.query(findSql, [limit]);
        const tasks = result.rows;

        if (tasks.length > 0) {
            const ids = tasks.map((t: any) => t.id);
            await client.query(`
                UPDATE tasks SET status = 'PROCESSING' WHERE id = ANY($1::int[])
            `, [ids]);
        }

        await client.query('COMMIT');
        return tasks;
    } catch (err) {
        await client.query('ROLLBACK');
        throw err;
    } finally {
        client.release();
    }
};

export const completeTask = async (id: number, status: 'COMPLETED' | 'FAILED') => {
    const sql = `
        UPDATE tasks 
        SET status = $1, executed_at = NOW()
        WHERE id = $2
    `;
    await query(sql, [status, id]);
};