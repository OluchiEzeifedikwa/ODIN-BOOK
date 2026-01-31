import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Send a follow request
const sendFollowRequest = async (req, res, next) => {
  try {
    const { receiverId } = req.params;
    const followerId = req.user.id; // logged-in user

    // Create or update follow request
    await prisma.followRequest.upsert({
      where: { followerId_followingId: { followerId, followingId: receiverId } },
      update: { status: 'accepted' },
      create: { followerId, followingId: receiverId, status: 'accepted' },
    });

    const isFollowing = true; // after upsert
    res.json({ following: isFollowing });
  } catch (err) {
    next(err);
  }
};

// Send an unfollow request
const sendUnfollowRequest = async (req, res, next) => {
  try {
    const { receiverId } = req.params;
    const followerId = req.user.id;

    await prisma.followRequest.delete({
      where: { followerId_followingId: { followerId, followingId: receiverId } },
    });

    res.json({ following: false });
  } catch (err) {
    next(err);
  }
};

// Get pending follow requests for a user
const getFollowRequests = async (req, res, next) => {
  const { userId } = req.params;

  try {
    const requests = await prisma.followRequest.findMany({
      where: { receiverId: userId, status: 'pending' },
      include: { follower: { select: { username: true, id: true } } },
    });

    res.render('followRequests', { requests });
  } catch (err) {
    req.flash('error', 'Failed to load requests');
    res.redirect('home');
    next(err);
  }
};

// Accept a follow request
const acceptFollowRequest = async (req, res, next) => {
  if (!req.user) {
    req.flash('error', 'You must be logged in to accept requests');
    return res.redirect('/login');
  }

  const { requestId } = req.params;

  try {
    await prisma.followRequest.update({
      where: { id: requestId },
      data: { status: 'accepted' },
    });
    req.flash('success', 'Request accepted');
    res.redirect('home');
  } catch (err) {
    req.flash('error', 'Could not accept request');
    res.redirect('home');
    next(err);
  }
};

// Reject a follow request
export const rejectFollowRequest = async (req, res, next) => {
  const { requestId } = req.params;

  try {
    await prisma.followRequest.update({
      where: { id: requestId },
      data: { status: 'rejected' },
    });
    req.flash('success', 'Request rejected');
    res.redirect('home');
  } catch (err) {
    req.flash('error', 'Could not reject request');
    res.redirect('home');
    next(err);
  }
};


export default {
  sendFollowRequest,
  sendUnfollowRequest,
  getFollowRequests,
  acceptFollowRequest,
  rejectFollowRequest,
};
