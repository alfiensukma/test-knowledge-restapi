import { Request, Response } from 'express';
import { catchAsync } from '../utils/catchAsync';
import * as reportService from '../services/reportService';

export const getStockReport = catchAsync(async (req: Request, res: Response) => {
    const report = await reportService.generateStockReport();

    res.status(200).json({
        status: 'success',
        message: 'Stock summary report generated successfully',
        data: report
    });
});