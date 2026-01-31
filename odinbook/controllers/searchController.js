import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const searchUsers = async (req, res, next) => {
  try {
    const term = req.query.q?.trim() || '';
    const currentId = req.user.id;

    let users = [];

    if (term) {
      users = await prisma.user.findMany({
        where: {
          AND: [
            { id: { not: currentId } },
            {
              OR: [
                { name: { contains: term, mode: 'insensitive' } },
                { username: { contains: term, mode: 'insensitive' } },
              ],
            },
            { following: { none: { id: currentId } } },
          ],
        },
        select: {
          id: true,
          name: true,
          username: true,
          profile: { select: { image: true } },
        },
        take: 20,
      });
    }

    res.render('search', { users, term });
  } catch (err) {
    next(err);
  }
};

export default {
  searchUsers,
};
