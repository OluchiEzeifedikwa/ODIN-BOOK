import bcrypt from 'bcryptjs';
import { userSchema } from './schema.js';
import { findUserByEmail, findUserByUsername, createUser } from '../repositories/userRepository.js';
import { httpError } from './httpError.js';

// Register a new user — validates input, guards against duplicate username/email, hashes password.
// Throws a 400 error with `fieldErrors` ({ field: [messages] }) when the input is rejected.
export const registerUser = async ({ username, email, password }) => {
  const result = userSchema.safeParse({ username, email, password });
  if (!result.success) {
    const { fieldErrors } = result.error.flatten(issue => issue.message);
    throw httpError(400, 'Validation failed', { fieldErrors });
  }

  const [existingEmail, existingUsername] = await Promise.all([
    findUserByEmail(result.data.email),
    findUserByUsername(result.data.username),
  ]);
  const fieldErrors = {};
  if (existingUsername) fieldErrors.username = ['Username is already taken'];
  if (existingEmail) fieldErrors.email = ['Email already exists'];
  if (Object.keys(fieldErrors).length) {
    throw httpError(400, 'Account already exists', { fieldErrors });
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
