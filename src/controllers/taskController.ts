import { Request, Response } from 'express';
import { catchAsync } from '../utils/catchAsync';
import * as taskRepo from '../repositories/taskRepo';

export const scheduleTask = catchAsync(async (req: Request, res: Response) => {
    const { title, scheduledAt, payload } = req.body;
    const newTask = await taskRepo.createTask(title, scheduledAt, payload || {});

    res.status(201).json({
        status: 'success',
        message: 'Task scheduled successfully',
        data: newTask
    });
});