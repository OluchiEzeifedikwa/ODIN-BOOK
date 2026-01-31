import express from 'express';
import followRequestController from '../controllers/followRequestController.js';

const followRequestRouter = express.Router();

// Send a follow request
followRequestRouter.post('/users/follow/:receiverId', followRequestController.sendFollowRequest);

// Send an unfollow request
followRequestRouter.post('/users/unfollow/:receiverId', followRequestController.sendUnfollowRequest);

// List pending requests for a user
followRequestRouter.get('/follow/requests/:userId', followRequestController.getFollowRequests);

// Accept / reject a request
followRequestRouter.post('/follow/requests/:requestId/accept', followRequestController.acceptFollowRequest);
followRequestRouter.post('/follow/requests/:requestId/reject', followRequestController.rejectFollowRequest);

export default followRequestRouter;
