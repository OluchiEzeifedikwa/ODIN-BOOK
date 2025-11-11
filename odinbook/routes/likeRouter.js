const { Router } = require('express');
const likeRouter = Router();
const likeController = require('../controllers/likeController');

likeRouter.post('/posts/:postId/like', likeController.likePost);
likeRouter.delete('/posts/:postId/unlike', likeController.unlikePost);


module.exports = likeRouter;



