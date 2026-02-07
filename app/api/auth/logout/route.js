import { getUserFromRequest } from "@/lib/getUser";
import connectDB from "@/lib/mongodb";
import Users from "@/models/Users";

export async function POST(req) {
  return new Response(JSON.stringify({ message: "Logout success" }), {
    status: 200,
    headers: {
      "Set-Cookie": `token=; HttpOnly; Path=/; Max-Age=0`,
    },
  });
}
