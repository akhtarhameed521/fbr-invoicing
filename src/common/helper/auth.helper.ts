import * as jwt from "jsonwebtoken";
import * as bcrypt from "bcrypt";
import { UserRoles } from "@types";

export const jwtSign = (
  id: number,
  email: string,
  username: string,
  role?: string
) => {
  return jwt.sign(
    { id, email, username, role },
    process.env.JWT_SECRET,
    { expiresIn: "1d" }
  );
};

export const jwtVerify = (token: string) => {
  return jwt.verify(token, process.env.JWT_SECRET) as {
    id: number;
    email: string;
    username: string;
    role: UserRoles;
  };
};

export const hashPassword = (password: string, count: number) => {
  return bcrypt.hash(password, count);
};