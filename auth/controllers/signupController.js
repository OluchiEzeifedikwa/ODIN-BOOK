// controllers/signupController.js
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function signup(req, res) {
  try {
    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    const user = await prisma.user.create({
      data: {
        name: req.body.name,
        password: hashedPassword,
      },
    });
    return res.json(user);
  } catch (error) {
    return res.status(500).json({ message: 'Error creating user' });
  }
};
module.exports = { signup }
