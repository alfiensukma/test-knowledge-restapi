import { PoolClient } from 'pg';
import { query } from '../config/database';

export const findWalletByUsername = async (username: string) => {
    const sql = `
        SELECT w.id, w.user_id, w.balance 
        FROM wallets w
        JOIN users u ON w.user_id = u.id
        WHERE u.username = $1
    `;
    const res = await query(sql, [username]);
    return res.rows[0];
};

export const getWalletForUpdate = async (client: PoolClient, walletId: number) => {
    const sql = `SELECT id, balance FROM wallets WHERE id = $1 FOR UPDATE`;
    const res = await client.query(sql, [walletId]);
    return res.rows[0];
};

export const deductBalance = async (client: PoolClient, walletId: number, amount: number) => {
    const sql = `UPDATE wallets SET balance = balance - $1 WHERE id = $2`;
    await client.query(sql, [amount, walletId]);
};

export const addBalance = async (client: PoolClient, walletId: number, amount: number) => {
    const sql = `UPDATE wallets SET balance = balance + $1 WHERE id = $2`;
    await client.query(sql, [amount, walletId]);
};

export const createTransactionRecord = async (client: PoolClient, fromId: number, toId: number, amount: number) => {
    const sql = `
        INSERT INTO wallet_transactions (from_wallet_id, to_wallet_id, amount)
        VALUES ($1, $2, $3)
        RETURNING id, created_at
    `;
    const res = await client.query(sql, [fromId, toId, amount]);
    return res.rows[0];
};

export const getWalletByUserId = async (userId: number) => {
    const sql = `SELECT id, balance, updated_at FROM wallets WHERE user_id = $1`;
    const res = await query(sql, [userId]);
    return res.rows[0];
};

export const topUpBalance = async (walletId: number, amount: number) => {
    const sql = `UPDATE wallets SET balance = balance + $1 WHERE id = $2 RETURNING balance`;
    const res = await query(sql, [amount, walletId]);
    return res.rows[0];
};

export const getTransactionHistory = async (walletId: number, limit: number = 10, offset: number = 0) => {
    const sql = `
        SELECT 
            t.id,
            t.amount,
            t.created_at,
            t.from_wallet_id,
            t.to_wallet_id,
            u_from.username AS sender_name,
            u_to.username AS receiver_name,
            CASE 
                WHEN t.from_wallet_id = $1 THEN 'DEBIT' 
                ELSE 'CREDIT' 
            END AS type
        FROM wallet_transactions t
        JOIN wallets w_from ON t.from_wallet_id = w_from.id
        JOIN users u_from ON w_from.user_id = u_from.id
        JOIN wallets w_to ON t.to_wallet_id = w_to.id
        JOIN users u_to ON w_to.user_id = u_to.id
        WHERE t.from_wallet_id = $1 OR t.to_wallet_id = $1
        ORDER BY t.created_at DESC
        LIMIT $2 OFFSET $3
    `;
    const res = await query(sql, [walletId, limit, offset]);
    return res.rows;
};