import { Router } from 'express';
import commentController from '../controllers/commentController.js';
import authMiddleware from '../middleware/authMiddleware.js';

const commentRouter = Router();

commentRouter.get('/posts/:postId/comments', authMiddleware, commentController.getAllComments);
commentRouter.post('/posts/:postId/comments', authMiddleware, commentController.createComment);
commentRouter.get('/posts/:postId/comments/:commentId', authMiddleware, commentController.getCommentById);
commentRouter.put('/posts/:postId/comments/:commentId', authMiddleware, commentController.updateComment);
commentRouter.delete('/posts/:postId/comments/:commentId', authMiddleware, commentController.deleteComment);

export default commentRouter;
