import prisma from './prismaClient.js';

export const findLike = (postId, userId) =>
  prisma.like.findUnique({ where: { postId_userId: { postId, userId } } });

export const createLike = (data) =>
  prisma.like.create({ data });

export const deleteManyLikes = (args) =>
  prisma.like.deleteMany(args);

export const countLikes = (postId) =>
  prisma.like.count({ where: { postId } });
