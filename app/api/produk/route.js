import connectDB from "@/lib/mongodb";
import Produk from "@/models/Produk";
import { getUserFromRequest } from "@/lib/getUser";

export async function GET(req) {
  try {
    await connectDB();
    const user = await getUserFromRequest(req);
    if (!user) return Response.json({ error: "Unauthorized" }, { status: 401 });

    const produk = await Produk.find({ id_user: user.id_user });
    return Response.json(produk);
  } catch (err) {
    return Response.json({ error: err.message }, { status: 500 });
  }
}