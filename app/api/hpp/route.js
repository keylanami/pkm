import connectDB from "@/lib/mongodb";
import { createHPP, getHPPbyPeriode } from "@/services/hpp/service";
import { getUserFromRequest } from "@/lib/getUser";


export async function POST(req) {
  try {
    await connectDB();

    const user = await getUserFromRequest();
    if (!user) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();

    if (!body.periode) {
      return Response.json({ error: "Periode wajib diisi" }, { status: 400 });
    }

    const hpp = await createHPP({
      ...body,
      id_user: user.id_user,
    });
    return Response.json(hpp, { status: 201 });
  } catch (err) {
    return Response.json({ error: err.message }, { status: 500 });
  }
}

export async function GET(req) {
  try {
    await connectDB();

    const user = await getUserFromRequest();
    if (!user) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const periode = searchParams.get("periode");

    const query = {
      id_user: user.id_user,
    };

    if (periode) {
      query.periode = periode;
    }

    const data = await getHPPbyPeriode(query, periode);
    return Response.json(data);
  } catch (err) {
    return Response.json({ error: err.message }, { status: 500 });
  }
}
