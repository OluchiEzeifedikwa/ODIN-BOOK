import { Router } from 'express';
import postController from '../controllers/postController.js';
import authMiddleware from '../middleware/authMiddleware.js';
import { imageUpload } from '../middleware/imageUpload.js';
import { postStorage } from '../services/cloudinary.js';

const postRouter = Router();

postRouter.get('/createPost', authMiddleware, postController.getCreatePost);
postRouter.post('/posts', authMiddleware, imageUpload(postStorage, 'postImage'), postController.createPost, postController.createPostError);
postRouter.get('/posts/:id', authMiddleware, postController.getPostById);
postRouter.post('/posts/delete/:id', authMiddleware, postController.deletePost);

export default postRouter;
