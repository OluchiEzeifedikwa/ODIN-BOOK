import prisma from './prismaClient.js';

export const findComments = (args) =>
  prisma.comment.findMany(args);

export const findCommentById = (id) =>
  prisma.comment.findUnique({ where: { id } });

export const createComment = (data) =>
  prisma.comment.create({ data });

export const updateComment = (id, data) =>
  prisma.comment.update({ where: { id }, data });

export const deleteComment = (id) =>
  prisma.comment.delete({ where: { id } });

export const deleteManyComments = (args) =>
  prisma.comment.deleteMany(args);
