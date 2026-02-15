import connectDB from "@/lib/mongodb";
import Produk from "@/models/Produk";
import HPP from "@/models/HPP";
import { createHPP } from "@/services/hpp/service";
import { getUserFromRequest } from "@/lib/getUser";

export async function POST(req) {
  try {
    await connectDB();

    const user = await getUserFromRequest(req);
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
      nama_produk: body.nama_produk || `Produk ${body.periode}`, 
    });

    const namaProduk = body.nama_produk || `Produk Periode ${body.periode}`;

    await Produk.findOneAndUpdate(
      { 
        id_user: user.id_user, 
        nama_produk: namaProduk 
      },
      {
        $set: {
          harga_jual: body.rencana_harga_jual_per_pcs, 
          hpp_saat_ini: hpp.hpp_per_pcs, 
        },
        $setOnInsert: { terjual_bulan_ini: 0 } 
      },
      { upsert: true, new: true } 
    );

    return Response.json(hpp, { status: 201 });
  } catch (err) {
    return Response.json({ error: err.message }, { status: 500 });
  }
}

export async function GET(req) {
  try {
    await connectDB();

    const user = await getUserFromRequest(req);
    if (!user) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const periode = searchParams.get("periode");

    const query = { id_user: user.id_user };
    let limit = 0; 

    if (periode) {
      query.periode = periode;
    } else {
      limit = 5;
    }

    const data = await HPP.find(query)
      .sort({ createdAt: -1 }) 
      .limit(limit);

    return Response.json(data);
  } catch (err) {
    return Response.json({ error: err.message }, { status: 500 });
  }
}