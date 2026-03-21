import prisma from './prismaClient.js';

export const createNotificationRecord = (data) =>
  prisma.notification.create({ data });

export const findNotifications = (args) =>
  prisma.notification.findMany(args);

export const countNotifications = (args) =>
  prisma.notification.count(args);

export const updateManyNotifications = (args) =>
  prisma.notification.updateMany(args);

export const deleteManyNotifications = (args) =>
  prisma.notification.deleteMany(args);
