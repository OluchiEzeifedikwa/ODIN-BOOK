const express = require('express')
const followRequestRouter = express.Router()
const {
  sendFollowRequest,
  sendUnfollowRequest,
  getFollowRequests,
  acceptFollowRequest,
  rejectFollowRequest,
} = require('../controllers/followRequestController')

// Send a follow request
followRequestRouter.post('/users/follow/:receiverId', sendFollowRequest)

// Send an Unfollow request
followRequestRouter.post('/users/unfollow/:receiverId', sendUnfollowRequest);

// List pending requests for a user
followRequestRouter.get('/follow/requests/:userId', getFollowRequests)

// Accept / reject a request
followRequestRouter.post('/follow/requests/:requestId/accept', acceptFollowRequest)
followRequestRouter.post('/follow/requests/:requestId/reject', rejectFollowRequest)


module.exports = followRequestRouter