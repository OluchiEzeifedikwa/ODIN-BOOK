import { createNewPost, getPost, removePost } from '../services/postService.js';

// Render create post form
const getCreatePost = async (_req, res) => {
  res.render('pages/createPost', { error: null, content: '' });
};

// Create a new post
const createPostHandler = async (req, res, next) => {
  try {
    const { content } = req.body;
    const image = req.file ? req.file.path : null;

    await createNewPost({ content, image, userId: req.user.id });

    res.redirect('/home');
  } catch (err) {
    next(err);
  }
};

// Rejected post or image (400): show the form again with the message and what the user typed
// eslint-disable-next-line no-unused-vars
const createPostError = (err, req, res, next) => {
  if (err.statusCode !== 400) return next(err);
  res.status(400).render('pages/createPost', { error: err.message, content: req.body?.content || '' });
};

// Get post by ID
const getPostById = async (req, res, next) => {
  try {
    const { id } = req.params;

    const post = await getPost(id, {
      include: { comments: { include: { user: { select: { username: true } } } } },
    });

    res.render('pages/post', { post });
  } catch (err) {
    next(err);
  }
};

// Delete a post
const deletePostHandler = async (req, res, next) => {
  try {
    await removePost(req.params.id, req.user.id);
    res.redirect('/home');
  } catch (err) {
    next(err);
  }
};

// DEFAULT EXPORT
export default {
  getCreatePost,
  createPost: createPostHandler,
  createPostError,
  getPostById,
  deletePost: deletePostHandler,
};
