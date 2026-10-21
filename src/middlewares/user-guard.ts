import { NextFunction, Request, Response } from "express";
import { UserRole } from "../constants/user-roles.js";
import { AppError } from "../utils/app-error.js";
import { verifyToken } from "../utils/jwt-helpers.js";
import { prisma } from "../utils/prisma.js";
import "../types/auth-types.js";

interface DecodedToken {
  user_id: string;
  email: string;
  role: UserRole;
  iat?: number;
  exp?: number;
}

export const userGuard = (...requiredRoles: UserRole[]) => {
  return async (req: Request, _res: Response, next: NextFunction): Promise<void> => {
    try {
      const authHeader = req.headers.authorization;
      if (!authHeader || !authHeader.startsWith("Bearer ")) {
        throw new AppError(401, "Authentication token missing or invalid format");
      }

      const token = authHeader.split(" ")[1];
      if (!token) {
        throw new AppError(401, "Access token is required");
      }

      let decoded: DecodedToken;
      try {
        decoded = verifyToken<DecodedToken>(token);
      } catch {
        throw new AppError(401, "Invalid or expired authentication token");
      }

      const user = await prisma.user.findUnique({
        where: { user_id: decoded.user_id },
        select: {
          user_id: true,
          email: true,
          role: true,
          name: true,
        },
      });

      if (!user) {
        throw new AppError(401, "User associated with token no longer exists");
      }

      if (requiredRoles.length > 0 && !requiredRoles.includes(user.role as UserRole)) {
        throw new AppError(
          403,
          `Access forbidden: requires one of the following roles: [${requiredRoles.join(", ")}]`
        );
      }

      req.user = {
        user_id: user.user_id,
        email: user.email,
        role: user.role as UserRole,
        name: user.name,
      };

      next();
    } catch (error) {
      next(error);
    }
  };
};
