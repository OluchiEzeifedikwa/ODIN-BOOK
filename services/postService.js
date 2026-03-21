import { findPostById, createPost, deletePost } from '../repositories/postRepository.js';
import { deleteNotificationsByPostId } from './notificationService.js';

// Create a new post
export const createNewPost = async ({ content, image, userId }) => {
  return createPost({ content, image, userId });
};

// Get a single post by ID with optional args
export const getPost = async (id, args = {}) => {
  const post = await findPostById(id, args);
  if (!post) throw new Error('Post not found');
  return post;
};

// Delete a post — enforces ownership
export const removePost = async (postId, userId) => {
  const post = await findPostById(postId, { select: { userId: true } });
  if (!post) throw new Error('Post not found');
  if (post.userId !== userId) throw new Error('Not your post');
  await deleteNotificationsByPostId(postId);
  return deletePost(postId);
};
