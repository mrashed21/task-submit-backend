import { UserRole } from "../constants/user-roles.js";

export interface AuthUser {
  user_id: string;
  email: string;
  role: UserRole;
  name: string;
}

declare global {
  namespace Express {
    interface Request {
      user?: AuthUser;
    }
  }
}
