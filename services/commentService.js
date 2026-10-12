import {
  createComment,
  findComments,
  findCommentById,
  updateComment,
  deleteComment,
} from '../repositories/commentRepository.js';
import { findPostById } from '../repositories/postRepository.js';
import { createNotification } from './notificationService.js';
import { httpError } from './httpError.js';

const MAX_COMMENT_LENGTH = 1000;

// Trim and validate comment text
const cleanContent = (content) => {
  const text = typeof content === 'string' ? content.trim() : '';
  if (!text) throw httpError(400, "Comment can't be empty");
  if (text.length > MAX_COMMENT_LENGTH) {
    throw httpError(400, `Comments can be at most ${MAX_COMMENT_LENGTH} characters`);
  }
  return text;
};

// Load a comment and make sure it belongs to the current user
const findOwnComment = async (id, userId) => {
  const comment = await findCommentById(id);
  if (!comment) throw httpError(404, 'Comment not found');
  if (comment.userId !== userId) throw httpError(403, 'Not your comment');
  return comment;
};

// Create a comment and notify the post owner (unless self-commenting)
export const addComment = async ({ content, postId, userId }) => {
  const text = cleanContent(content);

  const post = await findPostById(postId, { select: { userId: true } });
  if (!post) throw httpError(404, 'Post not found');

  const comment = await createComment({ content: text, postId, userId });

  if (post.userId !== userId) {
    try {
      await createNotification({ userId: post.userId, type: 'comment', commentId: comment.id });
    } catch (e) {
      console.error('Notification error (comment):', e.message);
    }
  }

  return comment;
};

// Get all comments for a post — only public fields, never the commenter's email or password hash
export const getAllComments = async (postId) => {
  return findComments({
    where: { postId },
    orderBy: { createdAt: 'asc' },
    select: {
      id: true,
      content: true,
      createdAt: true,
      userId: true,
      user: { select: { username: true, profile: { select: { image: true } } } },
    },
  });
};

// Get a single comment by ID
export const getComment = async (id) => {
  const comment = await findCommentById(id);
  if (!comment) throw httpError(404, 'Comment not found');
  return comment;
};

// Update a comment — only its author can
export const editComment = async (id, userId, content) => {
  const text = cleanContent(content);
  await findOwnComment(id, userId);
  return updateComment(id, { content: text });
};

// Delete a comment — only its author can
export const removeComment = async (id, userId) => {
  await findOwnComment(id, userId);
  return deleteComment(id);
};
