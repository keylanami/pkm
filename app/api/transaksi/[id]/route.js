import connectDB from "@/lib/mongodb";
import Transaksi from "@/models/Transaksi";
import { getUserFromRequest } from "@/lib/getUser";

export async function PUT(req, {params}) {
    try {
        await connectDB();

        const user = await getUserFromRequest(req);
    if (!user) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const body = await req.json();

    const transaksi = await Transaksi.findOneAndUpdate(
        { _id: id, id_user: user.id_user},
        {
            nominal:  body.nominal,
            keterangan: body.keterangan,
            tanggal: body.tanggal,
            periode: body.periode
        },
        { new: true}
    );

    if(!transaksi){
        return Response.json(
            {error: "transaksi not found"},
            {status: 404}
        )
    }

    return Response.json(transaksi);

    }  catch (err) {
        return Response.json({error: err.message}, {status: 500})
    }
}


export async function DELETE(req, {params}) {
    try {
        await connectDB();

        const user = await getUserFromRequest(req);
        if(!user) {
            return Response.json({error: "Unauthorized"}, {status: 401})
        }

        const { id} = await params;

        const deleted = await Transaksi.findOneAndDelete(
            { _id: id, id_user: user.id_user}
        );

        if(!deleted){
            return Response.json({error: "failed to delete transaction"}, {status: 404})
        }

        return Response.json(deleted);

    } catch (err) {
        return Response.json({error: err.message}, {status: 500})
    }
}