const { Router } = require('express');
const commentRouter = Router();
const commentController = require('../controllers/commentController');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
// const methodOverride = require('method-override');

// commentRouter.use(methodOverride('_method'))



commentRouter.get('/api/comment', async (req, res) => {
    try {
      const response = await fetch('http://localhost:5000/api/posts');
      const posts = await response.json();
      const response1 = await fetch('http://localhost:5000/api/comments');
      const comments = await response1.json();
    
      

    //   const comments = await prisma.comment.findMany();
      res.render('../odinbook/views/createComment', { posts, comments });
    } catch (error) {
      console.error('Error:', error);
    }
});
   
// commentRouter.get('/createComment',  (req, res) => {
//     res.render('../blogWebsite/views/createComment');
// });

// commentRouter.post('/createComment', commentController.createComment);
commentRouter.get('/api/comments', commentController.getAllComments);
commentRouter.post('/createComment/:id/delete', commentController.deleteComment);
commentRouter.get('/createComment/:id/edit', commentController.editComment);
commentRouter.post('/createComment/:id/edit', commentController.updateComment);
commentRouter.post('/createComment', commentController.createComment);
commentRouter.get('/api/comments/:id', commentController.getCommentById)
commentRouter.post('/api/comments/:id', commentController.deleteComment);


module.exports = commentRouter;



