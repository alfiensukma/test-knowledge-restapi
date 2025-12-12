import { Request, Response, NextFunction } from 'express';
import { catchAsync } from '../utils/catchAsync';
import * as authService from '../services/authService';
import { AppError } from '../utils/AppError';

export const register = catchAsync(async (req: Request, res: Response) => {
    const { username, email, password, confirmPassword } = req.body;
    if (!username || !email || !password || !confirmPassword) {
        throw new AppError('Please provide all required fields', 400);
    }

    const newUser = await authService.registerUser({ username, email, password, confirmPassword });
    res.status(201).json({
        status: 'success',
        message: 'User registered successfully',
        data: newUser,
    });
});

export const login = catchAsync(async (req: Request, res: Response) => {
    const { identifier, password } = req.body;
    if (!identifier || !password) {
        throw new AppError('Please provide email/username and password', 400);
    }
    
    const { user, token } = await authService.loginUser({ identifier, password });
    res.status(200).json({
        status: 'success',
        message: 'Logged in successfully',
        token,
        data: {
        id: user.id,
        username: user.username,
        email: user.email
        }
    });
});