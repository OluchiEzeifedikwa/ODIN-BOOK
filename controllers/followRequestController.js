import {
  sendFollowRequest,
  sendUnfollowRequest,
} from '../services/followRequestService.js';

// Follow a user
const sendFollowRequestHandler = async (req, res, next) => {
  try {
    const result = await sendFollowRequest(req.user.id, req.params.receiverId);
    res.json(result);
  } catch (err) {
    next(err);
  }
};

// Unfollow a user
const sendUnfollowRequestHandler = async (req, res, next) => {
  try {
    const result = await sendUnfollowRequest(req.user.id, req.params.receiverId);
    res.json(result);
  } catch (err) {
    next(err);
  }
};

export default {
  sendFollowRequest: sendFollowRequestHandler,
  sendUnfollowRequest: sendUnfollowRequestHandler,
};
