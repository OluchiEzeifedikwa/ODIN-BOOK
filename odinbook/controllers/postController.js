const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

exports.createPost = async (req, res) => {
//   try {
    const { username, content } = req.body;
    const post = await prisma.post.create({
      data: { 
        username, 
        content, 
    },
    });
    // res.status(201).json(post);
    // res.redirect('/api/comment');
    res.render("../odinbook/views/posts", {post, links})
    
//   } catch (err) {
//     res.status(500).json({ message: 'Failed to create post' });
//   }
};

exports.getAllPosts = async (req, res) => {
  try {
    const posts = await prisma.post.findMany();

    
    // res.status(200).json(posts);
    res.render("../odinbook/views/posts", { posts })
    // res.redirect('/api/comment');
  } catch (err) {
    res.status(500).json({ message: 'Failed to retrieve posts' });
  }
};


exports.getPostById = async (req, res) => {
  try {
    const { id } = req.params;
    const post = await prisma.post.findUnique({
      where: { id },
      include: { comments: true },
    });

    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }
    // res.redirect('/api/post')
    res.json(post);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to retrieve post' });
  }
};
