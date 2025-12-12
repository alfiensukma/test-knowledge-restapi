import { PoolClient } from 'pg';
import pool from '../config/database';

export const getNextSequence = async (client: PoolClient, type: string) => {
    const sql = `
        SELECT last_sequence 
        FROM document_counters 
        WHERE code_type = $1 
        FOR UPDATE
    `;
    const res = await client.query(sql, [type]);
    return res.rows[0]?.last_sequence || 0;
};

export const incrementSequence = async (client: PoolClient, type: string, newValue: number) => {
    const sql = `UPDATE document_counters SET last_sequence = $1 WHERE code_type = $2`;
    await client.query(sql, [newValue, type]);
};

export const createStockIn = async (client: PoolClient, code: string, productId: number, qty: number) => {
    const sql = `
        INSERT INTO stock_ins (code, product_id, qty)
        VALUES ($1, $2, $3)
        RETURNING id, code, created_at
    `;
    const res = await client.query(sql, [code, productId, qty]);
    return res.rows[0];
};

export const updateProductStock = async (client: PoolClient, productId: number, qty: number) => {
    const sql = `
        UPDATE products 
        SET stock = stock + $1 
        WHERE id = $2
    `;
    await client.query(sql, [qty, productId]);
};