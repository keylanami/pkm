import mongoose from "mongoose";

const produkSchema = new mongoose.Schema(
    {
        id_user: {
            type: mongoose.Schema.Types.ObjectId,
            required: true
        }, 

        nama_produk: {
            type: String,
            required: true
        },
        
        harga_jual: {
            type: Number,
            required: true
        }, 
        
        hpp_saat_ini: {
            type: Number,
            required: true
        },

        terjual_bulan_ini: {
            type: Number,
            default: 0
        }
    }
);

export default mongoose.models.Produk || mongoose.model("Produk", produkSchema);