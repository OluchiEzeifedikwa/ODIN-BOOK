import { Router } from 'express';
import postController from '../controllers/postController.js';
import authMiddleware from '../middleware/authMiddleware.js';
import multer from 'multer';
import { postStorage } from '../services/cloudinary.js';

const postRouter = Router();

const upload = multer({ storage: postStorage });

postRouter.get('/createPost', authMiddleware, postController.getCreatePost);
postRouter.post('/posts', authMiddleware, upload.single('postImage'), postController.createPost);
postRouter.get('/posts/:id', authMiddleware, postController.getPostById);
postRouter.post('/posts/delete/:id', authMiddleware, postController.deletePost);

export default postRouter;
