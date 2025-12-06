const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// To render the create post form
exports.getCreatePost = async (req, res) => {
  res.render('../odinbook/views/createPost'
);
}

// Create a new post
exports.createPost = async (req, res, next) => {
  try {
    if (!req.user) {
      return res.status(401).render("../odinbook/views/error", { error: 'You must be logged in to create a post' });
    }

    const { content } = req.body;
    const userId = req.user.id;
    const image = req.file ? req.file.filename : null;

    const post = await prisma.post.create({
      data: {
        content,
        image,
        user: { connect: { id: userId } },
      },
    });
    console.log(post);
    res.redirect('/home');
    // res.render("../odinbook/views/post", { post });
  } catch (err) {
    next(err);
  }
};



// Get all posts
exports.getAllPosts = async (req, res, next) => {
  try {
    const posts = await prisma.post.findMany({
    where: {
      OR :[
        { userId: req.user.id},
        {
          user: {                     // relation to the post author
        followers: {
          some: {
            followerId: req.user.id,
            status: 'accepted'   // only accepted follows
          }
        }
      }
    }
    ]
    },
    include: {
      user: true,
      _count: { select: { likes: true, comments: true } }
    },
    orderBy: { createdAt: 'desc' }
  });

  console.log(posts);
  res.render("../odinbook/views/posts", { posts });
  } catch (err) {
    next(err);
  }
};

// Get a post by id

exports.getPostById = async (req, res) => {
  try {
    const { id } = req.params;
    const post = await prisma.post.findUnique({
      where: { id },
      include: { comments: true },
    });
    if (!post) {
      return res.status(404).render("../odinbook/views/error", { error: 'Post not found' });
    }
    res.render("../odinbook/views/post", { post });
  } catch (err) {
    console.error(err);
    res.status(500).render("../odinbook/views/error", { error: 'Failed to retrieve post' });
  }
};


// Delete a post
exports.deletePost = async (req, res, next) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: 'You must be logged in to delete a post' });
    }

    const { id } = req.params;
    const post = await prisma.post.findUnique({
      where: { id },
      include: { user: true },
    });

    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    if (post.user.id !== req.user.id) {
      return res.status(403).json({ message: 'You do not have permission to delete this post' });
    }

    await prisma.post.delete({
      where: { id },
    });

    res.redirect("/home");
  } catch (err) {
    next(err);
  }
};

