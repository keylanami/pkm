"use client";

import { useState } from "react";
import { register } from "@/services/auth/service";
import { useRouter } from "next/navigation";
import Link from "next/link";
import AuthLayout from "@/app/components/AuthLayout/page";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/outline";

export default function RegisterPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    email: "",
    phone_number: "",
    password: "",
    confirmPassword: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.password !== form.confirmPassword) {
      alert("Password konfirmasi tidak sama!");
      return;
    }

    setLoading(true);
    try {
      await register({
        email: form.email,
        phone_number: form.phone_number,
        password: form.password,
        username: form.email.split("@")[0],
      });
      router.push("/");
    } catch (err) {
      alert(err.response?.data?.error || "Register gagal");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout 
        title="DAFTAR AKUN" 
        subtitle="Mulai kelola bisnis Anda dengan lebih profesional hari ini."
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
            <label className="block text-xs font-bold text-slate-600 mb-1.5 uppercase tracking-wide">Email</label>
            <input
                type="email"
                required
                className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:bg-white focus:border-[#1C4D8D] focus:ring-2 focus:ring-blue-100 outline-none text-slate-800 text-sm font-medium"
                placeholder="nama@bisnis.com"
                onChange={(e) => setForm({ ...form, email: e.target.value })}
            />
        </div>

        <div>
            <label className="block text-xs font-bold text-slate-600 mb-1.5 uppercase tracking-wide">Nomor HP / WhatsApp</label>
            <input
                type="tel"
                required
                className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:bg-white focus:border-[#1C4D8D] focus:ring-2 focus:ring-blue-100 outline-none text-slate-800 text-sm font-medium"
                placeholder="0812xxxx"
                onChange={(e) => setForm({ ...form, phone_number: e.target.value })}
            />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
                <label className="block text-xs font-bold text-slate-600 mb-1.5 uppercase tracking-wide">Kata Sandi</label>
                <div className="relative">
                    <input
                        type={showPassword ? "text" : "password"}
                        required
                        className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:bg-white focus:border-[#1C4D8D] focus:ring-2 focus:ring-blue-100 outline-none text-slate-800 text-sm font-medium"
                        placeholder="••••••"
                        onChange={(e) => setForm({ ...form, password: e.target.value })}
                    />
                </div>
            </div>
            <div>
                <label className="block text-xs font-bold text-slate-600 mb-1.5 uppercase tracking-wide">Konfirmasi</label>
                <div className="relative">
                    <input
                        type={showPassword ? "text" : "password"}
                        required
                        className={`w-full px-4 py-3 rounded-xl bg-slate-50 border focus:bg-white focus:ring-2 outline-none text-slate-800 text-sm font-medium ${
                            form.confirmPassword && form.password !== form.confirmPassword 
                            ? "border-red-300 focus:border-red-500 focus:ring-red-100" 
                            : "border-slate-200 focus:border-[#1C4D8D] focus:ring-blue-100"
                        }`}
                        placeholder="••••••"
                        onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })}
                    />
                </div>
            </div>
        </div>
        
        <div className="flex items-center gap-2 mb-2">
            <input 
                type="checkbox" 
                id="showPass" 
                className="rounded text-[#1C4D8D] focus:ring-[#1C4D8D]"
                onChange={() => setShowPassword(!showPassword)}
            />
            <label htmlFor="showPass" className="text-xs text-slate-500 cursor-pointer select-none">Lihat Kata Sandi</label>
        </div>

        <button 
            type="submit" 
            disabled={loading}
            className="w-full py-3.5 bg-gradient-to-r from-[#1C4D8D] to-[#3164A6] text-white rounded-xl font-bold shadow-lg shadow-blue-200 hover:shadow-blue-300 transform active:scale-[0.98] transition-all duration-200 mt-2"
        >
            {loading ? "Mendaftar..." : "Daftar Akun"}
        </button>

        <p className="text-center text-sm text-slate-500 mt-6">
            Sudah punya akun? <Link href="/login" className="text-[#1C4D8D] font-bold hover:underline">Masuk disini</Link>
        </p>
      </form>
    </AuthLayout>
  );
}