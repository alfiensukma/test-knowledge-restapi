import { Request, Response } from 'express';
import { catchAsync } from '../utils/catchAsync';
import * as stockService from '../services/stockService';
import { AppError } from '../utils/AppError';

export const createStockIn = catchAsync(async (req: Request, res: Response) => {
    const { productId, qty } = req.body;

    if (!productId || !qty || qty <= 0) {
        throw new AppError('Invalid product ID or quantity', 400);
    }

    const result = await stockService.addStock({ productId, qty });

    res.status(201).json({
        status: 'success',
        message: 'Stock added successfully',
        data: result
    });
});