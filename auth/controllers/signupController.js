import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const signup = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
      return res.status(400).send('Missing required fields');
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        username,
        email,
        password: hashedPassword,
        profile: {
          create: {
            bio: '',
            location: '',
            pronoun: '',
            image: '',
          },
        },
      },
      include: {
        profile: true,
      },
    });

    console.log(user);
    res.redirect('/login');
  } catch (error) {
    console.error(error);
    res.status(500).send('Error creating user');
  }
};

export default {
  signup,
};
