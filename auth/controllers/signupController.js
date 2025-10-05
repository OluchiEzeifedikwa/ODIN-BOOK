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
        username: req.body.username,
        email: req.body.email,
        password: hashedPassword,
      },
    }); 
    // return res.json(user);
    console.log(user);
    return res.redirect('/login');
  } catch (error) {
    return res.status(500).send( 'Error creating user' );
  }
};

async function getUser(req, res) {
  const users = await prisma.user.findUnique({
    where: {username: 'gica'},
  });
  if(users) {
    console.log('user gica exists')
  }
  else(
    console.log('user not found')
  )
}

module.exports = { signup, getUser}

