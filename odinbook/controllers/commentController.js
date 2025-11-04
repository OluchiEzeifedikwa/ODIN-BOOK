
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// To create a comment
exports.createComment = async (req, res) => {
    try {
      if (!req.user) {
        return res.status(401).json({ message: 'You must be logged in to create a comment' });
      }
    const { postId, content } = req.body;
    const userId = req.user.id; // Assuming you have the user ID in req.user
    const newComment = await prisma.comment.create({
      data: {
        content,
        post: { connect: { id: postId }},
        user: { connect: { id: userId }},
      },
    });
    const post = await prisma.post.findUnique({
      where: { id: postId },
      include: { comments: true },
    });

    
    console.log(newComment);
    console.log(post);
    res.render("../odinbook/views/comment", { post, newComment });
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





 
 



