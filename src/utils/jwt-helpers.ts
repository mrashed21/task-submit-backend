import jwt, { JwtPayload, Secret, SignOptions } from "jsonwebtoken";
import { env } from "../config/env.js";

export const generateToken = (
  payload: Record<string, unknown>,
  secret: Secret = env.jwtSecret,
  expiresIn: string | number = env.jwtExpiresIn
): string => {
  return jwt.sign(payload, secret, {
    expiresIn,
  } as SignOptions);
};

export const verifyToken = <T extends JwtPayload>(
  token: string,
  secret: Secret = env.jwtSecret
): T => {
  return jwt.verify(token, secret) as T;
};
