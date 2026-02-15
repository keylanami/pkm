"use client";

import { useEffect, useState } from "react";
import Sidebar from "@/app/components/Sidebar/page";
import {
  getTransaksi,
  createTransaksi,
  deleteTransaksi,
} from "@/services/transaksi/service";
import { getProduk } from "@/services/produk/service";
import {
  PlusIcon,
  TrashIcon,
  ShoppingCartIcon,
  CurrencyDollarIcon,
  FunnelIcon,
} from "@heroicons/react/24/outline";

const formatDate = (dateString) => {
  if (!dateString) return "-";
  return new Date(dateString).toLocaleDateString("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
};

const formatRupiah = (number) => {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(number);
};

export default function TransaksiPage() {
  const [data, setData] = useState([]);
  const [filterPeriode, setFilterPeriode] = useState("");
  const [masterProduk, setMasterProduk] = useState([]);

  const [jenis, setJenis] = useState("pemasukan");
  const [kategori, setKategori] = useState("penjualan");
  const [nominal, setNominal] = useState("");
  const [keterangan, setKeterangan] = useState("");
  const [tanggal, setTanggal] = useState(new Date().toISOString().slice(0, 10));

  const [cartItems, setCartItems] = useState([]);
  const [selectedProdukId, setSelectedProdukId] = useState("");
  const [qtyInput, setQtyInput] = useState(1);

  useEffect(() => {
    loadData();
    loadMasterProduk();
  }, [filterPeriode]);

  useEffect(() => {
    if (jenis === "pemasukan") setKategori("penjualan");
    else setKategori("bahan_baku");
    if (jenis === "pengeluaran") {
      setCartItems([]);
      setNominal("");
    }
  }, [jenis]);

  async function loadData() {
    try {
      const res = await getTransaksi(filterPeriode);
      setData(Array.isArray(res) ? res : []);
    } catch (err) {
      console.error(err);
    }
  }

  async function loadMasterProduk() {
    try {
      const res = await getProduk();
      const products = res.data || res;
      setMasterProduk(Array.isArray(products) ? products : []);
    } catch (err) {
      console.error("Gagal load produk", err);
    }
  }

  const handleAddItem = () => {
    if (!selectedProdukId) return;

    const produkRef = masterProduk.find((p) => p._id === selectedProdukId);
    if (!produkRef) return;

    const newItem = {
      id_produk: produkRef._id,
      nama_produk: produkRef.nama_produk,
      harga_satuan: produkRef.harga_jual,
      qty: Number(qtyInput),
      subtotal: produkRef.harga_jual * Number(qtyInput),
    };
    
    const newCart = [...cartItems, newItem];
    setCartItems(newCart);
    setNominal(newCart.reduce((acc, item) => acc + item.subtotal, 0));
    if (!keterangan) setKeterangan(`Penjualan ${produkRef.nama_produk} dll`);
    setSelectedProdukId("");
    setQtyInput(1);
  };

  const handleRemoveItem = (index) => {
    const newCart = [...cartItems];
    newCart.splice(index, 1);
    setCartItems(newCart);
    setNominal(newCart.reduce((acc, item) => acc + item.subtotal, 0));
  };

  async function handleSubmit(e) {
    e.preventDefault();
    if (!tanggal) return alert("Pilih tanggal");
    const transactionPeriode = tanggal.substring(0, 7);
    try {
      await createTransaksi({
        jenis,
        kategori,
        periode: transactionPeriode,
        nominal: Number(nominal),
        keterangan,
        tanggal,
        detail_items: cartItems,
      });
      setNominal("");
      setKeterangan("");
      setCartItems([]);
      alert("Transaksi berhasil disimpan!");
      loadData();
    } catch (err) {
      alert(err.message);
    }
  }

  async function handleDelete(id) {
    if (!confirm("Hapus?")) return;
    await deleteTransaksi(id);
    loadData();
  }

  const totalPemasukan = data
    .filter((i) => i.jenis === "pemasukan")
    .reduce((acc, curr) => acc + curr.nominal, 0);
  const totalPengeluaran = data
    .filter((i) => i.jenis === "pengeluaran")
    .reduce((acc, curr) => acc + curr.nominal, 0);

  return (
    <div className="min-h-screen bg-[#F3F6FA] font-sans flex">
      <main
        className={`flex-1 transition-all duration-300 ease-in-out p-6 md:p-8`}
      >
        <div className="max-w-6xl mx-auto space-y-8">
          {/* HEADER */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center bg-white/70 backdrop-blur-xl border border-white/60 p-6 rounded-3xl shadow-sm gap-4">
            <div>
              <h1 className="text-3xl font-bold text-[#1C4D8D]">
                Kasir & Transaksi
              </h1>
              <p className="text-slate-500 mt-1">Catat arus kas harian Anda.</p>
            </div>
            <div className="bg-[#1C4D8D]/10 px-5 py-3 rounded-2xl border border-[#1C4D8D]/20">
              <p className="text-xs text-[#1C4D8D] uppercase tracking-bold font-bold">
                Saldo Periode Ini
              </p>
              <p
                className={`font-black text-2xl ${totalPemasukan - totalPengeluaran >= 0 ? "text-[#1C4D8D]" : "text-red-600"}`}
              >
                {formatRupiah(totalPemasukan - totalPengeluaran)}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-1">
              <div className="bg-white/80 backdrop-blur-xl shadow-lg rounded-3xl p-6 border border-white/60 sticky top-6">
                <h2 className="text-lg font-bold text-slate-800 mb-6 border-b border-slate-100 pb-3">
                  Catat Transaksi
                </h2>

                <form onSubmit={handleSubmit} className="space-y-5">
                  <div>
                    <label className="block text-xs font-bold text-slate-500 mb-1 uppercase">
                      Tanggal
                    </label>
                    <input
                      type="date"
                      value={tanggal}
                      onChange={(e) => setTanggal(e.target.value)}
                      required
                      className="w-full rounded-xl py-2 pl-2 border-slate-200 bg-slate-50 focus:bg-white text-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-500 mb-1 uppercase">
                      Jenis Arus Kas
                    </label>
                    <div className="flex rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                      <button
                        type="button"
                        onClick={() => setJenis("pemasukan")}
                        className={`flex-1 py-2.5 text-sm font-bold transition-colors ${jenis === "pemasukan" ? "bg-emerald-50 text-emerald-700" : "bg-white text-slate-400 hover:bg-slate-50"}`}
                      >
                        Masuk (+)
                      </button>
                      <div className="w-[1px] bg-slate-200"></div>
                      <button
                        type="button"
                        onClick={() => setJenis("pengeluaran")}
                        className={`flex-1 py-2.5 text-sm font-bold transition-colors ${jenis === "pengeluaran" ? "bg-rose-50 text-rose-700" : "bg-white text-slate-400 hover:bg-slate-50"}`}
                      >
                        Keluar (-)
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-500 mb-1 uppercase">
                      Kategori
                    </label>
                    <select
                      value={kategori}
                      onChange={(e) => setKategori(e.target.value)}
                      className="w-full rounded-xl py-3 pl-4 border-slate-200 bg-slate-50 focus:bg-white text-sm"
                    >
                      {jenis === "pemasukan" ? (
                        <>
                          <option value="penjualan">Penjualan Produk</option>
                          <option value="modal">Modal / Saldo Awal</option>
                          <option value="pinjaman">Pinjaman</option>
                          <option value="lainnya">Lainnya</option>
                        </>
                      ) : (
                        <>
                          <option value="bahan_baku">Bahan Baku</option>
                          <option value="tenaga_kerja">Gaji Karyawan</option>
                          <option value="overhead">
                            Overhead (Listrik/Sewa)
                          </option>
                          <option value="lainnya">Lainnya</option>
                        </>
                      )}
                    </select>
                  </div>

                  {jenis === "pemasukan" && kategori === "penjualan" && (
                    <div className="bg-blue-50/50 p-4 rounded-2xl border border-blue-100 animate-fade-in">
                      <div className="flex items-center gap-2 mb-3 text-blue-700">
                        <ShoppingCartIcon className="w-4 h-4" />
                        <h3 className="text-xs font-bold uppercase">
                          Mode Kasir
                        </h3>
                      </div>
                      <div className="flex gap-2 mb-3">
                        <select
                          value={selectedProdukId}
                          onChange={(e) => setSelectedProdukId(e.target.value)}
                          className="flex-1 rounded-xl border-blue-200 text-sm p-2 bg-white"
                        >
                          <option value="">-- Produk --</option>
                          {masterProduk.map((p) => (
                            <option key={p._id} value={p._id}>
                              {p.nama_produk}
                            </option>
                          ))}
                        </select>
                        <input
                          type="number"
                          value={qtyInput}
                          onChange={(e) => setQtyInput(e.target.value)}
                          className="w-14 rounded-xl border-blue-200 text-sm p-2 text-center bg-white"
                          min="1"
                        />
                        <button
                          type="button"
                          onClick={handleAddItem}
                          className="bg-blue-600 text-white px-3 rounded-xl hover:bg-blue-700"
                        >
                          <PlusIcon className="w-5 h-5" />
                        </button>
                      </div>
                      {cartItems.length > 0 && (
                        <ul className="space-y-1 bg-white/80 p-2 rounded-xl border border-blue-100 max-h-32 overflow-y-auto custom-scrollbar">
                          {cartItems.map((item, idx) => (
                            <li
                              key={idx}
                              className="flex justify-between text-xs items-center p-2 hover:bg-blue-50 rounded-lg"
                            >
                              <div>
                                <span className="font-bold text-slate-700">
                                  {item.nama_produk}
                                </span>{" "}
                                <span className="text-slate-400">
                                  x{item.qty}
                                </span>
                              </div>
                              <div className="flex items-center gap-2">
                                <span className="font-mono font-medium text-slate-600">
                                  {formatRupiah(item.subtotal)}
                                </span>
                                <button
                                  type="button"
                                  onClick={() => handleRemoveItem(idx)}
                                  className="text-red-400 hover:text-red-600"
                                >
                                  <TrashIcon className="w-3 h-3" />
                                </button>
                              </div>
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  )}

                  <div className="space-y-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-500 mb-1 uppercase">
                        Nominal
                      </label>
                      <div className="relative">
                        <span className="absolute left-3 top-2.5 text-slate-400 text-sm font-bold">
                          Rp
                        </span>
                        <input
                          type="number"
                          value={nominal}
                          onChange={(e) => setNominal(e.target.value)}
                          required
                          readOnly={
                            jenis === "pemasukan" &&
                            kategori === "penjualan" &&
                            cartItems.length > 0
                          }
                          className={`w-full pl-10 rounded-xl py-2 border-slate-200 font-bold text-slate-700 ${jenis === "pemasukan" && cartItems.length > 0 ? "bg-slate-100 text-slate-500" : "bg-slate-50 focus:bg-white"}`}
                          placeholder="0"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-500 mb-1 uppercase">
                        Keterangan
                      </label>
                      <input
                        type="text"
                        placeholder="   Catatan transaksi..."
                        value={keterangan}
                        onChange={(e) => setKeterangan(e.target.value)}
                        required
                        className="w-full rounded-xl py-3 border-slate-200 bg-slate-50 focus:bg-white text-sm"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-[#1C4D8D] text-white py-3 rounded-xl font-bold hover:bg-[#163E72] shadow-lg shadow-blue-200 transition-all flex justify-center items-center gap-2"
                  >
                    Simpan Transaksi
                  </button>
                </form>
              </div>
            </div>

            {/* LIST TRANSAKSI */}
            <div className="lg:col-span-2">
              <div className="bg-white/80 backdrop-blur-xl shadow-md rounded-3xl overflow-hidden border border-white/60">
                <div className="px-6 py-5 border-b border-slate-100 flex justify-between items-center bg-white/40">
                  <h3 className="font-bold text-slate-700 flex items-center gap-2">
                    <FunnelIcon className="w-4 h-4 text-slate-400" /> Riwayat
                    Transaksi
                  </h3>
                  <div className="flex items-center gap-2">
                    <input
                      type="month"
                      value={filterPeriode}
                      onChange={(e) => setFilterPeriode(e.target.value)}
                      className="text-xs border-slate-200 rounded-lg p-1.5 bg-white/80 font-medium text-slate-600"
                    />
                    {filterPeriode && (
                      <button
                        onClick={() => setFilterPeriode("")}
                        className="text-xs text-red-500 hover:text-red-700 font-bold px-2"
                      >
                        Reset
                      </button>
                    )}
                  </div>
                </div>

                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-slate-100">
                    <thead className="bg-slate-50/50">
                      <tr>
                        <th className="px-6 py-4 text-left text-xs font-bold text-slate-400 uppercase tracking-wider">
                          Tgl
                        </th>
                        <th className="px-6 py-4 text-left text-xs font-bold text-slate-400 uppercase tracking-wider">
                          Detail
                        </th>
                        <th className="px-6 py-4 text-right text-xs font-bold text-slate-400 uppercase tracking-wider">
                          Nominal
                        </th>
                        <th className="px-6 py-4 text-center text-xs font-bold text-slate-400 uppercase tracking-wider">
                          Aksi
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 bg-white/40">
                      {data.length > 0 ? (
                        data.map((t) => (
                          <tr
                            key={t._id}
                            className="hover:bg-blue-50/50 transition-colors group"
                          >
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500 font-medium">
                              {formatDate(t.tanggal)}
                            </td>
                            <td className="px-6 py-4 text-sm">
                              <div className="flex items-center gap-2 mb-1">
                                <span
                                  className={`px-2 py-0.5 rounded text-[10px] uppercase font-bold tracking-wide border 
                                    ${
                                      t.kategori === "penjualan"
                                        ? "bg-emerald-100 text-emerald-700 border-emerald-200"
                                        : t.kategori === "modal"
                                          ? "bg-blue-100 text-blue-700 border-blue-200"
                                          : t.kategori === "bahan_baku"
                                            ? "bg-orange-100 text-orange-700 border-orange-200"
                                            : "bg-slate-100 text-slate-600 border-slate-200"
                                    }`}
                                >
                                  {t.kategori?.replace("_", " ") || "Umum"}
                                </span>
                              </div>
                              <div className="font-bold text-slate-700">
                                {t.keterangan}
                              </div>
                              {t.detail_items && t.detail_items.length > 0 && (
                                <div className="flex flex-wrap gap-1 mt-2">
                                  {t.detail_items.map((i, idx) => (
                                    <span
                                      key={idx}
                                      className="inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-bold bg-white border border-slate-200 text-slate-500"
                                    >
                                      {i.nama_produk}{" "}
                                      <span className="opacity-50 ml-1">
                                        x{i.qty}
                                      </span>
                                    </span>
                                  ))}
                                </div>
                              )}
                            </td>
                            <td
                              className={`px-6 py-4 whitespace-nowrap text-sm text-right font-bold ${t.jenis === "pemasukan" ? "text-emerald-600" : "text-rose-600"}`}
                            >
                              {t.jenis === "pengeluaran" ? "- " : "+ "}
                              {formatRupiah(t.nominal)}
                            </td>
                            <td className="px-6 py-4 text-center">
                              <button
                                onClick={() => handleDelete(t._id)}
                                className="text-slate-300 hover:text-rose-500 p-2 rounded-full hover:bg-rose-50 transition-colors"
                              >
                                <TrashIcon className="w-4 h-4" />
                              </button>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td
                            colSpan="4"
                            className="px-6 py-16 text-center text-slate-400 text-sm italic"
                          >
                            Tidak ada transaksi.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
