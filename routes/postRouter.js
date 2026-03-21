import { Router } from 'express';
import postController from '../controllers/postController.js';
import authMiddleware from '../middleware/authMiddleware.js';
import path from 'path';
import multer from 'multer';

const postRouter = Router();

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename: (req, file, cb) =>
    cb(null, Date.now() + path.extname(file.originalname)),
});

const upload = multer({ storage });

postRouter.get('/createPost', authMiddleware, postController.getCreatePost);
postRouter.post('/posts', authMiddleware, upload.single('postImage'), postController.createPost);
postRouter.get('/posts/:id', authMiddleware, postController.getPostById);
postRouter.post('/posts/delete/:id', authMiddleware, postController.deletePost);

export default postRouter;
