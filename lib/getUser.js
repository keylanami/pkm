import { cookies } from "next/headers";
import { verifyToken } from "./auth";

export const getUserFromRequest = async () => {
    try {
        const cookieStore = await cookies();
        const token = cookieStore.get("token")?.value;

        if(!token) return null;

        const decoded = verifyToken(token);
        return decoded;
    } catch (err) {
        return null;
    }
}