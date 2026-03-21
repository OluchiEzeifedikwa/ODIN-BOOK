import { addComment, getAllComments, getComment, editComment, removeComment } from '../services/commentService.js';

// To create a comment
const createCommentHandler = async (req, res, next) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: 'You must be logged in to create a post' });
    }

    const { postId } = req.params;
    const { content } = req.body;

    await addComment({ content, postId, userId: req.user.id });

    res.redirect("/home");
  } catch (err) {
    console.error(err);
    next(err);
  }
};

// Get all comments
const getAllCommentsHandler = async (_req, res, next) => {
  try {
    await getAllComments();
    res.redirect('/home');
  } catch (err) {
    console.error(err);
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
    if (err.message === 'Comment not found') return res.status(404).json({ message: 'Comment not found' });
    console.error(err);
    next(err);
  }
};

// Update comment
const updateCommentHandler = async (req, res, next) => {
  try {
    const { commentId } = req.params;
    const { content } = req.body;

    await editComment(commentId, content);
    res.redirect('/home');
  } catch (err) {
    console.error(err);
    next(err);
  }
};

// Delete comment
const deleteCommentHandler = async (req, res, next) => {
  try {
    const { commentId } = req.params;
    await removeComment(commentId);
    res.redirect("/home");
  } catch (err) {
    console.error(err);
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
