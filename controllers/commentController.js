import { addComment, getAllComments, getComment, editComment, removeComment } from '../services/commentService.js';

// To create a comment
const createCommentHandler = async (req, res, next) => {
  try {
    const { postId } = req.params;
    const { content } = req.body;

    await addComment({ content, postId, userId: req.user.id });

    res.redirect("/home");
  } catch (err) {
    next(err);
  }
};

// Get all comments for a post (returns JSON for lazy loading)
const getAllCommentsHandler = async (req, res, next) => {
  try {
    const { postId } = req.params;
    const comments = await getAllComments(postId);
    res.json(comments);
  } catch (err) {
    next(err);
  }
};

// Get comment by ID
const getCommentById = async (req, res, next) => {
  try {
    const { commentId } = req.params;
    await getComment(commentId);
    res.redirect('/home');
  } catch (err) {
    next(err);
  }
};

// Update comment
const updateCommentHandler = async (req, res, next) => {
  try {
    const { commentId } = req.params;
    const { content } = req.body;

    await editComment(commentId, req.user.id, content);
    res.redirect('/home');
  } catch (err) {
    next(err);
  }
};

// Delete comment
const deleteCommentHandler = async (req, res, next) => {
  try {
    const { commentId } = req.params;
    await removeComment(commentId, req.user.id);
    res.redirect("/home");
  } catch (err) {
    next(err);
  }
};

export default {
  createComment: createCommentHandler,
  getAllComments: getAllCommentsHandler,
  getCommentById,
  updateComment: updateCommentHandler,
  deleteComment: deleteCommentHandler,
};
