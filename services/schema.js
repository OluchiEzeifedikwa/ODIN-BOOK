import { z } from "zod";

const userSchema = z.object({
  username: z
    .string({ message: "Name must be a string" })
    .min(3, "Name must be at least three characters"),

  email: z
    .string({ message: "Email must be a string" })
    .email("Invalid email address"),

  password: z
    .string()
    .min(4, "Password must be at least 4 characters"),
});

export { userSchema };
