import { Request, Response, NextFunction } from 'express';
import { UserData } from '../types/userTypes';
import * as jwt from 'jsonwebtoken';
import { catchAsync } from '../utils/catchAsync';
import { AppError } from '../utils/AppError';
import * as authRepo from '../repositories/authRepo';

export const protect = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    let token;
    if (
        req.headers.authorization &&
        req.headers.authorization.startsWith('Bearer')
    ) {
        token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
        throw new AppError('You are not logged in! Please log in to get access.', 401);
    }

    const secret = process.env.JWT_SECRET;
    const decoded = jwt.verify(token, secret as jwt.Secret) as jwt.JwtPayload;

    const currentUser = await authRepo.findUserById(decoded.id);

    if (!currentUser) {
        throw new AppError('The user belonging to this token does no longer exist.', 401);
    }

    (req as Request & { user?: UserData }).user = currentUser;

    next();
});