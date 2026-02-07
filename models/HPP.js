import mongoose, { mongo } from "mongoose";

const HPPscheme = new mongoose.Schema(
    {
        id_user: {
            type: mongoose.Schema.Types.ObjectId,
            role: "user",
            required: true
        },

        periode: {
            type: String,
            required: true
        },

        jumlah_produksi: {
            type: Number,
            required: true
        },

        biaya_bahan_baku: {
            type: Number,
            required: true
        },

        biaya_tenaga_kerja: {
            type: Number,
            required: true
        },

        biaya_overhead: {
            type: Number,
            required: true
        },



        total_hpp: {
            type: Number,
            required: true
        },

        hpp_per_pcs: {
            type: Number,
            required: true
        },

        total_harga_jual: {
            type: Number,
            required: true
        },

        harga_jual_pcs: {
            type: Number,
            required: true
        },
    },
    {
        timestamps: true
    }

);


export default mongoose.models.HPP || mongoose.model("HPP", HPPscheme);