const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

exports.getNotifications = async (req, res, next) => {
    const notifications = await prisma.notification.findMany({
    where: { userId: req.user.id }, // adjust to your auth logic
    include: { user: true, post: true, comment: true, like: true, followRequest: true },
    orderBy: { createdAt: 'desc' }
  });
  console.log(notifications);
  res.render('notifications', { notifications });
};





exports.markAsRead = async (req, res) => {
  const { id } = req.params;
  await prisma.notification.update({
    where: { id },
    data: { read: true }
  });
  res.redirect('/notifications');
};