import pool from '../config/database';
import * as stockRepo from '../repositories/stockRepo';
import { StockInInput } from '../types/stockTypes';
import { AppError } from '../utils/AppError';

export const addStock = async (data: StockInInput) => {
    const client = await pool.connect();

    try {
        await client.query('BEGIN');

        const currentSeq = await stockRepo.getNextSequence(client, 'STOCK_IN');
        const nextSeq = currentSeq + 1;

        await stockRepo.incrementSequence(client, 'STOCK_IN', nextSeq);

        const date = new Date();
        const dateCode = `${date.getFullYear()}${(date.getMonth() + 1).toString().padStart(2, '0')}${date.getDate()}`;
        const sequenceStr = nextSeq.toString().padStart(4, '0'); // 0001
        const transactionCode = `IN-${dateCode}-${sequenceStr}`;
        const newTransaction = await stockRepo.createStockIn(
            client, 
            transactionCode, 
            data.productId, 
            data.qty
        );

        await stockRepo.updateProductStock(client, data.productId, data.qty);
        await client.query('COMMIT');
        
        return newTransaction;

    } catch (error) {
        await client.query('ROLLBACK');
        throw error;
    } finally {
        client.release();
    }
};