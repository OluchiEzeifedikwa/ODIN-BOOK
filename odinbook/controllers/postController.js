const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// To render the create post form
exports.getCreatePost = async (req, res) => {
  res.render('../odinbook/views/createPost'
);
}

// Create a new post
exports.createPost = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).render("../odinbook/views/error", { error: 'You must be logged in to create a post' });
    }
    const { content } = req.body;
    const userId = req.user.id;
    const post = await prisma.post.create({
      data: {
        content,
        user: { connect: { id: userId } },
      },
    });
    // res.redirect("/home");
    console.log(post);
    res.render("../odinbook/views/post", { post });
  } catch (err) {
    console.error(err);
    res.status(500).render("../odinbook/views/error", { error: 'Failed to create post' });
  }
};

exports.createPost = async (req, res) => {
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
    res.render("../odinbook/views/post", { post });
  } catch (err) {
    console.error(err);
    res.status(500).render("../odinbook/views/error", { error: 'Failed to create post' });
  }
};



// Get all posts
exports.getAllPosts = async (req, res) => {
  try {
    const posts = await prisma.post.findMany();
    console.log(posts);
    res.render("../odinbook/views/posts", { posts });
  } catch (err) {
    console.error(err);
    res.status(500).render("../odinbook/views/error", { error: 'Failed to retrieve posts' });
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





// Update a post
exports.updatePost = async (req, res) => {
  try {
    const { id } = req.params;
    const { content } = req.body;
    const post = await prisma.post.update({
      where: { id },
      data: { content },
    });
    res.render("../odinbook/views/post", { post });
  } catch (err) {
    console.error(err);
    res.status(500).render("../odinbook/views/error", { error: 'Failed to update post' });
  }
};


// Delete a post
exports.deletePost = async (req, res) => {
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
    console.error(err);
    res.status(500).render("../odinbook/views/error", { error: 'Failed to delete post' });
  }
};

