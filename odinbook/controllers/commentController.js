const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();


// To create a comment
exports.createComment = async (req, res) => {
//   try {
    const { id, content } = req.body;
    const newComment = await prisma.comment.create({
      data: {
        id,
        content,
      },  
      })
    res.render("../odinbook/views/posts", {newComment});
}
    
    // res.redirect('/api/comment');
//   } catch (err) {
//     res.status(500).json({ message: 'Failed to create comment' });
//   }


// To get all comments
exports.getAllComments = async (req, res) => {
  try {
    const comments = await prisma.comment.findMany();
    res.status(200).json(comments);
  } catch (err) {
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
    // res.redirect('/api/post')
    res.json(comment);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to retrieve comment' });
  }
};

// To delete a comment
exports.deleteComment = async (req, res) => {
 try {
    
    const commentId = req.params.id
    await prisma.comment.delete({
      where: { 
        id : commentId },
    });
    // res.redirect('/api/post')
    res.status(200).json('comment deleted Successfully');
  } catch (err) {
    res.status(500).json({ message: 'Failed to delete comments' });
   }
};

// To edit a comment
 exports.updateComment = async (req, res) => {
  try {
     
     const commentId = req.params.id
     const { comment } = req.body;
     await prisma.comment.update({
       where: { id : commentId },
       data: { comment }
     });
     res.status(200).json('comment updated Successfully');
   } catch (err) {
     res.status(500).json({ message: 'Failed to update comments' });
    }
 };
 



