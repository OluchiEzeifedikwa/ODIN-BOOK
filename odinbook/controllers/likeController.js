const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

exports.likePost = async (req, res, next) => {
    try {
      if (!req.user) {
        return res.status(401).json({ message: 'You must be logged in to like a post' });
      }
      const { postId } = req.params;
      const userId = req.user.id;
      const existingLike = await prisma.like.findUnique({
        where: {
          postId_userId: {
            postId,
            userId,
          },
        },
      });
      console.log(existingLike);
      if (existingLike) {
        return res.status(400).json({ message: 'You have already liked this post' });
      }
      const like = await prisma.like.create({
        data: {
          postId,
          userId,
        },
      });
      console.log(like);
      if (!like) {
        return res.status(400).json({ message: 'You have created a like' });
      }

      const updatedPost = await prisma.post.update({
        where: { id: postId },
        data: {
          likeCount: {
            increment: 1,
          },
        },
      });
      if (!updatedPost) {
        return res.status(400).json({ message: 'You have updated a post' });
      }
      console.log(updatedPost);
      res.json({ likes: updatedPost.likeCount, name: user.username });
    } catch (err) {
      next(err);
    }
  };

  
  exports.unlikePost = async (req, res, next) => {
    try {
      if (!req.user) {
        return res.status(401).json({ message: 'You must be logged in to unlike a post' });
      }
      const { postId } = req.params;
      const userId = req.user.id;
      const deleted = await prisma.like.deleteMany({
        where: {
          AND: [
            { postId: postId },
            { userId: userId },
          ],
        },
      });
      
      console.log(deleted);
      if (deleted.count === 0) {
        // Handle the case where the like doesn't exist
        return res.status(400).json({ message: 'You haven\'t liked this post' });
      }
      const updatedPost = await prisma.post.update({
        where: { id: postId },
        data: {
          likeCount: {
            decrement: 1,
          },
        },
      });
      console.log(!updatedPost);
      res.json({ likes: updatedPost.likeCount });
    } catch (err) {
      next(err);
    }
  };
  