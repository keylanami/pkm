import HPP from "@/models/HPP";
import Transaksi from "@/models/Transaksi";

export const generateLaporan = async (id_user, periode) => {
  let total_pemasukan = 0;
  let total_pengeluaran = 0;
  const result = await Transaksi.aggregate([
    { $match: { id_user, periode } },
    { $group: { _id: "$jenis", total: { $sum: "$nominal" } } },
  ]);

  result.forEach((item) => {
    if (item._id == "pemasukan") {
      total_pemasukan = item.total;
    } else {
      total_pengeluaran = item.total;
    }
  });

  const hpp = await HPP.findOne({ id_user, periode });
  const total_hpp = hpp ? hpp.total_hpp : 0;
  const laba_bersih = total_pemasukan - total_pengeluaran;

  return {
    periode,
    summary: {
      total_pemasukan,
      total_pengeluaran,
      total_hpp,
      laba_bersih,
    },
    tabel_transaksi: transaksiAgg.map((item) => ({
      jenis: item._id,
      total: item.total,
    })),
  };
};
