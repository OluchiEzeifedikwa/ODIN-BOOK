import { likePost, unlikePost } from '../services/likeService.js';

// Like a post
const likePostHandler = async (req, res, next) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: 'You must be logged in to like a post' });
    }

    const result = await likePost(req.params.postId, req.user.id);

    res.json(result);
  } catch (err) {
    if (err.message === 'You have already liked this post') {
      return res.status(400).json({ message: err.message });
    }
    next(err);
  }
};

// Unlike a post
const unlikePostHandler = async (req, res, next) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: 'You must be logged in to unlike a post' });
    }

    const result = await unlikePost(req.params.postId, req.user.id);

    res.json(result);
  } catch (err) {
    if (err.message === "You haven't liked this post") {
      return res.status(400).json({ message: err.message });
    }
    next(err);
  }
};

export default {
  likePost: likePostHandler,
  unlikePost: unlikePostHandler,
};
