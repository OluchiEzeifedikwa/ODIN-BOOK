import { Router } from 'express';
import postController from '../controllers/postController.js';
import path from 'path';
import multer from 'multer';

const postRouter = Router();

// Multer setup
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename: (req, file, cb) =>
    cb(null, Date.now() + path.extname(file.originalname)),
});

const upload = multer({ storage });
console.log('postController:', postController);

// Routes
postRouter.get('/createPost', postController.getCreatePost);
postRouter.get('/posts', postController.getAllPosts);
postRouter.post('/posts', upload.single('postImage'), postController.createPost);
postRouter.get('/posts/:id', postController.getPostById);
postRouter.post('/posts/delete/:id', postController.deletePost);

export default postRouter;
