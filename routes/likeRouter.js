import { Router } from 'express';
import likeController from '../controllers/likeController.js';
import authMiddleware from '../middleware/authMiddleware.js';

const likeRouter = Router();

likeRouter.post('/posts/:postId/like', authMiddleware, likeController.likePost);
likeRouter.delete('/posts/:postId/unlike', authMiddleware, likeController.unlikePost);

export default likeRouter;
