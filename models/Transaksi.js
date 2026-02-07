import mongoose from "mongoose";

const transaksi = new mongoose.Schema(
    {
        id_user: {
            type: mongoose.Schema.Types.ObjectId,
            role: "User",
            required: true
        },

        jenis: {
            type: String,
            enum: ["pemasukan", "pengeluaran"],
            required: true
        },

        periode: {
            type: String,
            required: true
        },

        nominal: {
            type: Number,
            required: true
        },

        keterangan: {
            type: String,
            required: true
        },

        tanggal: {
            type: Date,
            required: true
        },

    }, {
        timestamp: true        
    }
)

export default mongoose.models.TransaksiScheme || 
    mongoose.model("Transaksi", transaksi);