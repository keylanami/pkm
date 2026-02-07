import connectDB from "@/lib/mongodb";
import Users from "@/models/Users";
import { getUserFromRequest } from "@/lib/getUser";

export async function GET(req) {
    try {
        await connectDB();

        const userToken = await getUserFromRequest();
        if(!userToken){
            return Response.json({error: "Unauthorized"}, {status: 401})
        }

        const user = await Users.findById(userToken.id_user).select("-password");
        return Response.json(user);

    } catch (err){
        return Response.json({error: err.message}, {status: 500})
    }
}