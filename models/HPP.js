import mongoose from "mongoose";

const HPPscheme = new mongoose.Schema(
  {
    id_user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },

    nama_produk: {
      type: String,
      required: true
    },

    periode: {
      type: String,
      required: true,
    },
    jumlah_produksi: {
      type: Number,
      required: true,
    },
    jenis_produksi: {
      type: String, 
      enum: ["Unit", "Pcs", "Porsi"],
      required: true, 
    },

    list_bahan_baku: [
      {
        nama: { type: String, required: true }, 
        harga: { type: Number, required: true },
      },
    ],

    total_biaya_bahan_baku: {
      type: Number,
      required: true,
      default: 0
    },

    list_tenaga_kerja: [
      {
        keterangan: { type: String, required: true },
        biaya: { type: Number, required: true },      
      },
    ],
    total_biaya_tenaga_kerja: {
      type: Number,
      required: true,
      default: 0
    },

    list_overhead: [
      {
        keterangan: { type: String, required: true }, 
        biaya: { type: Number, required: true },      
      },
    ],
    total_biaya_overhead: {
      type: Number,
      required: true,
      default: 0
    },

    
    total_hpp: {
      type: Number,
      required: true,
    },
    hpp_per_pcs: {
      type: Number,
      required: true,
    },
    
    rencana_harga_jual_per_pcs: { 
      type: Number,
      required: true,
    },
    
    estimasi_laba_per_pcs: {
        type: Number
    }
  },
  {
    timestamps: true,
  }
);

export default mongoose.models.HPP || mongoose.model("HPP", HPPscheme);