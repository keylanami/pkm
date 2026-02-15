import mongoose from "mongoose";

const TransaksiSchema = new mongoose.Schema(
  {
    id_user: { type: String, required: true },
    jenis: {
      type: String,
      enum: ["pemasukan", "pengeluaran"],
      required: true,
    },
    kategori: {
        type: String,
        enum: ["penjualan",       
        "modal",
        "pinjaman",        
        "bahan_baku",       
        "tenaga_kerja",   
        "overhead",        
        "lainnya"],
        required: true
    },
    tanggal: { type: Date, required: true },
    periode: { type: String, required: true },

    nominal: { type: Number, required: true },
    keterangan: { type: String, required: true },

    detail_items: [
      {
        id_produk: { type: mongoose.Schema.Types.ObjectId, ref: "Produk" },
        nama_produk: String,
        qty: Number,
        harga_satuan: Number,
        subtotal: Number,
      },
    ],
  },
  { timestamps: true },
);

export default mongoose.models.Transaksi ||
  mongoose.model("Transaksi", TransaksiSchema);
