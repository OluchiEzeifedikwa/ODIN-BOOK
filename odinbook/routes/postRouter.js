const { Router } = require('express');
const postRouter = Router();
const postController = require('../controllers/postController');



postRouter.get('/post', (req, res) => {
    res.render('../odinbook/views/createPost');
});

postRouter.post('/post', postController.createPost);
postRouter.get('/api/posts', postController.getAllPosts);
postRouter.get('/api/post/:id', postController.getPostById);

module.exports = postRouter;
