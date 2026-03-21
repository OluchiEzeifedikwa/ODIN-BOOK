import bcrypt from "bcryptjs";
import { userSchema } from "../services/schema.js";
import { findUserByEmail, createUser } from "../repositories/userRepository.js";

const signup = async (req, res) => {
  try {
    // Validate request body
    const result = userSchema.safeParse(req.body);

    if (!result.success) {
      return res.status(400).json(result.error.flatten(issue => issue.message));
    }

    const { username, email, password } = result.data;

    // Check if user already exists
    const existingUser = await findUserByEmail(email);

    if (existingUser) {
      return res.status(400).json({ error: "Email already exists" });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    await createUser({
      data: {
        username,
        email,
        password: hashedPassword,
        profile: {
          create: {
            bio: "",
            location: "",
            pronoun: "",
            image: ""
          }
        }
      },
      include: {
        profile: true
      }
    });

    res.redirect("/login");
  } catch (error) {
    console.error(error);
    res.status(500).send("Error creating user");
  }
};

export default {
  signup
};
