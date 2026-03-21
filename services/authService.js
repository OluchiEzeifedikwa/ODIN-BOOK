import bcrypt from 'bcryptjs';
import { userSchema } from './schema.js';
import { findUserByEmail, createUser } from '../repositories/userRepository.js';

// Register a new user — validates input, guards against duplicate email, hashes password
export const registerUser = async ({ username, email, password }) => {
  const result = userSchema.safeParse({ username, email, password });
  if (!result.success) {
    const err = new Error('Validation failed');
    err.validationErrors = result.error.flatten(issue => issue.message);
    throw err;
  }

  const existingUser = await findUserByEmail(result.data.email);
  if (existingUser) {
    const err = new Error('Email already exists');
    err.statusCode = 400;
    throw err;
  }

  const hashedPassword = await bcrypt.hash(result.data.password, 10);

  return createUser({
    data: {
      username: result.data.username,
      email: result.data.email,
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
};
