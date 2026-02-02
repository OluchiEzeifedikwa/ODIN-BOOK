import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// To create a comment
const createComment = async (req, res, next) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: 'You must be logged in to create a post' });
    }

    const userId = req.user.id; 
    const { postId, content } = req.body;

    const comment = await prisma.comment.create({
      data: { content, postId, userId },
    });

    res.redirect("/home");
  } catch (err) {
    console.error(err);
    next(err);
  }
};

// Get all comments
const getAllComments = async (req, res, next) => {
  try {
    const comments = await prisma.comment.findMany();
    res.render("comment", { comments });
  } catch (err) {
    console.error(err);
    next(err);
  }
};

// Get comment by ID
const getCommentById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const comment = await prisma.comment.findUnique({ where: { id } });

    if (!comment) return res.status(404).json({ message: 'Comment not found' });

    res.render("comment", { comment });
  } catch (err) {
    console.error(err);
    next(err);
  }
};

// Update comment
const updateComment = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { content } = req.body;

    const updatedComment = await prisma.comment.update({
      where: { id },
      data: { content },
    });

    res.render("comment", { comment: updatedComment });
  } catch (err) {
    console.error(err);
    next(err);
  }
};

// Delete comment
const deleteComment = async (req, res, next) => {
  try {
    const { id } = req.params;
    await prisma.comment.delete({ where: { id } });
    res.redirect("/comments");
  } catch (err) {
    console.error(err);
    next(err);
  }
};

export default {
  createComment,
  getAllComments,
  getCommentById,
  updateComment,
  deleteComment,
};
