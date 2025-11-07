const { Router } = require('express');
const likeRouter = Router();
const likeController = require('../controllers/likeController');

likeRouter.post('/posts/:postId/like', likeController.likePost);
likeRouter.post('/posts/:postId/like', likeController.updatePost);
likeRouter.delete('/posts/:postId/unlike', likeController.unlikePost);
likeRouter.get('/posts/:id', likeController.getLikesById);

module.exports = likeRouter;



