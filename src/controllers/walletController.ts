import { Request, Response } from 'express';
import { UserData } from '../types/userTypes';
import { catchAsync } from '../utils/catchAsync';
import * as walletService from '../services/walletService';
import { AppError } from '../utils/AppError';

export const transfer = catchAsync(async (req: Request & { user?: UserData }, res: Response) => {
    const { toUsername, amount } = req.body;
    const senderId = req.user?.id;

    if (!senderId) throw new AppError('User ID missing', 401);
    if (!toUsername || !amount) throw new AppError('Missing required fields', 400);

    const result = await walletService.transferFunds(senderId, { toUsername, amount });

    res.status(200).json({
        status: 'success',
        message: 'Transfer successful',
        data: result
    });
});

export const getBalance = catchAsync(async (req: Request & { user?: UserData }, res: Response) => {
    const userId = req.user?.id!;
    const data = await walletService.getMyBalance(userId);
    res.status(200).json({ status: 'success', data });
});

export const topUp = catchAsync(async (req: Request & { user?: UserData }, res: Response) => {
    const userId = req.user?.id!;
    const { amount } = req.body;
    
    const data = await walletService.topUp(userId, amount);
    res.status(200).json({ status: 'success', message: 'Top up successful', data });
});

export const getHistory = catchAsync(async (req: Request & { user?: UserData }, res: Response) => {
    const userId = req.user?.id!;
    const data = await walletService.getHistory(userId);
    res.status(200).json({ status: 'success', results: data.length, data });
});