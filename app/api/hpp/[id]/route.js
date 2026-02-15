import connectDB from "@/lib/mongodb";
import HPP from "@/models/HPP";
import Produk from "@/models/Produk";
import { getUserFromRequest } from "@/lib/getUser";


export async function DELETE(req, { params }) {
  try {
    await connectDB();
    const user = await getUserFromRequest(req);
    if (!user) return Response.json({ error: "Unauthorized" }, { status: 401 });

    const { id } = await params;

    await HPP.findOneAndDelete({ _id: id, id_user: user.id_user });

    return Response.json({ message: "HPP deleted successfully" });
  } catch (err) {
    return Response.json({ error: err.message }, { status: 500 });
  }
}

export async function PUT(req, { params }) {
  try {
    await connectDB();
    const user = await getUserFromRequest(req);
    if (!user) return Response.json({ error: "Unauthorized" }, { status: 401 });

    const { id } = await params;
    const body = await req.json();

    const total_biaya_bahan_baku = body.list_bahan_baku.reduce((acc, curr) => acc + Number(curr.harga), 0);
    const total_biaya_tenaga_kerja = body.list_tenaga_kerja.reduce((acc, curr) => acc + Number(curr.biaya), 0);
    const total_biaya_overhead = body.list_overhead.reduce((acc, curr) => acc + Number(curr.biaya), 0);
    
    const total_hpp = total_biaya_bahan_baku + total_biaya_tenaga_kerja + total_biaya_overhead;
    const hpp_per_pcs = body.jumlah_produksi > 0 ? total_hpp / body.jumlah_produksi : 0;
    const estimasi_laba_per_pcs = body.rencana_harga_jual_per_pcs - hpp_per_pcs;

    const updatedHPP = await HPP.findOneAndUpdate(
      { _id: id, id_user: user.id_user },
      {
        ...body,
        total_biaya_bahan_baku,
        total_biaya_tenaga_kerja,
        total_biaya_overhead,
        total_hpp,
        hpp_per_pcs,
        estimasi_laba_per_pcs
      },
      { new: true }
    );

    if (!updatedHPP) {
      return Response.json({ error: "HPP not found" }, { status: 404 });
    }

    await Produk.findOneAndUpdate(
      { id_user: user.id_user, nama_produk: updatedHPP.nama_produk },
      {
        $set: {
          harga_jual: body.rencana_harga_jual_per_pcs,
          hpp_saat_ini: hpp_per_pcs
        }
      }
    );

    return Response.json(updatedHPP);
  } catch (err) {
    return Response.json({ error: err.message }, { status: 500 });
  }
}