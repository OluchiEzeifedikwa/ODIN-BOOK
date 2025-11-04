
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// To create a comment
exports.createComment = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: 'You must be logged in to create a comment' });
    }
    const { postId, content } = req.body;
    const userId = req.user.id; 
    const comment = await prisma.comment.create({
      data: {
        content,
        post: { connect: { id: postId }},
        user: { connect: { id: userId }},
      },
    });
    const profiles = await prisma.profile.findMany({
      include: {
        user: true,
      },
    });
    const posts = await prisma.post.findMany({
      include: {
        comments: {
          include: {
            user: true,
          },
        },
        user: {
          include: {
            profile: true,
          },
        },
      },
    });

    const post = await prisma.post.findUnique({
      where: { id: postId },
      include: {
        comments: true,
        user: true,
      },
    });
    
    
    console.log(posts);
    console.log(post);
    console.log(comment);
    res.render("../odinbook/views/comment", { 
      posts, 
      links: [
        { href: '/home', text: 'Home', icon: 'fa fa-home' },
        { href: '/profile', text: 'Profile', icon: 'fa fa-user' },
        { href: '/settings', text: 'Settings', icon: 'fa fa-cog' },
      ],
      profiles,
      post,
      comment,
      user: req.user,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to create comment' });
  }
};
// To get all comments
exports.getAllComments = async (req, res) => {
  try {
    const comments = await prisma.comment.findMany();
    res.render("../odinbook/views/comment", { comments });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to retrieve comments' });
  }
};

// To get comments by Id
exports.getCommentById = async (req, res) => {
  try {
    const { id } = req.params;
    const comment = await prisma.comment.findUnique({
      where: { id },
    });

    if (!comment) {
      return res.status(404).json({ message: 'Comment not found' });
    }
    res.render("../odinbook/views/comment", { comment });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to retrieve comment' });
  }
};

// To update a comment
exports.updateComment = async (req, res) => {
  try {
    const { id } = req.params;
    const { content } = req.body;
    const updatedComment = await prisma.comment.update({
      where: { id },
      data: { content },
    });
    res.render("../odinbook/views/comment", { comment: updatedComment });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to update comment' });
  }
};

// To delete a comment
exports.deleteComment = async (req, res) => {
  try {
    const { id } = req.params;
    await prisma.comment.delete({
      where: { id },
    });
    res.redirect("/comments");
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to delete comment' });
  }
};





 
 



