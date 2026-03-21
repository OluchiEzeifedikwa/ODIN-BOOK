import express from 'express';
import followRequestController from '../controllers/followRequestController.js';
import authMiddleware from '../middleware/authMiddleware.js';

const followRequestRouter = express.Router();

followRequestRouter.post('/users/follow/:receiverId', authMiddleware, followRequestController.sendFollowRequest);
followRequestRouter.post('/users/unfollow/:receiverId', authMiddleware, followRequestController.sendUnfollowRequest);

export default followRequestRouter;
