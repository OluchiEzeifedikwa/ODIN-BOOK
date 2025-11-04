const { Router } = require('express');
const postRouter = Router();
const postController = require('../controllers/postController');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const path = require("path");
const multer = require('multer');


const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({ storage: storage });



postRouter.get('/createPost', postController.getCreatePost);
postRouter.get('/posts', postController.getAllPosts);
postRouter.post('/posts', upload.single('postImage'), postController.createPost);
postRouter.get('/posts/:id', postController.getPostById);
postRouter.post('/posts/:id', postController.updatePost);
postRouter.delete('/posts/delete/:id', postController.deletePost);



module.exports = postRouter;
