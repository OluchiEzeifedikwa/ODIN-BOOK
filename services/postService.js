import { findPostById, createPost, deletePost } from '../repositories/postRepository.js';
import { deleteNotificationsByPostId } from './notificationService.js';
import { httpError } from './httpError.js';

const MAX_POST_LENGTH = 2000;

// Create a new post
export const createNewPost = async ({ content, image, userId }) => {
  const text = typeof content === 'string' ? content.trim() : '';
  if (!text) throw httpError(400, "Post can't be empty");
  if (text.length > MAX_POST_LENGTH) {
    throw httpError(400, `Posts can be at most ${MAX_POST_LENGTH} characters`);
  }
  return createPost({ content: text, image, userId });
};

// Get a single post by ID with optional args
export const getPost = async (id, args = {}) => {
  const post = await findPostById(id, args);
  if (!post) throw httpError(404, 'Post not found');
  return post;
};

// Delete a post — enforces ownership
export const removePost = async (postId, userId) => {
  const post = await findPostById(postId, { select: { userId: true } });
  if (!post) throw httpError(404, 'Post not found');
  if (post.userId !== userId) throw httpError(403, 'Not your post');
  await deleteNotificationsByPostId(postId);
  return deletePost(postId);
};
