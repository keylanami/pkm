"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  HomeIcon,
  CalculatorIcon,
  BanknotesIcon,
  ChartBarIcon,
  DocumentTextIcon,
  Cog6ToothIcon,
  ArrowLeftOnRectangleIcon,
  ChevronDoubleLeftIcon,
  ChevronDoubleRightIcon,
  Bars3Icon,
} from "@heroicons/react/24/outline";
import { logout } from "@/services/auth/service";
import { useRouter } from "next/navigation";

export default function Sidebar({ isOpen, setIsOpen }) {
  const pathname = usePathname();
  const router = useRouter();
  const [user, setUser] = useState({ username: "Loading...", email: "..." });

  useEffect(() => {
    async function fetchUser() {
      try {
        const res = await fetch("/api/auth/me", { credentials: "include"});
        if (res.ok) {
          const userData = await res.json();
          setUser(userData); 
        } else {
          console.error("Gagal mengambil data user");
          setUser({ username: "Guest", email: "Silakan Login" });
        }
      } catch (err) {
        console.error("Error fetching user:", err);
      }
    }
    fetchUser();
  }, []);

  const getInitial = (name) => {
    return name ? name.charAt(0).toUpperCase() : "?";
  };

  const menuItems = [
    { name: "Dashboard", href: "/pages/dashboard", icon: <HomeIcon className="w-5 h-5" /> },
    { name: "HPP", href: "/pages/hpp", icon: <CalculatorIcon className="w-5 h-5" /> },
    { name: "Transaksi", href: "/pages/transaksi", icon: <BanknotesIcon className="w-5 h-5" /> },
  ];

  const handleLogout = async () => {
  try {
    const res = await logout();

    if (res.status === 200) {
      router.push("/");
    } else {
      console.error("Gagal logout");
    }
  } catch (err) {
    console.error("Error saat logout:", err);
  }
}

  return (
    <>
      <div className="md:hidden fixed top-4 left-4 z-50">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="p-2 bg-white/20 backdrop-blur-md rounded-lg text-white shadow-lg border border-white/30"
        >
          <Bars3Icon className="w-6 h-6" />
        </button>
      </div>

      <aside
        className={`fixed top-0 left-0 h-screen bg-gradient-to-b from-[#1C4D8D] to-[#3164A6] text-white transition-all duration-300 ease-in-out z-40 shadow-2xl flex flex-col
        ${isOpen ? "w-72 translate-x-0" : "w-20 -translate-x-full md:translate-x-0 md:w-20 overflow-hidden"} 
        `} 
      >
        <div className="h-20 flex items-center justify-between px-6 flex-shrink-0">
          <h1 className={`font-bold text-xl tracking-wider transition-all duration-300 whitespace-nowrap ${!isOpen && "opacity-0 md:hidden"}`}>
            UMKM APP
          </h1>
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="hidden md:block p-1.5 rounded-md hover:bg-white/10 transition-colors"
          >
            {isOpen ? (
              <ChevronDoubleLeftIcon className="w-5 h-5 text-white/70" />
            ) : (
              <ChevronDoubleRightIcon className="w-5 h-5 text-white/70" />
            )}
          </button>
        </div>

        <div className={`px-4 mb-6 transition-all duration-300 flex-shrink-0 ${isOpen ? "opacity-100" : "opacity-0 md:opacity-100"}`}>
          <div className={`flex items-center gap-3 p-3 rounded-2xl bg-white/10 border border-white/10 backdrop-blur-sm shadow-inner ${!isOpen ? "justify-center px-0 bg-transparent border-0 shadow-none" : ""}`}>
            <div className="flex-shrink-0 w-10 h-10 bg-white text-[#1C4D8D] rounded-xl font-bold text-lg flex items-center justify-center shadow-lg border border-blue-100">
              {getInitial(user.username)}
            </div>
            {isOpen && (
              <div className="flex-1 min-w-0 overflow-hidden">
                <p className="text-sm font-bold text-white truncate capitalize">
                  {user.username}
                </p>
                <p className="text-[10px] text-blue-100 truncate opacity-80 font-medium">
                  {user.email}
                </p>
              </div>
            )}
          </div>
        </div>

        <nav className={`flex-1 py-2 px-3 space-y-2 ${isOpen ? "overflow-y-auto custom-scrollbar" : "overflow-hidden"}`}>
          <p className={`px-3 text-[10px] font-bold text-blue-200/60 uppercase mb-2 transition-all whitespace-nowrap ${!isOpen && "opacity-0 md:hidden"}`}>
            Menu Utama
          </p>
          
          {menuItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center gap-3 px-3 py-3 rounded-xl transition-all duration-200 group relative
                  ${isActive 
                    ? "bg-white/20 shadow-lg border border-white/20 backdrop-blur-sm font-bold" 
                    : "hover:bg-white/10 font-medium text-white/80 hover:text-white"}
                `}
                title={!isOpen ? item.name : ""}
              >
                <div className={`${isActive ? "text-white" : "text-white/70 group-hover:text-white"} flex-shrink-0`}>
                  {item.icon}
                </div>
                <span className={`whitespace-nowrap transition-all duration-300 ${!isOpen && "opacity-0 w-0 overflow-hidden md:hidden"}`}>
                  {item.name}
                </span>
                
                {!isOpen && (
                  <div className="absolute left-16 bg-slate-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none md:block hidden whitespace-nowrap z-50 shadow-xl border border-white/10">
                    {item.name}
                  </div>
                )}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-white/10 space-y-2 flex-shrink-0">
          <Link
            href="/pages/pengaturan"
            className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-white/70 hover:bg-white/10 hover:text-white transition-all group"
            title={!isOpen ? "Pengaturan" : ""}
          >
            <Cog6ToothIcon className="w-5 h-5 group-hover:rotate-90 transition-transform duration-500 flex-shrink-0" />
            <span className={`font-medium transition-all whitespace-nowrap ${!isOpen && "opacity-0 w-0 overflow-hidden md:hidden"}`}>Pengaturan</span>
          </Link>
          
          <button 
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-red-200 hover:bg-red-500/20 hover:text-red-100 transition-all border border-transparent hover:border-red-500/30" 
            title={!isOpen ? "Keluar" : ""}
            onClick={handleLogout}
          >
            <ArrowLeftOnRectangleIcon className="w-5 h-5 flex-shrink-0" />
            <span className={`font-medium transition-all whitespace-nowrap ${!isOpen && "opacity-0 w-0 overflow-hidden md:hidden"}`}>Keluar</span>
          </button>
        </div>
      </aside>
    </>
  );
}
