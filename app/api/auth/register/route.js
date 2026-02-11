import connectDB from "@/lib/mongodb";
import Users from "@/models/Users";
import bcrypt from "bcryptjs";
import { signToken } from "@/lib/auth";

export async function POST(req) {
    try {
        await connectDB();

        const { username, email, password, phone_number } = await req.json();

        if (!username || !email || !password || !phone_number) {
        return Response.json(
            { error: "All fields are required" },
            { status: 400 }
        );
        }


        const exist = await Users.findOne({ email });
        if(exist) {
            return Response.json({error: "Email already registered"}, {status: 409})
        }

        const hashedPw = await bcrypt.hash(password, 10);

        const user = await Users.create({
            username, email, password: hashedPw, phone_number
        });

        const token = signToken({ id_user: user._id});

        return new Response(
            JSON.stringify({message: "Registered successfully!"}),
            {
                status: 201,
                headers: {
                    "Set-Cookie":  `token=${token}; HttpOnly; Path=/; Max-Age=604800`
                }
            }
        );


    } catch (err) {
        return Response.json({error: err.message}, {status: 500})
    }
}