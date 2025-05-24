const { Router } = require('express');
const commentRouter = Router();
const commentController = require('../controllers/commentController');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
// const methodOverride = require('method-override');

// commentRouter.use(methodOverride('_method'))


commentRouter.get('/comment', (req, res) => { 
  res.render('../odinbook/views/createComment');
})


// commentRouter.post('/createComment', commentController.createComment);
commentRouter.get('/api/comments', commentController.getAllComments);
commentRouter.delete('/createComment/:id/delete', commentController.deleteComment);
commentRouter.put('/createComment/:id/edit', commentController.updateComment);
commentRouter.post('/post', commentController.createComment);
commentRouter.get('/api/comments/:id', commentController.getCommentById)
commentRouter.post('/api/comments/:id', commentController.deleteComment);


module.exports = commentRouter;



