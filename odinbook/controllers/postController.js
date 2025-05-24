const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

exports.createPost = async (req, res) => {
//   try {
    const { id, content } = req.body;
    const post = await prisma.post.create({
      data: {
        content, 
        user: {connect: {id}, },
    },
    });
    // res.status(201).json(post);
    // res.redirect('/comment');
    res.render("../odinbook/views/posts", {post});
    
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
