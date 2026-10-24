import { z } from "zod";

export const createMentorValidationSchema = z.object({
  body: z.object({
    name: z
      .string({ required_error: "Mentor full name is required" })
      .min(2, "Name must be at least 2 characters long")
      .max(60, "Name cannot exceed 60 characters"),
    email: z
      .string({ required_error: "Email is required" })
      .email("Please provide a valid email address"),
    password: z
      .string({ required_error: "Password is required" })
      .min(6, "Password must be at least 6 characters long"),
  }),
});
