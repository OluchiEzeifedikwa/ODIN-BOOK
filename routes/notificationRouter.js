import { Router } from 'express';
import notificationController from '../controllers/notificationController.js';
import authMiddleware from '../middleware/authMiddleware.js';

const notificationRouter = Router();

notificationRouter.get('/notifications', authMiddleware, notificationController.getNotifications);
notificationRouter.post('/notifications/read-all', authMiddleware, notificationController.markAllRead);

export default notificationRouter;
