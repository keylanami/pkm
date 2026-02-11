import { cookies } from "next/headers";
import { verifyToken } from "./auth";

export const getUserFromRequest = async (req = null) => {
  try {
    let token;
    if (req && req.cookies) {
      token = req.cookies.get("token")?.value;
    } 
    if (!token) {
      const cookieStore = await cookies();
      token = cookieStore.get("token")?.value;
    }

    if (!token) return null;

    const decoded = verifyToken(token);
    return decoded;
  } catch (err) {
    return null;
  }
};