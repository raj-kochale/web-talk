import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

const SECRET_KEY = "bekau_media_secret"; // MASTER 🔥

export async function generateToken(username: string) {
  return jwt.sign({ username }, SECRET_KEY, { expiresIn: "1h" });
}

export async function verifyToken(token: string) {
  try {
    return jwt.verify(token, SECRET_KEY);
  } catch (err) {
    return null;
  }
}
