// controllers/signupController.js
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function signup(req, res) {
  try {
    const { username, email, password } = req.body;
    if (!username || !email || !password) {
      return res.status(400).json({ message: 'Missing required fields' });
    }
    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    const user = await prisma.user.create({
      data: {
        username: req.body.username,
        email: req.body.email,
        bio: req.body.bio,
        location: req.body.location,
        pronoun: req.body.pronoun,
        password: hashedPassword,
      },
    });
    // return res.json(user);
    return res.redirect('/login');
  } catch (error) {
    return res.status(500).json({ message: 'Error creating user' });
  }
};
module.exports = { signup }

