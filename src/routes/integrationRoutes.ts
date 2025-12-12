import { Router } from 'express';
import * as integrationController from '../controllers/integrationController';
import { protect } from '../middlewares/authMiddleware';

const router = Router();

router.use(protect);

router.get('/rates', protect, integrationController.getRates);

export default router;