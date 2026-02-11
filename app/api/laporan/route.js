import connectDB from "@/lib/mongodb";
import { generateLaporan } from "@/services/laporan/service";
import { getUserFromRequest } from "@/lib/getUser";

export async function GET(req) {
  try {
    await connectDB();
    const user = await getUserFromRequest(req);

    if (!user) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const periode = searchParams.get("periode");

    if (!periode) {
      return Response.json(
        { error: "periode wajib!!" },
        { status: 400 },
      );
    }

    const laporan = await generateLaporan(user.id_user, periode);
    return Response.json(laporan);

  } catch (err) {
    return Response.json({ error: err.message }, { status: 500 });
  }
}
