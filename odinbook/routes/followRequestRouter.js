import express from 'express';
import followRequestController from '../controllers/followRequestController.js';

const followRequestRouter = express.Router();


followRequestRouter.post('/users/follow/:receiverId', followRequestController.sendFollowRequest);
followRequestRouter.post('/users/unfollow/:receiverId', followRequestController.sendUnfollowRequest);
followRequestRouter.get('/follow/requests/:userId', followRequestController.getFollowRequests);
followRequestRouter.post('/follow/requests/:requestId/accept', followRequestController.acceptFollowRequest);
followRequestRouter.post('/follow/requests/:requestId/reject', followRequestController.rejectFollowRequest);

export default followRequestRouter;
