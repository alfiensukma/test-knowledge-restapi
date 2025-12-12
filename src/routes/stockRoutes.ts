import { Router } from 'express';
import * as stockController from '../controllers/stockController';
import { protect } from '../middlewares/authMiddleware';

const router = Router();

router.use(protect);

router.post('/in', protect, stockController.createStockIn);

export default router;