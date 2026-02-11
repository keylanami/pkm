import connectDB from "@/lib/mongodb";
import Users from "@/models/Users";
import bcrypt from "bcryptjs";
import { signToken } from "@/lib/auth";

export async function POST(req) {
  try {
    await connectDB();
    const { email, password } = await req.json();

    const user = await Users.findOne({ email });
    if (!user) {
      return Response.json({ error: "User not found" }, { status: 404 });
    }

    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return Response.json({ error: "Wrong password" }, { status: 401 });
    }

    const token = signToken({ id_user: user._id });

    return new Response(
      JSON.stringify({ message: "Login success" }),
      {
        headers: {
          "Set-Cookie": `token=${token}; HttpOnly; Path=/; Max-Age=604800`,
        },
      }
    );
  } catch (err) {
    return Response.json({ error: err.message }, { status: 500 });
  }
}
