import prisma from './prismaClient.js';

export const findPostById = (id, args = {}) =>
  prisma.post.findUnique({ where: { id }, ...args });

export const findPosts = (args) =>
  prisma.post.findMany(args);

export const createPost = (data) =>
  prisma.post.create({ data });

export const deletePost = (id) =>
  prisma.post.delete({ where: { id } });

export const countPosts = (args) =>
  prisma.post.count(args);
