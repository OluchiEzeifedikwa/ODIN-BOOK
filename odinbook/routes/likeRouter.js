import { Router } from 'express';
import likeController from '../controllers/likeController.js';

const likeRouter = Router();

likeRouter.post('/posts/:postId/like', likeController.likePost);
likeRouter.delete('/posts/:postId/unlike', likeController.unlikePost);

export default likeRouter;
