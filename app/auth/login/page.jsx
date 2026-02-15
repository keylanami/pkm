"use client";

import { useState } from "react";
import { login } from "@/services/auth/service";
import { useRouter } from "next/navigation";
import Link from "next/link";
import AuthLayout from "@/app/components/AuthLayout/page";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/outline";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await login({ email, password });
      router.push("/");
    } catch (err) {
      alert("Login gagal: Periksa email atau password Anda.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout 
        title="MASUK" 
        subtitle="Masuk ke akun Anda untuk melihat ringkasan dan detail keuangan bisnis."
    >
      <form onSubmit={handleLogin} className="space-y-5">
        <div>
            <label className="block text-xs font-bold text-slate-600 mb-1.5 uppercase tracking-wide">Email / No. HP</label>
            <input
                type="text"
                required
                className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:bg-white focus:border-[#1C4D8D] focus:ring-2 focus:ring-blue-100 outline-none transition-all text-slate-800 text-sm font-medium"
                placeholder="Contoh: user@email.com"
                onChange={(e) => setEmail(e.target.value)}
            />
        </div>

        <div>
            <div className="flex justify-between items-center mb-1.5">
                <label className="block text-xs font-bold text-slate-600 uppercase tracking-wide">Kata Sandi</label>
            </div>
            <div className="relative">
                <input
                    type={showPassword ? "text" : "password"}
                    required
                    className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:bg-white focus:border-[#1C4D8D] focus:ring-2 focus:ring-blue-100 outline-none transition-all text-slate-800 text-sm font-medium pr-10"
                    placeholder="Masukkan kata sandi"
                    onChange={(e) => setPassword(e.target.value)}
                />
                <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-3 text-slate-400 hover:text-slate-600"
                >
                    {showPassword ? <EyeSlashIcon className="w-5 h-5"/> : <EyeIcon className="w-5 h-5"/>}
                </button>
            </div>
            <div className="text-right mt-2">
                <a href="#" className="text-xs font-bold text-[#3164A6] hover:text-[#1C4D8D] transition-colors">Lupa Password?</a>
            </div>
        </div>

        <button 
            type="submit" 
            disabled={loading}
            className="w-full py-3.5 bg-gradient-to-r from-[#1C4D8D] to-[#3164A6] text-white rounded-xl font-bold shadow-lg shadow-blue-200 hover:shadow-blue-300 transform active:scale-[0.98] transition-all duration-200 mt-4"
        >
            {loading ? "Memproses..." : "Masuk"}
        </button>

        <p className="text-center text-sm text-slate-500 mt-6">
            Belum punya akun? <Link href="/register" className="text-[#1C4D8D] font-bold hover:underline">Daftar Sekarang</Link>
        </p>
      </form>
    </AuthLayout>
  );
}