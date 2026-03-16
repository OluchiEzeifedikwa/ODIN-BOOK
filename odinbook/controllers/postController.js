import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Render create post form
const getCreatePost = async (req, res) => {
  res.render('createPost');
};

// Create a new post
const createPost = async (req, res, next) => {
  try {
    if (!req.user) {
      return res
        .status(401)
        .render('error', {
          error: 'You must be logged in to create a post',
        });
    }

    const { content } = req.body;
    const image = req.file ? req.file.filename : null;

    await prisma.post.create({
      data: {
        content,
        image,
        userId: req.user.id,
      },
    });

    res.redirect('/home');
  } catch (err) {
    next(err);
  }
};

// Get all posts
const getAllPosts = async (req, res, next) => {
  try {
    if (!req.user) {
      return res
        .status(401)
        .render('error', {
          error: 'You must be logged in to view posts',
        });
    }

    const posts = await prisma.post.findMany({
      where: {
        OR: [
          { userId: req.user.id },
          {
            user: {
              followers: {
                some: {
                  followerId: req.user.id,
                  status: 'accepted',
                },
              },
            },
          },
        ],
      },
      include: {
        user: true,
        _count: { select: { likes: true, comments: true } },
        likes: { where: { userId: req.user.id } },
      },
      orderBy: { createdAt: 'desc' },
    });

    posts.forEach(post => {
      post.isLiked = post.likes.length > 0;
    });

    res.redirect('/home');
  } catch (err) {
    next(err);
  }
};

// Get post by ID
const getPostById = async (req, res, next) => {
  try {
    const { id } = req.params;

    const post = await prisma.post.findUnique({
      where: { id },
      include: { comments: true },
    });

    if (!post) {
      return res
        .status(404)
        .render('error', {
          error: 'Post not found',
        });
    }

    res.render('post', { post });
  } catch (err) {
    next(err);
  }
};

// Delete a post
const deletePost = async (req, res, next) => {
  try {
    if (!req.user) {
      return res
        .status(401)
        .json({ message: 'You must be logged in to delete a post' });
    }

    const { id } = req.params;
    await prisma.post.delete({ where: { id } });

    res.redirect('/home');
  } catch (err) {
    next(err);
  }
};

// ✅ DEFAULT EXPORT
export default {
  getCreatePost,
  createPost,
  getAllPosts,
  getPostById,
  deletePost,
};
