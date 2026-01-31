import { Router } from 'express';
import commentController from '../controllers/commentController.js';
import { PrismaClient } from '@prisma/client';

const commentRouter = Router();
const prisma = new PrismaClient();

commentRouter.get('/comment', (req, res) => { 
  res.render('createComment');
});

commentRouter.get('/posts/:id/comments', commentController.getAllComments);
commentRouter.post('/posts/:PostId/comments', commentController.createComment);
commentRouter.get('/posts/:id/comments/:commentId', commentController.getCommentById);
commentRouter.put('/posts/:id/comments/:commentId', commentController.updateComment);
commentRouter.delete('/posts/:id/comments/:commentId', commentController.deleteComment);

export default commentRouter;
