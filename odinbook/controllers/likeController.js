import { PrismaClient } from '@prisma/client';

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

    // Create like
    const like = await prisma.like.create({
      data: { postId, userId },
    });

    if (!like) {
      return res.status(400).json({ message: 'Failed to create like' });
    }

    // Increment post likeCount
    const updatedPost = await prisma.post.update({
      where: { id: postId },
      data: { likeCount: { increment: 1 } },
    });

    if (!updatedPost) {
      return res.status(400).json({ message: 'Failed to update post like count' });
    }

    res.json({ likes: updatedPost.likeCount });
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

    // Delete the like
    const deleted = await prisma.like.deleteMany({
      where: { AND: [{ postId }, { userId }] },
    });

    if (deleted.count === 0) {
      return res.status(400).json({ message: "You haven't liked this post" });
    }

    // Decrement post likeCount
    const updatedPost = await prisma.post.update({
      where: { id: postId },
      data: { likeCount: { decrement: 1 } },
    });

    res.json({ likes: updatedPost.likeCount });
  } catch (err) {
    next(err);
  }
};

export default {
    likePost,
    unlikePost,
  };
  