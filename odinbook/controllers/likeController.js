import { PrismaClient } from '@prisma/client';
import { createNotification } from './notificationController.js';

const prisma = new PrismaClient();

// Like a post
const likePost = async (req, res, next) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: 'You must be logged in to like a post' });
    }

    const { postId } = req.params;
    const userId = req.user.id;

    // Check if already liked
    const existingLike = await prisma.like.findUnique({
      where: { postId_userId: { postId, userId } },
    });

    if (existingLike) {
      return res.status(400).json({ message: 'You have already liked this post' });
    }

    const like = await prisma.like.create({
      data: { postId, userId },
    });

    const likeCount = await prisma.like.count({ where: { postId } });

    // Notify the post owner (skip if they liked their own post)
    const post = await prisma.post.findUnique({ where: { id: postId }, select: { userId: true } });
    if (post && post.userId !== userId) {
      await createNotification({ userId: post.userId, type: 'like', likeId: like.id });
    }

    res.json({ likes: likeCount });
  } catch (err) {
    next(err);
  }
};

// Unlike a post
const unlikePost = async (req, res, next) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: 'You must be logged in to unlike a post' });
    }

    const { postId } = req.params;
    const userId = req.user.id;

    const deleted = await prisma.like.deleteMany({
      where: { AND: [{ postId }, { userId }] },
    });

    if (deleted.count === 0) {
      return res.status(400).json({ message: "You haven't liked this post" });
    }

    const likeCount = await prisma.like.count({ where: { postId } });
    res.json({ likes: likeCount });
  } catch (err) {
    next(err);
  }
};

export default {
    likePost,
    unlikePost,
  };
  