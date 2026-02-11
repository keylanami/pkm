import mongoose from "mongoose";

const HPPscheme = new mongoose.Schema(
  {
    id_user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
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
      type: String, // "Unit", "Pcs", "Porsi"
      required: true, 
    },

    // --- PERUBAHAN UTAMA DI SINI ---
    
    // 1. Array untuk Bahan Baku
    list_bahan_baku: [
      {
        nama: { type: String, required: true }, // contoh: "Tepung Terigu"
        harga: { type: Number, required: true }, // contoh: 30000
      },
    ],
    // Simpan totalnya juga agar query lebih cepat nanti
    total_biaya_bahan_baku: {
      type: Number,
      required: true,
      default: 0
    },

    // 2. Array untuk Tenaga Kerja
    list_tenaga_kerja: [
      {
        keterangan: { type: String, required: true }, // contoh: "Karyawan Dapur"
        biaya: { type: Number, required: true },      // contoh: 3000000
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