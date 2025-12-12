import { Request, Response } from 'express';
import { catchAsync } from '../utils/catchAsync';
import * as integrationService from '../services/integrationService';
import { AppError } from '../utils/AppError';

export const getRates = catchAsync(async (req: Request, res: Response) => {
    const from = req.query.from as string;
    const to = req.query.to as string;

    if (!from || !to) {
        throw new AppError('Please provide "from" and "to" currency codes', 400);
    }

    const data = await integrationService.getExchangeRate(from.toUpperCase(), to.toUpperCase());

    res.status(200).json({
        status: 'success',
        message: 'Exchange rate fetched successfully',
        data
    });
});