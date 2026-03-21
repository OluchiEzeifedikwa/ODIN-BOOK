import {
  upsertFollowRequest,
  deleteFollowRequest,
} from '../repositories/followRequestRepository.js';
import { createNotification } from './notificationService.js';

// Follow a user — immediately accepted
export const sendFollowRequest = async (followerId, receiverId) => {
  const followRequest = await upsertFollowRequest(followerId, receiverId);
  await createNotification({ userId: receiverId, type: 'follow', followRequestId: followRequest.id });
  return { following: true };
};

// Unfollow a user
export const sendUnfollowRequest = async (followerId, receiverId) => {
  await deleteFollowRequest(followerId, receiverId);
  return { following: false };
};
