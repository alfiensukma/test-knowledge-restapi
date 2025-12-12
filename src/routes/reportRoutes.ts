import { Router } from 'express';
import * as reportController from '../controllers/reportController';
import { protect } from '../middlewares/authMiddleware';

const router = Router();

router.use(protect);

router.get('/stock-summary', protect, reportController.getStockReport);

export default router;