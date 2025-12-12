import { Router } from 'express';
import * as taskController from '../controllers/taskController';
import { protect } from '../middlewares/authMiddleware';

const router = Router();

router.use(protect);

router.post('/tasks', protect, taskController.scheduleTask);

export default router;