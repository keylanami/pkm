"use client";

import { useEffect, useState } from "react";
import Sidebar from "@/app/components/Sidebar/page";
import {
  getHPP,
  createHPP,
  updateHPP,
  deleteHPP,
} from "@/services/hpp/hppService";
import {
  PlusIcon,
  TrashIcon,
  CalculatorIcon,
  ArrowLeftIcon,
  PencilIcon,
} from "@heroicons/react/24/outline";

const formatRupiah = (number) => {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(number);
};

const formatPeriode = (str) => {
  if (!str) return "-";
  const [year, month] = str.split("-");
  const date = new Date(year, month - 1);
  return date.toLocaleDateString("id-ID", { month: "long", year: "numeric" });
};

export default function HPPPage() {
  const [loading, setLoading] = useState(false);

  const [periodeFilter, setPeriodeFilter] = useState("");

  const [viewMode, setViewMode] = useState("view_list");
  const [existingHPPs, setExistingHPPs] = useState([]);
  const [isReadOnly, setIsReadOnly] = useState(false);

  const [editId, setEditId] = useState(null);

  const initialForm = {
    periode: "",
    nama_produk: "",
    jumlah_produksi: "",
    jenis_produksi: "Pcs",
    rencana_harga_jual_per_pcs: "",
    list_bahan_baku: [{ nama: "", harga: "" }],
    list_tenaga_kerja: [{ keterangan: "", biaya: "" }],
    list_overhead: [{ keterangan: "", biaya: "" }],
  };

  const [form, setForm] = useState(initialForm);

  useEffect(() => {
    loadHPPList();
  }, [periodeFilter]);

  async function loadHPPList() {
    setLoading(true);
    try {
      const data = await getHPP(periodeFilter);
      setExistingHPPs(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
      setExistingHPPs([]);
    } finally {
      setLoading(false);
    }
  }

  const handleCreateNew = () => {
    const currentMonth = new Date().toISOString().slice(0, 7);
    setForm({ ...initialForm, periode: periodeFilter || currentMonth });
    setEditId(null);
    setIsReadOnly(false);
    setViewMode("create_new");
  };

  const handleEdit = (item) => {
    setForm(item);
    setEditId(item._id);
    setIsReadOnly(false);
    setViewMode("create_new");
  };

  const handleDeleteHPP = async (id, e) => {
    e.stopPropagation();
    if (!confirm("Yakin ingin menghapus data HPP ini?")) return;
    try {
      await deleteHPP(id);
      alert("Data berhasil dihapus");
      loadHPPList();
    } catch (err) {
      alert(err.message);
    }
  };

  const handleViewDetail = (item) => {
    setForm(item);
    setEditId(null);
    setIsReadOnly(true);
    setViewMode("view_detail");
  };
  const handleBackToList = () => {
    setViewMode("view_list");
    setIsReadOnly(false);
    setEditId(null);
    loadHPPList();
  };
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
    if (!form.periode) return alert("Pilih periode terlebih dahulu");
    if (!form.nama_produk) return alert("Nama produk wajib diisi");
    setLoading(true);
    try {
      const payload = {
        periode: form.periode,
        nama_produk: form.nama_produk,
        jumlah_produksi: Number(form.jumlah_produksi),
        jenis_produksi: form.jenis_produksi,
        rencana_harga_jual_per_pcs: Number(form.rencana_harga_jual_per_pcs),
        list_bahan_baku: form.list_bahan_baku.map((i) => ({
          ...i,
          harga: Number(i.harga),
        })),
        list_tenaga_kerja: form.list_tenaga_kerja.map((i) => ({
          ...i,
          biaya: Number(i.biaya),
        })),
        list_overhead: form.list_overhead.map((i) => ({
          ...i,
          biaya: Number(i.biaya),
        })),
      };
      if (editId) {
        await updateHPP(editId, payload);
        alert("Data HPP Berhasil Diperbarui!");
      } else {
        await createHPP(payload);
        alert("Data HPP Berhasil Disimpan!");
      }
      handleBackToList();
    } catch (err) {
      alert(err.message);
      setLoading(false);
    }
  };

  const total_biaya_bahan = form.list_bahan_baku.reduce(
    (acc, curr) => acc + Number(curr.harga || 0),
    0,
  );
  const total_biaya_tenaga = form.list_tenaga_kerja.reduce(
    (acc, curr) => acc + Number(curr.biaya || 0),
    0,
  );
  const total_biaya_overhead = form.list_overhead.reduce(
    (acc, curr) => acc + Number(curr.biaya || 0),
    0,
  );
  const total_hpp =
    total_biaya_bahan + total_biaya_tenaga + total_biaya_overhead;
  const jumlah_prod = Number(form.jumlah_produksi) || 1;
  const hpp_per_pcs = total_hpp / jumlah_prod;
  const harga_jual = Number(form.rencana_harga_jual_per_pcs) || 0;
  const estimasi_laba = harga_jual - hpp_per_pcs;

  return (
    <div className="min-h-screen bg-[#F3F6FA] font-sans flex">

      <main
        className={`flex-1 transition-all duration-300 ease-in-out p-6 md:p-8`}
      >
        <div className="max-w-7xl mx-auto space-y-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-[#1C4D8D]">
                Manajemen HPP
              </h1>
              <p className="text-slate-500 mt-1">
                Hitung Harga Pokok Penjualan produk Anda.
              </p>
            </div>

            <div className="bg-white/60 backdrop-blur-md border border-white/50 p-1.5 rounded-xl shadow-sm flex items-center gap-2">
              <span className="text-xs font-bold text-slate-500 pl-3 uppercase tracking-wider">
                Filter Periode
              </span>
              <input
                type="month"
                value={periodeFilter}
                onChange={(e) => setPeriodeFilter(e.target.value)}
                className="text-sm bg-transparent border-none focus:ring-0 text-slate-700 font-bold cursor-pointer"
              />
              {!periodeFilter && (
                <span className="text-xs text-slate-400 italic pr-2">
                  (5 Terakhir)
                </span>
              )}
            </div>
          </div>

          {viewMode === "view_list" && (
            <div className="animate-fade-in">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-lg font-bold text-slate-800">
                  {periodeFilter
                    ? `Data Periode ${formatPeriode(periodeFilter)}`
                    : "Riwayat Terbaru"}
                </h2>
                <button
                  onClick={handleCreateNew}
                  className="text-xs font-bold bg-[#1C4D8D] text-white px-4 py-2 rounded-lg hover:bg-[#163E72] transition-all shadow-md flex items-center gap-2"
                >
                  <PlusIcon className="w-4 h-4" /> Tambah HPP
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {existingHPPs.length > 0 ? (
                  existingHPPs.map((hpp) => (
                    <div
                      key={hpp._id}
                      onClick={() => handleViewDetail(hpp)}
                      className="bg-white/80 backdrop-blur-sm p-5 rounded-2xl shadow-sm border border-white/60 hover:shadow-md hover:border-blue-200 transition-all cursor-pointer group relative overflow-hidden"
                    >
                      <div className="absolute top-0 right-0 bg-blue-50 text-blue-600 text-[10px] font-bold px-3 py-1 rounded-bl-xl">
                        {formatPeriode(hpp.periode)}
                      </div>

                      <div className="mt-2 mb-4">
                        <span className="inline-block px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 text-slate-600 mb-2 uppercase tracking-wide">
                          {hpp.jenis_produksi}
                        </span>
                        <h3 className="font-bold text-slate-800 text-lg group-hover:text-[#1C4D8D] transition-colors line-clamp-1">
                          {hpp.nama_produk || "Tanpa Nama"}
                        </h3>
                      </div>

                      <div className="space-y-2 text-sm text-slate-600 border-t border-slate-100 pt-3">
                        <div className="flex justify-between">
                          <span>Modal (HPP)</span>
                          <span className="font-bold">
                            {formatRupiah(hpp.hpp_per_pcs)}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span>Harga Jual</span>
                          <span className="font-bold text-indigo-600">
                            {formatRupiah(hpp.rencana_harga_jual_per_pcs)}
                          </span>
                        </div>
                        <div className="flex justify-between bg-emerald-50 px-2 py-1 rounded-lg mt-2">
                          <span className="text-emerald-700 text-xs font-bold uppercase">
                            Laba
                          </span>
                          <span className="font-bold text-emerald-700">
                            {formatRupiah(hpp.estimasi_laba_per_pcs)}
                          </span>
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex justify-end gap-2 mt-4 pt-3 border-t border-dashed border-slate-200 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleEdit(hpp);
                          }}
                          className="p-2 bg-white border border-slate-200 rounded-full text-slate-400 hover:text-indigo-600 hover:border-indigo-200 shadow-sm"
                        >
                          <PencilIcon className="w-4 h-4" />
                        </button>
                        <button
                          onClick={(e) => handleDeleteHPP(hpp._id, e)}
                          className="p-2 bg-white border border-slate-200 rounded-full text-slate-400 hover:text-red-600 hover:border-red-200 shadow-sm"
                        >
                          <TrashIcon className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="col-span-full py-16 text-center text-slate-400 border-2 border-dashed border-slate-200 rounded-3xl bg-white/30">
                    <CalculatorIcon className="w-12 h-12 mx-auto mb-2 opacity-20" />
                    <p>Belum ada data HPP.</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {(viewMode === "create_new" || viewMode === "view_detail") && (
            <div className="animate-fade-in space-y-6">
              <div className="flex justify-between items-center">
                <button
                  onClick={handleBackToList}
                  className="text-sm font-bold text-slate-500 hover:text-[#1C4D8D] flex items-center gap-2"
                >
                  <ArrowLeftIcon className="w-4 h-4" /> Kembali
                </button>
                {viewMode === "create_new" && editId && (
                  <span className="bg-amber-100 text-amber-700 text-xs px-3 py-1 rounded-full font-bold border border-amber-200">
                    MODE EDIT
                  </span>
                )}
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-6">
                  <div className="bg-white/80 backdrop-blur-xl border border-white/60 p-6 rounded-3xl shadow-sm">
                    <h2 className="text-lg font-bold text-slate-800 mb-6 border-b border-slate-100 pb-4">
                      {viewMode === "view_detail"
                        ? "Detail Produk"
                        : "Informasi Produk"}
                    </h2>
                    <div className="space-y-5">
                      <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase mb-1">
                          Nama Produk
                        </label>
                        <input
                          type="text"
                          name="nama_produk"
                          value={form.nama_produk}
                          onChange={handleSimpleChange}
                          disabled={isReadOnly}
                          className="w-full rounded-xl border-slate-200 bg-slate-50 focus:bg-white focus:ring-[#1C4D8D] transition-all"
                          placeholder="Contoh: Risol Mayo"
                        />
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        <div>
                          <label className="block text-xs font-bold text-slate-500 uppercase mb-1">
                            Periode
                          </label>
                          <input
                            type="month"
                            name="periode"
                            value={form.periode}
                            onChange={handleSimpleChange}
                            disabled={isReadOnly}
                            className="w-full rounded-xl border-slate-200 bg-slate-50 focus:bg-white"
                          />
                        </div>
                        <div className="flex gap-3">
                          <div className="flex-1">
                            <label className="block text-xs font-bold text-slate-500 uppercase mb-1">
                              Jumlah
                            </label>
                            <input
                              type="number"
                              name="jumlah_produksi"
                              value={form.jumlah_produksi}
                              onChange={handleSimpleChange}
                              disabled={isReadOnly}
                              className="w-full rounded-xl border-slate-200 bg-slate-50 focus:bg-white"
                              placeholder="0"
                            />
                          </div>
                          <div className="w-28">
                            <label className="block text-xs font-bold text-slate-500 uppercase mb-1">
                              Satuan
                            </label>
                            <select
                              name="jenis_produksi"
                              value={form.jenis_produksi}
                              onChange={handleSimpleChange}
                              disabled={isReadOnly}
                              className="w-full rounded-xl border-slate-200 bg-slate-50 focus:bg-white"
                            >
                              <option value="Pcs">Pcs</option>
                              <option value="Unit">Unit</option>
                              <option value="Porsi">Porsi</option>
                            </select>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <form onSubmit={handleSubmit} className="space-y-6">
                    <CostSection
                      title="Bahan Baku"
                      icon="📦"
                      items={form.list_bahan_baku}
                      total={total_biaya_bahan}
                      isReadOnly={isReadOnly}
                      onAdd={() =>
                        addItem("list_bahan_baku", { nama: "", harga: "" })
                      }
                      onRemove={(idx) => removeItem(idx, "list_bahan_baku")}
                      onChange={(idx, field, val) =>
                        handleArrayChange(idx, "list_bahan_baku", field, val)
                      }
                      fields={[
                        { key: "nama", label: "Item", type: "text" },
                        { key: "harga", label: "Biaya", type: "number" },
                      ]}
                    />
                    <CostSection
                      title="Tenaga Kerja"
                      icon="👷"
                      items={form.list_tenaga_kerja}
                      total={total_biaya_tenaga}
                      isReadOnly={isReadOnly}
                      onAdd={() =>
                        addItem("list_tenaga_kerja", {
                          keterangan: "",
                          biaya: "",
                        })
                      }
                      onRemove={(idx) => removeItem(idx, "list_tenaga_kerja")}
                      onChange={(idx, field, val) =>
                        handleArrayChange(idx, "list_tenaga_kerja", field, val)
                      }
                      fields={[
                        {
                          key: "keterangan",
                          label: "Keterangan",
                          type: "text",
                        },
                        { key: "biaya", label: "Biaya", type: "number" },
                      ]}
                    />
                    <CostSection
                      title="Overhead"
                      icon="⚡"
                      items={form.list_overhead}
                      total={total_biaya_overhead}
                      isReadOnly={isReadOnly}
                      onAdd={() =>
                        addItem("list_overhead", { keterangan: "", biaya: "" })
                      }
                      onRemove={(idx) => removeItem(idx, "list_overhead")}
                      onChange={(idx, field, val) =>
                        handleArrayChange(idx, "list_overhead", field, val)
                      }
                      fields={[
                        {
                          key: "keterangan",
                          label: "Keterangan",
                          type: "text",
                        },
                        { key: "biaya", label: "Biaya", type: "number" },
                      ]}
                    />
                  </form>
                </div>

                <div className="lg:col-span-1 space-y-6">
                  <div className="bg-white/80 backdrop-blur-xl border border-white/60 p-6 rounded-3xl shadow-lg sticky top-6">
                    <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">
                      Total Modal (HPP)
                    </h3>
                    <div className="text-3xl font-black text-slate-800 mb-6">
                      {formatRupiah(total_hpp)}
                    </div>

                    <div className="space-y-4">
                      <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
                        <p className="text-xs text-slate-500 font-bold uppercase mb-1">
                          HPP per {form.jenis_produksi}
                        </p>
                        <p className="text-xl font-bold text-slate-700">
                          {formatRupiah(hpp_per_pcs)}
                        </p>
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase mb-2">
                          Rencana Harga Jual
                        </label>
                        <div className="relative">
                          <span className="absolute left-3 top-3 text-slate-400 text-sm font-bold">
                            Rp
                          </span>
                          <input
                            type="number"
                            name="rencana_harga_jual_per_pcs"
                            value={form.rencana_harga_jual_per_pcs}
                            onChange={handleSimpleChange}
                            disabled={isReadOnly}
                            className="w-full pl-10 rounded-xl border-indigo-200 bg-indigo-50/50 text-indigo-700 font-bold focus:ring-indigo-500"
                            placeholder="0"
                          />
                        </div>
                      </div>

                      <div className="flex justify-between items-center py-3 border-t border-slate-100">
                        <span className="text-sm font-medium text-slate-600">
                          Estimasi Laba:
                        </span>
                        <span
                          className={`font-bold ${estimasi_laba >= 0 ? "text-emerald-600" : "text-red-500"}`}
                        >
                          {formatRupiah(estimasi_laba)}
                        </span>
                      </div>

                      {!isReadOnly && (
                        <button
                          onClick={handleSubmit}
                          disabled={loading}
                          className="w-full py-3.5 bg-[#1C4D8D] text-white rounded-xl font-bold hover:bg-[#163E72] transition-all shadow-lg shadow-blue-200"
                        >
                          {loading
                            ? "Menyimpan..."
                            : editId
                              ? "Update Data"
                              : "Simpan & Buat Produk"}
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

function CostSection({
  title,
  desc,
  icon,
  items,
  total,
  onAdd,
  onRemove,
  onChange,
  fields,
  isReadOnly,
}) {
  return (
    <div className="bg-white/80 backdrop-blur-xl border border-white/60 p-6 rounded-3xl shadow-sm">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <span className="text-2xl bg-slate-100 p-2 rounded-lg">{icon}</span>
          <div>
            <h3 className="font-bold text-slate-800">{title}</h3>
            <p className="text-xs text-slate-500">{desc}</p>
          </div>
        </div>
        <span className="font-bold text-slate-700 bg-slate-100 px-3 py-1 rounded-lg">
          {formatRupiah(total)}
        </span>
      </div>

      <div className="space-y-3">
        {items.map((item, index) => (
          <div key={index} className="flex gap-3 items-end">
            <div className="flex-1">
              <input
                type={fields[0].type}
                value={item[fields[0].key]}
                onChange={(e) => onChange(index, fields[0].key, e.target.value)}
                disabled={isReadOnly}
                className="w-full rounded-lg border-slate-200 bg-slate-50 text-sm focus:bg-white"
                placeholder={fields[0].label}
              />
            </div>
            <div className="w-1/3">
              <input
                type={fields[1].type}
                value={item[fields[1].key]}
                onChange={(e) => onChange(index, fields[1].key, e.target.value)}
                disabled={isReadOnly}
                className="w-full rounded-lg border-slate-200 bg-slate-50 text-sm text-right focus:bg-white"
                placeholder="0"
              />
            </div>
            {!isReadOnly && items.length > 1 && (
              <button
                type="button"
                onClick={() => onRemove(index)}
                className="p-2 text-slate-400 hover:text-red-500 bg-slate-100 hover:bg-red-50 rounded-lg transition-colors"
              >
                <TrashIcon className="w-4 h-4" />
              </button>
            )}
          </div>
        ))}
      </div>
      {!isReadOnly && (
        <button
          type="button"
          onClick={onAdd}
          className="mt-4 flex items-center gap-2 text-xs font-bold text-[#1C4D8D] hover:text-[#163E72] hover:bg-blue-50 px-3 py-2 rounded-lg transition-all"
        >
          <PlusIcon className="w-4 h-4" /> Tambah Item
        </button>
      )}
    </div>
  );
}
