import { Role } from "@prisma/client";
import { AppError } from "../../utils/app-error.js";
import { generateToken } from "../../utils/jwt-helpers.js";
import { comparePassword, hashPassword } from "../../utils/password-helpers.js";
import { prisma } from "../../utils/prisma.js";

interface RegisterInput {
  name: string;
  email: string;
  password: string;
}

interface LoginInput {
  email: string;
  password: string;
}

export const registerStudent = async (payload: RegisterInput) => {
  const existingUser = await prisma.user.findUnique({
    where: { email: payload.email.toLowerCase().trim() },
  });

  if (existingUser) {
    throw new AppError(409, "An account with this email already exists");
  }

  const hashedPassword = await hashPassword(payload.password);

  const newUser = await prisma.user.create({
    data: {
      name: payload.name.trim(),
      email: payload.email.toLowerCase().trim(),
      password: hashedPassword,
      role: Role.STUDENT,
    },
    select: {
      user_id: true,
      email: true,
      name: true,
      role: true,
      created_at: true,
    },
  });

  const accessToken = generateToken({
    user_id: newUser.user_id,
    email: newUser.email,
    role: newUser.role,
    name: newUser.name,
  });

  return {
    user: newUser,
    accessToken,
  };
};

export const loginUser = async (payload: LoginInput) => {
  const user = await prisma.user.findUnique({
    where: { email: payload.email.toLowerCase().trim() },
  });

  if (!user) {
    throw new AppError(401, "Invalid email or password credentials");
  }

  const isPasswordMatch = await comparePassword(payload.password, user.password);
  if (!isPasswordMatch) {
    throw new AppError(401, "Invalid email or password credentials");
  }

  const accessToken = generateToken({
    user_id: user.user_id,
    email: user.email,
    role: user.role,
    name: user.name,
  });

  return {
    user: {
      user_id: user.user_id,
      email: user.email,
      name: user.name,
      role: user.role,
      created_at: user.created_at,
    },
    accessToken,
  };
};

export const getCurrentUser = async (userId: string) => {
  const user = await prisma.user.findUnique({
    where: { user_id: userId },
    select: {
      user_id: true,
      email: true,
      name: true,
      role: true,
      created_at: true,
    },
  });

  if (!user) {
    throw new AppError(404, "User not found");
  }

  return user;
};
