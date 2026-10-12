import { likePost, unlikePost } from '../services/likeService.js';

// Like a post
const likePostHandler = async (req, res, next) => {
  try {
    const result = await likePost(req.params.postId, req.user.id);
    res.json(result);
  } catch (err) {
    next(err);
  }
};

// Unlike a post
const unlikePostHandler = async (req, res, next) => {
  try {
    const result = await unlikePost(req.params.postId, req.user.id);
    res.json(result);
  } catch (err) {
    next(err);
  }
};

export default {
  likePost: likePostHandler,
  unlikePost: unlikePostHandler,
};
