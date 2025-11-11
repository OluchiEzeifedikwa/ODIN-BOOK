const { Router } = require('express');
const profileRouter = Router();
const profileController = require('../controllers/profileController');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const path = require("path");
const multer = require('multer');


const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({ storage: storage });


profileRouter.get('/editProfile/:id', profileController.getEditProfileForm);
profileRouter.get('/profiles', profileController.getProfiles);
profileRouter.get('/profiles/:id', profileController.getProfileById);
profileRouter.post('/profiles/:id', upload.single('profileImage'), profileController.updateProfile);


module.exports = profileRouter;


exports.likePost = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).render("../odinbook/views/error", { error: 'You must be logged in to like a post' });
    }
    
    const post = await prisma.post.findUnique({ where: { id: postId } });
    if (!post) {
      return res.status(404).json({ error: 'Post not found' });
    }
    
    const like = await prisma.like.findUnique({ where: { postId_userId: { postId, userId } } });
    if (like) {
      return res.status(400).json({ error: 'Already liked' });
    }
    await prisma.like.create({ data: { postId, userId } });
    const updatedPost = await prisma.post.update({
      where: { id: postId },
      data: {
        likeCount: {
          increment: 1,
        },
      },
    });
    res.json({ likes: updatedPost.likeCount });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};


exports.unlikePost = async (req, res) => {
  const postId = req.params.postId;
  const userId = req.user._id;
  try {
    const post = await prisma.post.findUnique({ where: { id: postId } });
    if (!post) {
      return res.status(404).json({ error: 'Post not found' });
    }
    const like = await prisma.like.findUnique({ where: { postId_userId: { postId, userId } } });
    if (!like) {
      return res.status(400).json({ error: 'Not liked' });
    }
    const updatedPost = await prisma.$transaction(async (tx) => {
      await tx.like.delete({ where: { postId_userId: { postId, userId } } });
      return tx.post.update({
        where: { id: postId },
        data: {
          likeCount: {
            decrement: 1,
          },
        },
      });
    });
    res.json({ likes: updatedPost.likeCount });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};
