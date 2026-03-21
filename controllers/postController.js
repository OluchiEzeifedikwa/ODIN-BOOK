import { createNewPost, getPost, removePost } from '../services/postService.js';

// Render create post form
const getCreatePost = async (_req, res) => {
  res.render('pages/createPost');
};

// Create a new post
const createPostHandler = async (req, res, next) => {
  try {
    if (!req.user) {
      return res
        .status(401)
        .render('pages/error', {
          error: 'You must be logged in to create a post',
        });
    }

    const { content } = req.body;
    const image = req.file ? req.file.filename : null;

    await createNewPost({ content, image, userId: req.user.id });

    res.redirect('/home');
  } catch (err) {
    next(err);
  }
};

// Get post by ID
const getPostById = async (req, res, next) => {
  try {
    const { id } = req.params;

    const post = await getPost(id, { include: { comments: { include: { user: true } } } });

    res.render('pages/post', { post });
  } catch (err) {
    if (err.message === 'Post not found') {
      return res.status(404).render('pages/error', { error: 'Post not found' });
    }
    next(err);
  }
};

// Delete a post
const deletePostHandler = async (req, res, next) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: 'You must be logged in to delete a post' });
    }

    await removePost(req.params.id, req.user.id);

    res.redirect('/home');
  } catch (err) {
    if (err.message === 'Post not found') return res.status(404).json({ message: 'Post not found' });
    if (err.message === 'Not your post') return res.status(403).json({ message: 'Not your post' });
    next(err);
  }
};

// DEFAULT EXPORT
export default {
  getCreatePost,
  createPost: createPostHandler,
  getPostById,
  deletePost: deletePostHandler,
};
