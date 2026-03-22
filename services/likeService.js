import { findLike, createLike, deleteManyLikes, countLikes } from '../repositories/likeRepository.js';
import { findPostById } from '../repositories/postRepository.js';
import { createNotification } from './notificationService.js';

// Like a post — guards against duplicate likes and notifies post owner
export const likePost = async (postId, userId) => {
  const existingLike = await findLike(postId, userId);
  if (existingLike) throw new Error('You have already liked this post');

  const like = await createLike({ postId, userId });

  const post = await findPostById(postId, { select: { userId: true } });
  if (post && post.userId !== userId) {
    try {
      await createNotification({ userId: post.userId, type: 'like', likeId: like.id });
    } catch (e) {
      console.error('Notification error (like):', e.message);
    }
  }

  const likeCount = await countLikes(postId);
  return { likes: likeCount };
};

// Unlike a post — guards against unliking a post that wasn't liked
export const unlikePost = async (postId, userId) => {
  const deleted = await deleteManyLikes({
    where: { AND: [{ postId }, { userId }] },
  });

  if (deleted.count === 0) throw new Error("You haven't liked this post");

  const likeCount = await countLikes(postId);
  return { likes: likeCount };
};
