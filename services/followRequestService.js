import {
  upsertFollowRequest,
  deleteManyFollowRequests,
} from '../repositories/followRequestRepository.js';
import { findUserById } from '../repositories/userRepository.js';
import { createNotification } from './notificationService.js';
import { httpError } from './httpError.js';

// Follow a user — immediately accepted
export const sendFollowRequest = async (followerId, receiverId) => {
  if (followerId === receiverId) throw httpError(400, "You can't follow yourself");
  if (!(await findUserById(receiverId))) throw httpError(404, 'User not found');

  const followRequest = await upsertFollowRequest(followerId, receiverId);
  try {
    await createNotification({ userId: receiverId, type: 'follow', followRequestId: followRequest.id });
  } catch (e) {
    console.error('Notification error (follow):', e.message);
  }
  return { following: true };
};

// Unfollow a user — succeeds even if not currently following (e.g. a double click)
export const sendUnfollowRequest = async (followerId, receiverId) => {
  await deleteManyFollowRequests({ where: { followerId, followingId: receiverId } });
  return { following: false };
};
