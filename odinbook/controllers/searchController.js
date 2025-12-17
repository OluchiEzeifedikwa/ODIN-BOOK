// controllers/search.js
const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

// controllers/search.js
exports.searchUsers = async (req, res, next) => {
  try {
    const term = req.query.q?.trim() || '';   // default to empty string
    const currentId = req.user.id;

    const users = term
      ? await prisma.user.findMany({
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
          select: { id: true, name: true, username: true, profile: { select: { image: true } } },
          take: 20,
        })
      : [];   // no search, return empty array

    res.render('search', { users, term });
  } catch (err) {
    next(err);
  }
};