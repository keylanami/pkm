"use client";

import { useEffect, useState } from "react";
import { getHPP, createHPP } from "@/services/hpp/hppService";
import { PlusIcon, TrashIcon } from "@heroicons/react/24/outline"; // Pastikan install @heroicons/react

const formatRupiah = (number) => {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(number);
};

export default function HPPPage() {
  const [loading, setLoading] = useState(false);
  
  // State Utama
  const [periode, setPeriode] = useState("");
  const [isReadOnly, setIsReadOnly] = useState(false); 

  const [form, setForm] = useState({
    jumlah_produksi: "",
    jenis_produksi: "Pcs",
    rencana_harga_jual_per_pcs: "",
    
    list_bahan_baku: [{ nama: "", harga: "" }],
    list_tenaga_kerja: [{ keterangan: "", biaya: "" }],
    list_overhead: [{ keterangan: "", biaya: "" }],
  });


  useEffect(() => {
    if (!periode) {
      setIsReadOnly(false);
      return;
    }

    async function loadHPP() {
      setLoading(true);
      try {
        const data = await getHPP(periode);
        if (data) {
          setForm({
            jumlah_produksi: data.jumlah_produksi,
            jenis_produksi: data.jenis_produksi,
            rencana_harga_jual_per_pcs: data.rencana_harga_jual_per_pcs,
            list_bahan_baku: data.list_bahan_baku,
            list_tenaga_kerja: data.list_tenaga_kerja,
            list_overhead: data.list_overhead,
          });
          setIsReadOnly(true); 
        } else {
          setForm((prev) => ({
            ...prev,
            jumlah_produksi: "",
            rencana_harga_jual_per_pcs: "",
            list_bahan_baku: [{ nama: "", harga: "" }],
            list_tenaga_kerja: [{ keterangan: "", biaya: "" }],
            list_overhead: [{ keterangan: "", biaya: "" }],
          }));
          setIsReadOnly(false);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    loadHPP();
  }, [periode]);

  
  const handleSimpleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleArrayChange = (index, listName, field, value) => {
    const newList = [...form[listName]];
    newList[index][field] = value;
    setForm({ ...form, [listName]: newList });
  };

  const addItem = (listName, template) => {
    setForm({ ...form, [listName]: [...form[listName], template] });
  };

  const removeItem = (index, listName) => {
    const newList = [...form[listName]];
    newList.splice(index, 1);
    setForm({ ...form, [listName]: newList });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!periode) return alert("Pilih periode terlebih dahulu");

    setLoading(true);
    try {
      const payload = {
        periode,
        jumlah_produksi: Number(form.jumlah_produksi),
        jenis_produksi: form.jenis_produksi,
        rencana_harga_jual_per_pcs: Number(form.rencana_harga_jual_per_pcs),
        list_bahan_baku: form.list_bahan_baku.map(i => ({...i, harga: Number(i.harga)})),
        list_tenaga_kerja: form.list_tenaga_kerja.map(i => ({...i, biaya: Number(i.biaya)})),
        list_overhead: form.list_overhead.map(i => ({...i, biaya: Number(i.biaya)})),
      };

      await createHPP(payload);
      alert("Data HPP Berhasil Disimpan!");
      setIsReadOnly(true);
    } catch (err) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  const total_biaya_bahan = form.list_bahan_baku.reduce((acc, curr) => acc + Number(curr.harga || 0), 0);
  const total_biaya_tenaga = form.list_tenaga_kerja.reduce((acc, curr) => acc + Number(curr.biaya || 0), 0);
  const total_biaya_overhead = form.list_overhead.reduce((acc, curr) => acc + Number(curr.biaya || 0), 0);

  const total_hpp = total_biaya_bahan + total_biaya_tenaga + total_biaya_overhead;
  const jumlah_prod = Number(form.jumlah_produksi) || 1;
  const hpp_per_pcs = total_hpp / jumlah_prod;
  
  const harga_jual = Number(form.rencana_harga_jual_per_pcs) || 0;
  const estimasi_laba = harga_jual - hpp_per_pcs;

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Hitung Harga Pokok Penjualan</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* --- LEFT COLUMN (INPUT FORM) --- */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* 1. DATA PRODUKSI */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
              <h2 className="text-lg font-semibold text-gray-800 mb-4">Data Produksi</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Periode</label>
                  <input
                    type="month"
                    value={periode}
                    onChange={(e) => setPeriode(e.target.value)}
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border"
                  />
                </div>
                <div className="flex gap-2">
                  <div className="flex-1">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Jumlah Produksi</label>
                    <input
                      type="number"
                      name="jumlah_produksi"
                      value={form.jumlah_produksi}
                      onChange={handleSimpleChange}
                      disabled={isReadOnly}
                      className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border"
                      placeholder="0"
                    />
                  </div>
                  <div className="w-24">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Satuan</label>
                    <select
                      name="jenis_produksi"
                      value={form.jenis_produksi}
                      onChange={handleSimpleChange}
                      disabled={isReadOnly}
                      className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border"
                    >
                      <option value="pcs">Pcs</option>
                      <option value="unit">Unit</option>
                      <option value="porsi">Porsi</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>

            {/* 2. KOMPONEN BIAYA */}
            <form id="hppForm" onSubmit={handleSubmit} className="space-y-6">
              
              {/* A. BAHAN BAKU */}
              <CostSection 
                title="Biaya Bahan Baku"
                desc="Semua bahan mentah yang akan digunakan."
                icon="📦"
                items={form.list_bahan_baku}
                total={total_biaya_bahan}
                isReadOnly={isReadOnly}
                onAdd={() => addItem("list_bahan_baku", { nama: "", harga: "" })}
                onRemove={(idx) => removeItem(idx, "list_bahan_baku")}
                onChange={(idx, field, val) => handleArrayChange(idx, "list_bahan_baku", field, val)}
                fields={[{ key: "nama", label: "Nama Bahan", type: "text" }, { key: "harga", label: "Harga", type: "number" }]}
              />

              {/* B. TENAGA KERJA */}
              <CostSection 
                title="Biaya Tenaga Kerja"
                desc="Gaji pokok, upah harian, atau bonus produksi."
                icon="👷"
                items={form.list_tenaga_kerja}
                total={total_biaya_tenaga}
                isReadOnly={isReadOnly}
                onAdd={() => addItem("list_tenaga_kerja", { keterangan: "", biaya: "" })}
                onRemove={(idx) => removeItem(idx, "list_tenaga_kerja")}
                onChange={(idx, field, val) => handleArrayChange(idx, "list_tenaga_kerja", field, val)}
                fields={[{ key: "keterangan", label: "Keterangan", type: "text" }, { key: "biaya", label: "Biaya", type: "number" }]}
              />

              {/* C. OVERHEAD */}
              <CostSection 
                title="Biaya Overhead"
                desc="Listrik, gas, kemasan, transportasi, dll."
                icon="⚡"
                items={form.list_overhead}
                total={total_biaya_overhead}
                isReadOnly={isReadOnly}
                onAdd={() => addItem("list_overhead", { keterangan: "", biaya: "" })}
                onRemove={(idx) => removeItem(idx, "list_overhead")}
                onChange={(idx, field, val) => handleArrayChange(idx, "list_overhead", field, val)}
                fields={[{ key: "keterangan", label: "Keterangan", type: "text" }, { key: "biaya", label: "Biaya", type: "number" }]}
              />

            </form>
          </div>

          {/* --- RIGHT COLUMN (SUMMARY CARD) --- */}
          <div className="lg:col-span-1 space-y-6">
            
            {/* HASIL HPP */}
            <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100 sticky top-6">
              <h3 className="text-gray-500 font-medium text-sm mb-1">Total HPP</h3>
              <div className="text-3xl font-bold text-gray-900 mb-6 bg-green-50 p-4 rounded-lg border border-green-100">
                {formatRupiah(total_hpp)}
              </div>

              <div className="space-y-4">
                <div>
                  <h3 className="text-gray-500 font-medium text-xs uppercase tracking-wide">HPP per {form.jenis_produksi}</h3>
                  <div className="text-xl font-bold text-gray-800 border-b pb-2">
                    {formatRupiah(hpp_per_pcs)}
                  </div>
                </div>

                <div className="pt-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Rencana Harga Jual</label>
                  <div className="relative rounded-md shadow-sm">
                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                      <span className="text-gray-500 sm:text-sm">Rp</span>
                    </div>
                    <input
                      type="number"
                      name="rencana_harga_jual_per_pcs"
                      value={form.rencana_harga_jual_per_pcs}
                      onChange={handleSimpleChange}
                      disabled={isReadOnly}
                      className="block w-full rounded-md border-gray-300 pl-10 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border"
                      placeholder="0"
                    />
                  </div>
                </div>

                <div className="flex justify-between items-center pt-2">
                  <span className="text-sm text-gray-600">Estimasi Laba / {form.jenis_produksi}:</span>
                  <span className={`font-bold ${estimasi_laba >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {formatRupiah(estimasi_laba)}
                  </span>
                </div>

                {!isReadOnly && (
                  <button
                    onClick={handleSubmit}
                    disabled={loading}
                    className="w-full mt-6 bg-indigo-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 shadow-lg shadow-indigo-200 transition-all"
                  >
                    {loading ? "Menyimpan..." : "Simpan Data HPP"}
                  </button>
                )}
                
                {isReadOnly && (
                   <div className="mt-4 p-3 bg-blue-50 text-blue-700 text-sm rounded-md text-center">
                      Data periode ini sudah tersimpan.
                   </div>
                )}
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}

// --- SUB COMPONENT UNTUK LIST BIAYA (Agar kode lebih rapi) ---
function CostSection({ title, desc, icon, items, total, onAdd, onRemove, onChange, fields, isReadOnly }) {
  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
      <div className="flex items-start gap-3 mb-4">
        <div className="text-2xl bg-gray-100 p-2 rounded-lg">{icon}</div>
        <div>
          <h2 className="text-lg font-bold text-gray-800">{title}</h2>
          <p className="text-sm text-gray-500">{desc}</p>
        </div>
      </div>

      <div className="space-y-3 mb-4">
        {items.map((item, index) => (
          <div key={index} className="flex gap-2 items-end group">
            <div className="flex-1">
              <label className="block text-xs font-medium text-gray-500 mb-1">{fields[0].label}</label>
              <input
                type={fields[0].type}
                value={item[fields[0].key]}
                onChange={(e) => onChange(index, fields[0].key, e.target.value)}
                disabled={isReadOnly}
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border"
              />
            </div>
            <div className="w-1/3">
              <label className="block text-xs font-medium text-gray-500 mb-1">{fields[1].label}</label>
              <input
                type={fields[1].type}
                value={item[fields[1].key]}
                onChange={(e) => onChange(index, fields[1].key, e.target.value)}
                disabled={isReadOnly}
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border text-right"
                placeholder="0"
              />
            </div>
            {!isReadOnly && items.length > 1 && (
              <button
                type="button"
                onClick={() => onRemove(index)}
                className="p-2 text-gray-400 hover:text-red-500 transition-colors"
              >
                <TrashIcon className="h-5 w-5" />
              </button>
            )}
          </div>
        ))}
      </div>

      <div className="flex justify-between items-center border-t pt-4">
        {!isReadOnly ? (
             <button
             type="button"
             onClick={onAdd}
             className="flex items-center gap-1 text-sm font-medium text-indigo-600 hover:text-indigo-800"
           >
             <PlusIcon className="h-4 w-4" /> Tambah Item
           </button>
        ) : <div></div>}
       
        <div className="flex items-center gap-2 bg-gray-50 px-3 py-1 rounded-md">
          <span className="text-sm text-gray-600 font-medium">Total:</span>
          <span className="font-bold text-gray-900">{formatRupiah(total)}</span>
        </div>
      </div>
    </div>
  );
}