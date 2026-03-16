import { PrismaClient } from '@prisma/client';
import { createNotification } from './notificationController.js';

const prisma = new PrismaClient();

// Send a follow request
const sendFollowRequest = async (req, res, next) => {
  try {
    if (!req.user) return res.status(401).json({ message: 'You must be logged in' });

    const { receiverId } = req.params;
    const followerId = req.user.id;

    // Create or update follow request
    const followRequest = await prisma.followRequest.upsert({
      where: { followerId_followingId: { followerId, followingId: receiverId } },
      update: { status: 'accepted' },
      create: { followerId, followingId: receiverId, status: 'accepted' },
    });

    // Notify the person being followed
    await createNotification({ userId: receiverId, type: 'follow', followRequestId: followRequest.id });

    const isFollowing = true; // after upsert
    res.json({ following: isFollowing });
  } catch (err) {
    next(err);
  }
};

// Send an unfollow request
const sendUnfollowRequest = async (req, res, next) => {
  try {
    if (!req.user) return res.status(401).json({ message: 'You must be logged in' });

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
  if (!req.user) return res.redirect('/login');

  const { userId } = req.params;

  if (userId !== req.user.id) {
    req.flash('error', 'Not authorized');
    return res.redirect('/home');
  }

  try {
    const requests = await prisma.followRequest.findMany({
      where: { followingId: userId, status: 'pending' },
      include: { follower: { select: { username: true, id: true } } },
    });

    res.render('followRequests', { requests, title: 'Follow Requests' });
  } catch (err) {
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
    const request = await prisma.followRequest.findUnique({ where: { id: requestId } });

    if (!request || request.followingId !== req.user.id) {
      req.flash('error', 'Not authorized');
      return res.redirect('/home');
    }

    await prisma.followRequest.update({
      where: { id: requestId },
      data: { status: 'accepted' },
    });
    req.flash('success', 'Request accepted');
    res.redirect('/home');
  } catch (err) {
    next(err);
  }
};

// Reject a follow request
const rejectFollowRequest = async (req, res, next) => {
  if (!req.user) {
    req.flash('error', 'You must be logged in to reject requests');
    return res.redirect('/login');
  }

  const { requestId } = req.params;

  try {
    const request = await prisma.followRequest.findUnique({ where: { id: requestId } });

    if (!request || request.followingId !== req.user.id) {
      req.flash('error', 'Not authorized');
      return res.redirect('/home');
    }

    await prisma.followRequest.update({
      where: { id: requestId },
      data: { status: 'rejected' },
    });
    req.flash('success', 'Request rejected');
    res.redirect('/home');
  } catch (err) {
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
