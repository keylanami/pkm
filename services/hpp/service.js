import HPP from "@/models/HPP";

export const createHPP = async (payload) => {
  const {
    id_user,
    periode,
    jumlah_produksi,
    jenis_produksi, 
    list_bahan_baku,
    list_tenaga_kerja,
    list_overhead,
    rencana_harga_jual_per_pcs, 
  } = payload;

  const total_biaya_bahan_baku = list_bahan_baku.reduce((acc, curr) => acc + Number(curr.harga), 0);
  const total_biaya_tenaga_kerja = list_tenaga_kerja.reduce((acc, curr) => acc + Number(curr.biaya), 0);
  const total_biaya_overhead = list_overhead.reduce((acc, curr) => acc + Number(curr.biaya), 0);

  const total_hpp = total_biaya_bahan_baku + total_biaya_tenaga_kerja + total_biaya_overhead;

  const hpp_per_pcs = jumlah_produksi > 0 ? total_hpp / jumlah_produksi : 0;

  const estimasi_laba_per_pcs = rencana_harga_jual_per_pcs - hpp_per_pcs;

  return HPP.create({
    id_user,
    periode,
    jumlah_produksi,
    jenis_produksi,
    
   
    list_bahan_baku,
    list_tenaga_kerja,
    list_overhead,

    
    total_biaya_bahan_baku,
    total_biaya_tenaga_kerja,
    total_biaya_overhead,

    total_hpp,
    hpp_per_pcs,
    rencana_harga_jual_per_pcs,
    estimasi_laba_per_pcs
  });
};

export const getHPPbyPeriode = async (id_user, periode) => {
  return HPP.findOne({ id_user, periode });
};
