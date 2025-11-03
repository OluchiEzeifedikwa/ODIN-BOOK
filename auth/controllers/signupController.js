// controllers/signupController.js
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function signup(req, res) {          
  try {
    const { username, email, password } = req.body;
    if (!username || !email || !password) {
      return res.status(400).send('Missing required fields' );
    }
    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    const user = await prisma.user.create({
        data: {
          email,
          password: hashedPassword,
          username,
          profile: {
            create: {
              bio: '',
              location: '',
              pronoun: '',
              image: ''
            }
          }
        },
        include: {
          profile: true
        }
      });
    // return res.json(user);
    console.log(user);
    return res.redirect('/login');
  } catch (error) {
    return res.status(500).send( 'Error creating user' );
  }
};





module.exports = { signup }

