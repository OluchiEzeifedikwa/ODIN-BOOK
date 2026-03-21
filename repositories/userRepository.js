import prisma from './prismaClient.js';

export const findUserByEmail = (email) =>
  prisma.user.findUnique({ where: { email } });

export const findUserById = (id) =>
  prisma.user.findUnique({ where: { id } });

export const createUser = (data) =>
  prisma.user.create(data);

export const findUsers = (args) =>
  prisma.user.findMany(args);
