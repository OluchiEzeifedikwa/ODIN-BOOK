const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

exports.likePost = async (req, res, next) => {
    try {
      if (!req.user) {
        return res.status(401).render("../odinbook/views/error", { error: 'You must be logged in to create a post' });
      }
      const { postId } = req.params;
      const userId = req.user.id;
      
      const like = await prisma.like.create({
        data: {
          postId,
          userId,
        },
      });
      console.log(like);
      res.json({ message: 'Post Liked' })
    //   res.redirect('/home');
 } catch (err) {
      next(err);
    }
  };


  exports.unlikePost = async (req, res, next) => {
    try {
      if (!req.user) {
        return res.status(401).json({ message: 'You must be logged in to delete a post' });
      }
  
      const { postId } = req.params;
      const unlike = await prisma.like.delete({
        where: { 
            postId_userId: {
                postId,
                userId,

            }},
      });
  
      console.log(unlike);
      res.redirect("/home");
    } catch (err) {
      next(err);
    }
  };

  const likes = await prisma.like.findMany();
  console.log(likes);
  
  
  
  
  exports.updatePost = async (req, res) => {
    const postId = req.params.id;
  
    try {
      const post = await prisma.post.update({
        where: { id: postId },
        data: { likes: { increment: 1 } },
      });
  
      res.json({ likes: post.likes });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Failed to like post' });
    }
  };

  exports.getLikesById = async (req, res) => {
    const postId = req.params.id;
  
    try {
        const post = await prisma.post.findUnique({
        where: { id: postId },
        select: {
          _count: {
            select: { likes: true },
          },
        },
      });

      res.render('post', { post });
    } catch (error) {
      console.error(error);
      res.status(500).send('Error fetching post');
    }
}
  

  