import pool from '../config/database';
import * as walletRepo from '../repositories/walletRepo';
import { TransferInput } from '../types/walletTypes';
import { AppError } from '../utils/AppError';

export const transferFunds = async (senderUserId: number, data: TransferInput) => {
    const { toUsername, amount } = data;
    if (amount <= 0) throw new AppError('Amount must be greater than 0', 400);

    const senderWalletRaw = await pool.query('SELECT id FROM wallets WHERE user_id = $1', [senderUserId]);
    const senderWalletId = senderWalletRaw.rows[0]?.id;
    if (!senderWalletId) throw new AppError('Sender wallet not found', 404);

    const receiverWallet = await walletRepo.findWalletByUsername(toUsername);
    if (!receiverWallet) throw new AppError('Receiver user/wallet not found', 404);
    
    if (senderWalletId === receiverWallet.id) {
        throw new AppError('Cannot transfer to yourself', 400);
    }

    const client = await pool.connect();
    
    try {
        await client.query('BEGIN');
        const senderWallet = await walletRepo.getWalletForUpdate(client, senderWalletId);

        if (parseFloat(senderWallet.balance) < amount) {
            throw new AppError('Insufficient balance', 400);
        }

        await walletRepo.deductBalance(client, senderWalletId, amount);
        await walletRepo.addBalance(client, receiverWallet.id, amount);

        const receipt = await walletRepo.createTransactionRecord(client, senderWalletId, receiverWallet.id, amount);
        await client.query('COMMIT');

        return {
            transferId: receipt.id,
            amount: amount,
            to: toUsername,
            status: 'SUCCESS',
            timestamp: receipt.created_at
        };

    } catch (error) {
        await client.query('ROLLBACK');
        throw error;
    } finally {
        client.release();
    }
};

export const getMyBalance = async (userId: number) => {
    const wallet = await walletRepo.getWalletByUserId(userId);
    if (!wallet) throw new AppError('Wallet not found', 404);
    return wallet;
};

export const topUp = async (userId: number, amount: number) => {
    if (amount <= 0) throw new AppError('Top up amount must be positive', 400);
    
    const wallet = await walletRepo.getWalletByUserId(userId);
    if (!wallet) throw new AppError('Wallet not found', 404);

    const updated = await walletRepo.topUpBalance(wallet.id, amount);
    
    return updated;
};

export const getHistory = async (userId: number) => {
    const wallet = await walletRepo.getWalletByUserId(userId);
    if (!wallet) throw new AppError('Wallet not found', 404);

    const history = await walletRepo.getTransactionHistory(wallet.id);
    return history;
};