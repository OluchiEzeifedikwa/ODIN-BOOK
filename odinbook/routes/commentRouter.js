const { Router } = require('express');
const commentRouter = Router();
const commentController = require('../controllers/commentController');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

commentRouter.get('/comment', (req, res) => { 
  res.render('../odinbook/views/createComment');
})


// commentRouter.post('/createComment', commentController.createComment);
commentRouter.get('/posts/:id/comments', commentController.getAllComments);
commentRouter.post('/posts/:id/comments', commentController.createComment);
commentRouter.get('/posts/:postId/comments/:commentId', commentController.getCommentById);
commentRouter.put('/posts/:postId/comments/:commentId', commentController.updateComment);
commentRouter.delete('/posts/:postId/comments/:commentId', commentController.deleteComment);

module.exports = commentRouter;



