
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// To create a comment
// exports.createComment = async (req, res, next) => {
//   try {
//     if (!req.user) {
//       return res.status(401).json({ message: 'You must be logged in to create a comment' });
//     }
//     const { postId, content } = req.body;
//     const userId = req.user.id; 
//     const comment = await prisma.comment.create({
//       data: {
//         content,
//         post: { connect: { id: postId }},
//         user: { connect: { id: userId }},
//       },
//     });
    
//     console.log(comment);
    
//     res.render("../odinbook/views/comment", { 
//       links: [
//         { href: '/home', text: 'Home', icon: 'fa fa-home' },
//         { href: '/profile', text: 'Profile', icon: 'fa fa-user' },
//         { href: '/settings', text: 'Settings', icon: 'fa fa-cog' },
//       ],
//       comment,
//       user: req.user,
//     });
//   } catch (err) {
//     next(err);
//   }
// };

exports.createComment = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: 'You must be logged in to delete a post' });
    }

    const { postId, content } = req.body;
    const userId = req.user.id; 
    const comment = await prisma.comment.create({
      data: {
        content,
        post: { connect: { id: postId }},
        user: { connect: { id: userId }},
      },
    })
    

    res.redirect("/home");
    
    console.log(req.user);
    console.log(post);
  } catch (err) {
    console.error(err);
    res.status(500).render("../odinbook/views/error", { error: 'Failed to delete post' });
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





 
 



