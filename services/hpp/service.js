import HPP from "@/models/HPP";

export const createHPP = async (payload) => {
  const {
    id_user,
    periode,
    jumlah_produksi,
    biaya_bahan_baku,
    biaya_tenaga_kerja,
    biaya_overhead,
    harga_jual_total,
  } = payload;

  const total_hpp = biaya_bahan_baku + biaya_tenaga_kerja + biaya_overhead;

  const hpp_per_pcs = total_hpp / jumlah_produksi;
  const harga_jual_per_pcs = harga_jual_total / jumlah_produksi;

  return HPP.create({
    id_user,
    periode,
    jumlah_produksi,
    biaya_bahan_baku,
    biaya_tenaga_kerja,
    biaya_overhead,
    total_hpp,
    hpp_per_pcs,
    harga_jual_total,
    harga_jual_per_pcs,
  });
};

export const getHPPByPeriode = async (id_user, periode) => {
  return HPP.findOne({ id_user, periode });
};
