import express, { Application, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import { globalErrorHandler } from './middlewares/errorHandler';
import { AppError } from './utils/AppError';

import authRoutes from './routes/authRoutes';
import stockRoutes from './routes/stockRoutes';
import integrationRoutes from './routes/integrationRoutes';
import taskRoutes from './routes/taskRoutes';
import walletRoutes from './routes/walletRoutes';
import reportRoutes from './routes/reportRoutes';

const app: Application = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.get('/', (req, res) => {
    res.status(200).json({ message: 'Server is running with Raw SQL setup!' });
});
app.use('/api/auth', authRoutes);
app.use('/api', stockRoutes);
app.use('/api', integrationRoutes);
app.use('/api', taskRoutes);
app.use('/api/wallet', walletRoutes);
app.use('/api/reports', reportRoutes);

// Handle 404
app.all(/.*/, (req: Request, res: Response, next: NextFunction) => {
    next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

app.use(globalErrorHandler);

export default app;