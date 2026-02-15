"use client";

import { useEffect, useState } from "react";
import Sidebar from "@/app/components/Sidebar/page";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";
import {
  PlusIcon,
  TrashIcon,
  BellIcon,
  CalendarIcon,
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
  BanknotesIcon,
  ClockIcon,
  CheckCircleIcon,
  XCircleIcon,
} from "@heroicons/react/24/outline";
import {
  createReminder,
  deleteReminder,
  updateReminder,
} from "@/services/reminder/route";

const formatRupiah = (number) => {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(number);
};

const EXPENSE_COLORS = ["#ef4444", "#f59e0b", "#3b82f6", "#10b981", "#6366f1"];

export default function DashboardPage() {
  const [loading, setLoading] = useState(true);
  const [periode, setPeriode] = useState(new Date().toISOString().slice(0, 7));

  const [data, setData] = useState({
    summary: { totalPenjualan: 0, totalPengeluaran: 0, labaBersih: 0 },
    chartData: [],
    expenseChartData: [],
    topProducts: [],
    reminders: [],
  });

  const [showReminderForm, setShowReminderForm] = useState(false);
  const [newReminder, setNewReminder] = useState({
    judul: "",
    nominal: "",
    tanggal_jatuh_tempo: "",
    jam: "",
  });

  useEffect(() => {
    if (!periode) return;
    fetchDashboardData();
    if ("Notification" in window && Notification.permission !== "granted") {
      Notification.requestPermission();
    }
  }, [periode]);

  async function fetchDashboardData() {
    setLoading(true);
    try {
      const res = await fetch(`/api/dashboard?periode=${periode}`);
      if (res.ok) setData(await res.json());
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  const handleAddReminder = async (e) => {
    e.preventDefault();
    try {
      await createReminder({
        ...newReminder,
        nominal: Number(newReminder.nominal),
        tanggal_jatuh_tempo: Number(newReminder.tanggal_jatuh_tempo),
        is_active: true,
      });
      setShowReminderForm(false);
      setNewReminder({
        judul: "",
        nominal: "",
        tanggal_jatuh_tempo: "",
        jam: "",
      });
      fetchDashboardData();
    } catch (error) {
      alert(error.message);
    }
  };

  const handleToggleStatus = async (id, currentStatus) => {
    try {
      const updated = data.reminders.map((r) =>
        r._id === id ? { ...r, is_active: !currentStatus } : r,
      );
      setData({ ...data, reminders: updated });
      await updateReminder(id, { is_active: !currentStatus });
    } catch (error) {
      alert("Gagal update");
      fetchDashboardData();
    }
  };

  const handleDeleteReminder = async (id) => {
    if (!confirm("Hapus?")) return;
    try {
      await deleteReminder(id);
      fetchDashboardData();
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <div className="min-h-screen bg-[#F3F6FA] font-sans flex">
      <main
        className={`flex-1 transition-all duration-300 ease-in-out p-6 md:p-8 
        `}
      >
        <div className="max-w-7xl mx-auto space-y-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-[#1C4D8D]">Dashboard</h1>
              <p className="text-slate-500 mt-1 flex items-center gap-2 text-sm">
                <CalendarIcon className="w-4 h-4" /> Ringkasan Bisnis Periode{" "}
                {periode}
              </p>
            </div>

            <div className="bg-white/60 backdrop-blur-md border border-white/50 p-1.5 rounded-xl shadow-sm flex items-center gap-2">
              <span className="text-xs font-bold text-slate-500 pl-3 uppercase tracking-wider">
                Periode
              </span>
              <input
                type="month"
                value={periode}
                onChange={(e) => setPeriode(e.target.value)}
                className="text-sm bg-transparent border-none focus:ring-0 text-slate-700 font-bold cursor-pointer"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <GlassCard
              title="Saldo Kas / Laba"
              value={data.summary.labaBersih}
              icon={<BanknotesIcon className="w-6 h-6" />}
              trend="+3.1%"
              type="primary"
              loading={loading}
            />
            <GlassCard
              title="Total Pemasukan"
              value={data.summary.totalPenjualan}
              icon={<ArrowTrendingUpIcon className="w-6 h-6" />}
              trend="+9.0%"
              type="success"
              loading={loading}
            />
            <GlassCard
              title="Total Pengeluaran"
              value={data.summary.totalPengeluaran}
              icon={<ArrowTrendingDownIcon className="w-6 h-6" />}
              trend="-5.4%"
              type="danger"
              loading={loading}
            />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 bg-white/70 backdrop-blur-xl border border-white/60 p-6 rounded-3xl shadow-sm">
              <h3 className="text-lg font-bold text-slate-800 mb-6">
                Analitik Penjualan
              </h3>
              <div className="h-80 w-full">
                {!loading && data.chartData.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={data.chartData}>
                      <CartesianGrid
                        strokeDasharray="3 3"
                        vertical={false}
                        stroke="#e2e8f0"
                      />
                      <XAxis
                        dataKey="tanggal"
                        axisLine={false}
                        tickLine={false}
                        tick={{ fill: "#64748b", fontSize: 12 }}
                        dy={10}
                      />
                      <YAxis
                        axisLine={false}
                        tickLine={false}
                        tick={{ fill: "#64748b", fontSize: 12 }}
                        tickFormatter={(v) => `${v / 1000}k`}
                      />
                      <Tooltip
                        cursor={{ fill: "#f1f5f9" }}
                        content={<CustomTooltip />}
                      />
                      <Bar
                        dataKey="total"
                        fill="url(#colorGradient)"
                        radius={[6, 6, 0, 0]}
                        barSize={36}
                      />
                      <defs>
                        <linearGradient
                          id="colorGradient"
                          x1="0"
                          y1="0"
                          x2="0"
                          y2="1"
                        >
                          <stop
                            offset="0%"
                            stopColor="#1C4D8D"
                            stopOpacity={0.9}
                          />
                          <stop
                            offset="100%"
                            stopColor="#3164A6"
                            stopOpacity={0.6}
                          />
                        </linearGradient>
                      </defs>
                    </BarChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="h-full flex items-center justify-center text-slate-400 italic">
                    No Data
                  </div>
                )}
              </div>
            </div>

            <div className="bg-white/70 backdrop-blur-xl border border-white/60 p-6 rounded-3xl shadow-sm flex flex-col">
              <h3 className="text-lg font-bold text-slate-800 mb-2">
                Pos Pengeluaran
              </h3>
              <div className="flex-1 min-h-[250px] relative">
                {!loading && data.expenseChartData.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={data.expenseChartData}
                        innerRadius={60}
                        outerRadius={80}
                        paddingAngle={5}
                        dataKey="value"
                      >
                        {data.expenseChartData.map((entry, index) => (
                          <Cell
                            key={`cell-${index}`}
                            fill={EXPENSE_COLORS[index % EXPENSE_COLORS.length]}
                            stroke="none"
                          />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value) => formatRupiah(value)} />
                      <Legend
                        iconType="circle"
                        wrapperStyle={{ fontSize: "11px", fontWeight: 600 }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="h-full flex items-center justify-center text-slate-400 italic">
                    No Data
                  </div>
                )}
              </div>
            </div>

            <div className="bg-white/70 backdrop-blur-xl border border-white/60 p-6 rounded-3xl shadow-sm h-fit">
              <h3 className="text-lg font-bold text-slate-800 mb-4">
                Top Produk
              </h3>
              <div className="space-y-3">
                {data.topProducts.map((p, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between p-3 bg-white/50 rounded-xl border border-white/60 hover:bg-white transition-all"
                  >
                    <div className="flex items-center gap-3">
                      <span
                        className={`w-6 h-6 flex items-center justify-center rounded-full text-[10px] font-bold 
                        ${idx === 0 ? "bg-yellow-100 text-yellow-700" : "bg-slate-200 text-slate-600"}`}
                      >
                        {idx + 1}
                      </span>
                      <div>
                        <p className="text-sm font-bold text-slate-700">
                          {p.nama}
                        </p>
                        <p className="text-[10px] text-slate-500">
                          {p.qty} terjual
                        </p>
                      </div>
                    </div>
                    <p className="text-xs font-bold text-[#1C4D8D]">
                      {formatRupiah(p.omzet)}
                    </p>
                  </div>
                ))}
                {data.topProducts.length === 0 && (
                  <p className="text-center text-slate-400 text-sm py-4">
                    Belum ada penjualan
                  </p>
                )}
              </div>
            </div>

            <div className="lg:col-span-2 bg-white/70 backdrop-blur-xl border border-white/60 p-6 rounded-3xl shadow-sm">
              <div className="flex justify-between items-center mb-6">
                <div className="flex items-center gap-2">
                  <div className="p-2 bg-amber-100 rounded-lg text-amber-600">
                    <BellIcon className="w-5 h-5" />
                  </div>
                  <h3 className="text-lg font-bold text-slate-800">
                    Reminder Tagihan
                  </h3>
                </div>
                <button
                  onClick={() => setShowReminderForm(!showReminderForm)}
                  className="text-xs font-bold bg-[#1C4D8D] text-white px-4 py-2 rounded-lg hover:bg-[#163E72] transition-all shadow-md shadow-blue-200"
                >
                  + Tambah
                </button>
              </div>

              {showReminderForm && (
                <form
                  onSubmit={handleAddReminder}
                  className="mb-6 p-4 bg-slate-50/80 rounded-2xl border border-dashed border-slate-300 grid grid-cols-1 md:grid-cols-5 gap-3"
                >
                  <input
                    type="text"
                    placeholder="Judul"
                    required
                    value={newReminder.judul}
                    onChange={(e) =>
                      setNewReminder({ ...newReminder, judul: e.target.value })
                    }
                    className="text-sm rounded-lg border-slate-200 bg-white"
                  />
                  <input
                    type="number"
                    placeholder="Nominal"
                    required
                    value={newReminder.nominal}
                    onChange={(e) =>
                      setNewReminder({
                        ...newReminder,
                        nominal: e.target.value,
                      })
                    }
                    className="text-sm rounded-lg border-slate-200 bg-white"
                  />
                  <input
                    type="number"
                    placeholder="Tgl (1-31)"
                    min="1"
                    max="31"
                    required
                    value={newReminder.tanggal_jatuh_tempo}
                    onChange={(e) =>
                      setNewReminder({
                        ...newReminder,
                        tanggal_jatuh_tempo: e.target.value,
                      })
                    }
                    className="text-sm rounded-lg border-slate-200 bg-white"
                  />
                  <input
                    type="time"
                    required
                    value={newReminder.jam}
                    onChange={(e) =>
                      setNewReminder({ ...newReminder, jam: e.target.value })
                    }
                    className="text-sm rounded-lg border-slate-200 bg-white"
                  />
                  <button
                    type="submit"
                    className="bg-emerald-500 text-white rounded-lg text-xs font-bold hover:bg-emerald-600"
                  >
                    Simpan
                  </button>
                </form>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {data.reminders.map((rem) => {
                  const isNear =
                    rem.tanggal_jatuh_tempo <= new Date().getDate() + 3 &&
                    rem.tanggal_jatuh_tempo >= new Date().getDate();
                  const isActive = rem.is_active;
                  return (
                    <div
                      key={rem._id}
                      className={`flex items-center justify-between p-4 rounded-2xl border backdrop-blur-sm transition-all
                      ${
                        !isActive
                          ? "bg-slate-100/50 border-slate-200 opacity-50"
                          : isNear
                            ? "bg-amber-50/80 border-amber-200 shadow-sm"
                            : "bg-white/60 border-slate-100"
                      }`}
                    >
                      <div className="flex items-center gap-4">
                        <div
                          className={`flex flex-col items-center justify-center w-12 h-12 rounded-xl border ${isNear ? "bg-white text-amber-600 border-amber-100" : "bg-slate-50 text-slate-500 border-slate-200"}`}
                        >
                          <span className="text-[10px] font-bold uppercase">
                            Tgl
                          </span>
                          <span className="text-lg font-black leading-none">
                            {rem.tanggal_jatuh_tempo}
                          </span>
                        </div>
                        <div>
                          <p
                            className={`text-sm font-bold ${!isActive && "line-through"}`}
                          >
                            {rem.judul}
                          </p>
                          <p className="text-xs font-mono text-slate-500">
                            {formatRupiah(rem.nominal)}
                          </p>
                          <div className="flex items-center gap-1 mt-1 text-[10px] text-slate-400 font-semibold bg-slate-100 px-1.5 py-0.5 rounded-md w-fit">
                            <ClockIcon className="w-3 h-3" /> {rem.jam}
                          </div>
                        </div>
                      </div>

                      <div className="flex gap-2">
                        <button
                          onClick={() =>
                            handleToggleStatus(rem._id, rem.is_active)
                          }
                          className={`p-1.5 rounded-full ${isActive ? "bg-emerald-100 text-emerald-600" : "bg-slate-200 text-slate-500"}`}
                        >
                          {isActive ? (
                            <CheckCircleIcon className="w-5 h-5" />
                          ) : (
                            <XCircleIcon className="w-5 h-5" />
                          )}
                        </button>
                        <button
                          onClick={() => handleDeleteReminder(rem._id)}
                          className="p-1.5 rounded-full bg-red-50 text-red-400 hover:bg-red-100 hover:text-red-600"
                        >
                          <TrashIcon className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

function GlassCard({ title, value, icon, trend, type, loading }) {
  const styles = {
    primary: "from-[#E3F2FD] to-[#BBDEFB] border-[#90CAF9] text-[#1565C0]", 
    success: "from-[#E8F5E9] to-[#C8E6C9] border-[#A5D6A7] text-[#2E7D32]", 
    danger: "from-[#FFEBEE] to-[#FFCDD2] border-[#EF9A9A] text-[#C62828]", 
  };

  return (
    <div
      className={`p-6 rounded-3xl bg-gradient-to-br ${styles[type]} border shadow-sm relative overflow-hidden group`}
    >
      <div className="absolute -right-4 -top-4 opacity-10 scale-150 transform group-hover:scale-125 transition-transform duration-500">
        {icon}
      </div>
      <div className="relative z-10">
        <p className="text-xs font-bold uppercase tracking-wider opacity-70 mb-1">
          {title}
        </p>
        <h3 className="text-3xl font-black tracking-tight">
          {loading ? "..." : formatRupiah(value)}
        </h3>
        <div className="mt-2 inline-flex items-center px-2 py-0.5 rounded-md bg-white/40 border border-white/50 text-[10px] font-bold">
          {trend} dr bulan lalu
        </div>
      </div>
    </div>
  );
}

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white/90 backdrop-blur-md p-3 border border-white/50 shadow-xl rounded-xl text-xs">
        <p className="font-bold text-slate-500 mb-1 uppercase tracking-tighter">
          Tanggal {label}
        </p>
        <p className="text-[#1C4D8D] font-black text-sm">
          {formatRupiah(payload[0].value)}
        </p>
      </div>
    );
  }
  return null;
};
