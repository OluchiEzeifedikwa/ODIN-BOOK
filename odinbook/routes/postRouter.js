const { Router } = require('express');
const postRouter = Router();
const postController = require('../controllers/postController');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();


postRouter.get('/post', postController.getCreatePost);
postRouter.get('/posts', postController.getAllPosts);
postRouter.post('/posts', postController.createPost);
postRouter.get('/posts/:id', postController.getPostById);
postRouter.put('/posts/:id', postController.updatePost);
postRouter.delete('/posts/:id', postController.deletePost);

module.exports = postRouter;
