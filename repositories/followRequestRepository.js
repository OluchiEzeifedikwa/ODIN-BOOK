import prisma from './prismaClient.js';

export const findFollowRequests = (args) =>
  prisma.followRequest.findMany(args);

export const findFollowRequestById = (id) =>
  prisma.followRequest.findUnique({ where: { id } });

export const upsertFollowRequest = (followerId, followingId) =>
  prisma.followRequest.upsert({
    where: { followerId_followingId: { followerId, followingId } },
    update: { status: 'accepted' },
    create: { followerId, followingId, status: 'accepted' },
  });

export const updateFollowRequest = (id, data) =>
  prisma.followRequest.update({ where: { id }, data });

export const deleteFollowRequest = (followerId, followingId) =>
  prisma.followRequest.delete({
    where: { followerId_followingId: { followerId, followingId } },
  });

export const deleteManyFollowRequests = (args) =>
  prisma.followRequest.deleteMany(args);
