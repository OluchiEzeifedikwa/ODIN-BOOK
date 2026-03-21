import prisma from './prismaClient.js';

export const findProfileById = (id, args = {}) =>
  prisma.profile.findUnique({ where: { id }, ...args });

export const findProfileByUserId = (userId, args = {}) =>
  prisma.profile.findUnique({ where: { userId }, ...args });

export const findProfiles = (args) =>
  prisma.profile.findMany(args);

export const updateProfile = (id, data) =>
  prisma.profile.update({ where: { id }, data });

export const deleteManyProfiles = (args) =>
  prisma.profile.deleteMany(args);

export const createProfile = (data) =>
  prisma.profile.create({ data });
