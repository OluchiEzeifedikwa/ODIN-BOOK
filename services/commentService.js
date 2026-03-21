import {
  createComment,
  findComments,
  findCommentById,
  updateComment,
  deleteComment,
} from '../repositories/commentRepository.js';
import { findPostById } from '../repositories/postRepository.js';
import { createNotification } from './notificationService.js';

// Create a comment and notify the post owner (unless self-commenting)
export const addComment = async ({ content, postId, userId }) => {
  const comment = await createComment({ content, postId, userId });

  const post = await findPostById(postId, { select: { userId: true } });
  if (post && post.userId !== userId) {
    await createNotification({ userId: post.userId, type: 'comment', commentId: comment.id });
  }

  return comment;
};

// Get all comments
export const getAllComments = async () => {
  return findComments({});
};

// Get a single comment by ID
export const getComment = async (id) => {
  const comment = await findCommentById(id);
  if (!comment) throw new Error('Comment not found');
  return comment;
};

// Update a comment
export const editComment = async (id, content) => {
  return updateComment(id, { content });
};

// Delete a comment
export const removeComment = async (id) => {
  return deleteComment(id);
};
