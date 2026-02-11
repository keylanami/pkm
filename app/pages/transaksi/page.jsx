"use client";

import { useEffect, useState } from "react";
import {
  getTransaksi,
  createTransaksi,
  deleteTransaksi,
} from "@/services/transaksi/service";

// Helper Format Tanggal
const formatDate = (dateString) => {
  if (!dateString) return "-";
  return new Date(dateString).toLocaleDateString("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
};

// Helper Format Rupiah
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

  // State Form
  const [jenis, setJenis] = useState("pemasukan");
  const [nominal, setNominal] = useState("");
  const [keterangan, setKeterangan] = useState("");
  const [tanggal, setTanggal] = useState("");

  useEffect(() => {
    loadData();
  }, [filterPeriode]);

  async function loadData() {
    try {
      const res = await getTransaksi(filterPeriode);
      setData(Array.isArray(res) ? res : []);
    } catch (err) {
      console.error(err);
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const transactionPeriode = tanggal.substring(0, 7);

    try {
      await createTransaksi({
        jenis,
        periode: transactionPeriode,
        nominal: Number(nominal),
        keterangan,
        tanggal,
      });

      setNominal("");
      setKeterangan("");
      setTanggal("");
      alert("Transaksi berhasil disimpan!");

      if (filterPeriode === transactionPeriode || filterPeriode === "") {
        loadData();
      } else {
        if (confirm("Transaksi disimpan di periode berbeda. Buka periode tersebut?")) {
          setFilterPeriode(transactionPeriode);
        }
      }
    } catch (err) {
      alert(err.message);
    }
  }

  async function handleDelete(id) {
    if (!confirm("Yakin hapus transaksi ini?")) return;
    try {
      await deleteTransaksi(id);
      loadData();
    } catch (err) {
      alert("Gagal menghapus data");
    }
  }

  // --- LOGIC HITUNG TOTAL (SUMMARY) ---
  // Data yang dihitung otomatis mengikuti apa yang sedang tampil (Filter atau All Time)
  const totalPemasukan = data
    .filter((item) => item.jenis === "pemasukan")
    .reduce((acc, curr) => acc + Number(curr.nominal), 0);

  const totalPengeluaran = data
    .filter((item) => item.jenis === "pengeluaran")
    .reduce((acc, curr) => acc + Number(curr.nominal), 0);

  const saldoBersih = totalPemasukan - totalPengeluaran;

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-5xl mx-auto space-y-8">
        
        {/* HEADER & FILTER */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 tracking-tight">
              Dashboard Keuangan
            </h1>
            <p className="text-sm text-gray-500 mt-1">
              {filterPeriode 
                ? `Menampilkan data periode: ${filterPeriode}` 
                : "Menampilkan semua riwayat transaksi (All Time)"}
            </p>
          </div>
          
          <div className="flex items-center gap-3 bg-white p-2 rounded-lg shadow-sm border border-gray-200">
            <span className="text-sm font-medium text-gray-500 pl-2">Filter Periode:</span>
            <input
              type="month"
              value={filterPeriode}
              onChange={(e) => setFilterPeriode(e.target.value)}
              className="text-sm border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500 text-gray-700 shadow-sm"
            />
            {filterPeriode && (
              <button
                onClick={() => setFilterPeriode("")}
                className="text-xs text-red-600 hover:text-red-800 font-medium px-2 hover:bg-red-50 rounded py-1 transition-colors"
              >
                Reset
              </button>
            )}
          </div>
        </div>

        {/* --- SUMMARY CARDS (FITUR BARU) --- */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* Card Pemasukan */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-green-100 flex items-center justify-between relative overflow-hidden group">
                <div className="absolute right-0 top-0 h-full w-1 bg-green-500"></div>
                <div>
                    <p className="text-sm font-medium text-gray-500 mb-1">Total Pemasukan</p>
                    <h3 className="text-2xl font-bold text-green-600">
                        {formatRupiah(totalPemasukan)}
                    </h3>
                </div>
                <div className="p-3 bg-green-50 rounded-full text-green-600">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m0 0 6.75-6.75M12 19.5l-6.75-6.75" /> {/* Panah Bawah */}
                    </svg>
                </div>
            </div>

            {/* Card Pengeluaran */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-red-100 flex items-center justify-between relative overflow-hidden">
                <div className="absolute right-0 top-0 h-full w-1 bg-red-500"></div>
                <div>
                    <p className="text-sm font-medium text-gray-500 mb-1">Total Pengeluaran</p>
                    <h3 className="text-2xl font-bold text-red-600">
                        {formatRupiah(totalPengeluaran)}
                    </h3>
                </div>
                <div className="p-3 bg-red-50 rounded-full text-red-600">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 19.5v-15m0 0-6.75 6.75M12 4.5l6.75 6.75" /> {/* Panah Atas */}
                    </svg>
                </div>
            </div>

            {/* Card Saldo (Selisih) */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-indigo-100 flex items-center justify-between relative overflow-hidden">
                <div className="absolute right-0 top-0 h-full w-1 bg-indigo-500"></div>
                <div>
                    <p className="text-sm font-medium text-gray-500 mb-1">Sisa Saldo / Profit</p>
                    <h3 className={`text-2xl font-bold ${saldoBersih < 0 ? 'text-red-600' : 'text-indigo-600'}`}>
                        {formatRupiah(saldoBersih)}
                    </h3>
                </div>
                <div className="p-3 bg-indigo-50 rounded-full text-indigo-600">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15.91 11.672a.375.375 0 0 1 0 .656l-5.603 3.113a.375.375 0 0 1-.557-.328V8.887c0-.286.307-.466.557-.327l5.603 3.112Z" />
                    </svg>
                </div>
            </div>

        </div>

        {/* INPUT FORM CARD */}
        <div className="bg-white shadow-md rounded-xl p-6 border border-gray-100 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-20 h-20 bg-indigo-50 rounded-bl-full -mr-4 -mt-4 z-0"></div>
          <h2 className="text-lg font-semibold text-gray-800 mb-5 relative z-10">Catat Transaksi Baru</h2>
          
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-12 gap-5 items-end relative z-10">
            {/* ... (Kode Form Input Anda Sama Persis Seperti Sebelumnya) ... */}
            <div className="md:col-span-2">
              <label className="block text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wide">Jenis</label>
              <select
                value={jenis}
                onChange={(e) => setJenis(e.target.value)}
                className="block w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2.5 border bg-gray-50"
              >
                <option value="pemasukan">Pemasukan (+)</option>
                <option value="pengeluaran">Pengeluaran (-)</option>
              </select>
            </div>
            <div className="md:col-span-2">
              <label className="block text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wide">Tanggal</label>
              <input
                type="date"
                value={tanggal}
                onChange={(e) => setTanggal(e.target.value)}
                required
                className="block w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2.5 border"
              />
            </div>
            <div className="md:col-span-3">
              <label className="block text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wide">Nominal (Rp)</label>
              <div className="relative rounded-md shadow-sm">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                  <span className="text-gray-500 sm:text-sm">Rp</span>
                </div>
                <input
                  type="number"
                  placeholder="0"
                  value={nominal}
                  onChange={(e) => setNominal(e.target.value)}
                  required
                  className="block w-full rounded-lg border-gray-300 pl-10 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2.5 border"
                />
              </div>
            </div>
            <div className="md:col-span-3">
              <label className="block text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wide">Keterangan</label>
              <input
                type="text"
                placeholder="Contoh: Belanja Pasar"
                value={keterangan}
                onChange={(e) => setKeterangan(e.target.value)}
                required
                className="block w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2.5 border"
              />
            </div>
            <div className="md:col-span-2">
              <button
                type="submit"
                className="w-full bg-indigo-600 text-white py-2.5 px-4 rounded-lg font-medium hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 shadow-lg shadow-indigo-200 transition-all text-sm flex justify-center items-center gap-2"
              >
                <span>Simpan</span>
              </button>
            </div>
          </form>
        </div>

        {/* TABLE LIST */}
        <div className="bg-white shadow-md rounded-xl overflow-hidden border border-gray-100">
            {/* ... (Kode Tabel Anda Sama Persis) ... */}
             <div className="px-6 py-4 border-b border-gray-100 bg-gray-50/50 flex justify-between items-center">
                <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wider">
                    Riwayat Transaksi
                </h3>
                <div className="text-xs text-gray-500">
                    Menampilkan {data.length} data
                </div>
            </div>
            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                    <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tanggal</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Jenis</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Keterangan</th>
                    <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Nominal</th>
                    <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Aksi</th>
                    </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                    {data.length > 0 ? (
                    data.map((t) => (
                        <tr key={t._id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{formatDate(t.tanggal)}</td>
                        <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${
                                t.jenis === "pemasukan" ? "bg-green-100 text-green-700 border border-green-200" : "bg-red-100 text-red-700 border border-red-200"
                            }`}>
                            {t.jenis === "pemasukan" ? "Pemasukan ⬇" : "Pengeluaran ⬆"}
                            </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{t.keterangan}</td>
                        <td className={`px-6 py-4 whitespace-nowrap text-sm text-right font-mono font-bold ${
                            t.jenis === "pemasukan" ? "text-green-600" : "text-red-600"
                        }`}>
                            {t.jenis === "pengeluaran" ? "- " : "+ "}{formatRupiah(t.nominal)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-center text-sm font-medium">
                            <button onClick={() => handleDelete(t._id)} className="text-gray-400 hover:text-red-600 transition-colors">Hapus</button>
                        </td>
                        </tr>
                    ))
                    ) : (
                    <tr><td colSpan="5" className="px-6 py-12 text-center text-gray-400">Tidak ada data.</td></tr>
                    )}
                </tbody>
                </table>
            </div>
        </div>

      </div>
    </div>
  );
}