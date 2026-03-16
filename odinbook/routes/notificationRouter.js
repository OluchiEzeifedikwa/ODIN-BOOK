import { Router } from 'express';
import notificationController from '../controllers/notificationController.js';

const notificationRouter = Router();

notificationRouter.get('/notifications',         notificationController.getNotifications);
notificationRouter.post('/notifications/read-all', notificationController.markAllRead);

export default notificationRouter;
