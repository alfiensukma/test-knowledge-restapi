import bcrypt from 'bcryptjs';
import * as jwt from 'jsonwebtoken';
import * as authRepo from '../repositories/authRepo';
import { AppError } from '../utils/AppError';
import { UserRegInput, LoginInput } from '../types/userTypes';

const signToken = (id: number) => {
    const secret = process.env.JWT_SECRET;
    if (!secret) {
        throw new AppError('JWT_SECRET is not defined in environment variables', 500);
    }

    const expiresIn = (process.env.JWT_EXPIRES_IN || '1d') as jwt.SignOptions['expiresIn'];
    const options: jwt.SignOptions = { expiresIn };

    return jwt.sign({ id }, secret as jwt.Secret, options);
};

export const registerUser = async (data: UserRegInput) => {
    if (data.password !== data.confirmPassword) {
        throw new AppError('Password and Confirm Password do not match', 400);
    }

    const exists = await authRepo.checkEmailOrUsernameExists(data.email, data.username);
    if (exists) {
        throw new AppError('Email or Username already exists', 400);
    }

    const saltRounds = parseInt(process.env.BCRYPT_SALT_ROUNDS || '10', 10);
    const salt = await bcrypt.genSalt(saltRounds);
    const hashedPassword = await bcrypt.hash(data.password, salt);

    const newUser = await authRepo.createUser(data, hashedPassword);
    if (newUser && 'password' in newUser) {
        const { password: _pw, ...userSafe } = newUser as any;
        return userSafe;
    }
    
    return newUser;
};

export const loginUser = async (data: LoginInput) => {
    const user = await authRepo.findUserByIdentifier(data.identifier);
    if (!user) {
        throw new AppError('Invalid email/username or password', 401);
    }

    const isMatch = await bcrypt.compare(data.password, user.password);
    if (!isMatch) {
        throw new AppError('Invalid email/username or password', 401);
    }

    const token = signToken(user.id);
  
    // delete password from output response
    delete user.password; 

    return { user, token };
};