const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()


// followRequestController.js
exports.sendFollowRequest = async (req, res, next) => {
  try {
    const { receiverId } = req.params;
    const followerId = req.user.id;               // the logged‑in user

    // Create a follow request (or update status if it already exists)
    await prisma.followRequest.upsert({
      where: { followerId_followingId: { followerId, followingId: receiverId } },
      update: { status: 'accepted' },
      create: { followerId, followingId: receiverId, status: 'accepted' }
    });

    // Return the current state – you can also send the whole user object
    const isFollowing = true; // after the upsert we know it’s true
    res.json({ following: isFollowing });
  } catch (err) {
    next(err);
  }
};


exports.sendUnfollowRequest = async (req, res, next) => {
  try {
    const { receiverId } = req.params;
    const followerId = req.user.id;

    await prisma.followRequest.delete({
      where: { followerId_followingId: { followerId, followingId: receiverId } }
    });

    res.json({ following: false });
  } catch (err) {
    next(err);
  }
};



// GET /follow/requests/:userId
exports.getFollowRequests = async (req, res, next) => {
  const { userId } = req.params

  try {
    const requests = await prisma.followRequest.findMany({
      where: { receiverId: userId, status: 'pending' },
      include: { follower: { select: { username: true, id: true } } }
    })
    res.render('followRequests', { requests })
  } catch (e) {
    req.flash('error', 'Failed to load requests')
    res.redirect('home')
    next(err);
  }
}

// POST /follow/requests/:requestId/accept
exports.acceptFollowRequest = async (req, res) => {

  if (!req.user) {
    req.flash('error', 'You must be logged in to unfollow');
    return res.redirect('/login');
  }

  const senderId = req.user.id;
  const { requestId } = req.params

  try {
    await prisma.followRequest.update({
      where: { id: requestId },
      data: { status: 'accepted' }
    })
    req.flash('success', 'Request accepted')
    res.redirect('home')
  } catch (e) {
    req.flash('error', 'Could not accept request')
    res.redirect('home')
    next(err);
  }
}

// POST /follow/requests/:requestId/reject
exports.rejectFollowRequest = async (req, res) => {
  const { requestId } = req.params

  try {
    await prisma.followRequest.update({
      where: { id: requestId },
      data: { status: 'rejected' }
    })
    req.flash('success', 'Request rejected')
    res.redirect('home')
  } catch (e) {
    req.flash('error', 'Could not reject request')
    res.redirect('home')
    next(err);
  }
}


