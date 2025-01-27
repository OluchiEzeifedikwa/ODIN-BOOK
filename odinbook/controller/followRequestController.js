const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Send a follow request
async function sendFollowRequest(req, res) {
  try {
    const { receiverId } = req.params;
    const senderId = req.userId;
    const followRequest = await prisma.followRequest.create({
      data: {
        senderId,
        receiverId,
        status: 'pending',
      },
    });
    res.json(followRequest);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to send follow request' });
  }
}

// Get follow requests for a user
async function getFollowRequests(req, res) {
  try {
    const { userId } = req.params;
    const followRequests = await prisma.followRequest.findMany({
      where: {
        receiverId: userId,
      },
    });
    res.json(followRequests);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to retrieve follow requests' });
  }
}

// Accept a follow request
async function acceptFollowRequest(req, res) {
  try {
    const { requestId } = req.params;
    const followRequest = await prisma.followRequest.update({
      where: {
        id: requestId,
      },
      data: {
        status: 'accepted',
      },
    });
    res.json(followRequest);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to accept follow request' });
  }
}

// Reject a follow request
async function rejectFollowRequest(req, res) {
  try {
    const { requestId } = req.params;
    const followRequest = await prisma.followRequest.update({
      where: {
        id: requestId,
      },
      data: {
        status: 'rejected',
      },
    });
    res.json(followRequest);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to reject follow request' });
  }
}

// Cancel a follow request
async function cancelFollowRequest(req, res) {
  try {
    const { requestId } = req.params;
    await prisma.followRequest.delete({
      where: {
        id: requestId,
      },
    });
    res.json({ message: 'Follow request cancelled' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to cancel follow request' });
  }
}

module.exports = {
  sendFollowRequest,
  getFollowRequests,
  acceptFollowRequest,
  rejectFollowRequest,
  cancelFollowRequest,
};