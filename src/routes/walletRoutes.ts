import { Router } from 'express';
import * as walletController from '../controllers/walletController';
import { protect } from '../middlewares/authMiddleware';

const router = Router();

router.use(protect);

router.get('/balance', walletController.getBalance);
router.get('/transactions', walletController.getHistory);
router.post('/topup', walletController.topUp);
router.post('/transfer', walletController.transfer);

export default router;