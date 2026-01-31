import { Router } from 'express';
import notificationController from '../controllers/notificationController.js';

const notificationRouter = Router();

notificationRouter.post('/notifications', notificationController.createNotificationAPI);
notificationRouter.get('/notifications', notificationController.getNotifications);
notificationRouter.post('/posts/:postId/like', notificationController.likePostNotification);
notificationRouter.post('/posts/:postId/comments', notificationController.addComment);
notificationRouter.post('/users/:userId/follow', notificationController.followUser);

export default notificationRouter;
