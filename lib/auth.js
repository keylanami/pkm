import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET) console.error("FATAL: JWT_SECRET is undefined!");

export const signToken = (payload) =>
  jwt.sign(payload, JWT_SECRET, { expiresIn: "7d" });

export const verifyToken = (token) =>
  jwt.verify(token, JWT_SECRET);