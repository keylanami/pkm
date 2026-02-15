"use client";

import { useState } from "react";
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
  Bars3Icon
} from "@heroicons/react/24/outline";

export default function Sidebar({ isOpen, setIsOpen }) {
  const pathname = usePathname();

  const menuItems = [
    { name: "Dashboard", href: "/", icon: <HomeIcon className="w-5 h-5" /> },
    { name: "HPP", href: "/pages/hpp", icon: <CalculatorIcon className="w-5 h-5" /> },
    { name: "Transaksi", href: "/pages/transaksi", icon: <BanknotesIcon className="w-5 h-5" /> },
    // { name: "Penjualan", href: "/penjualan", icon: <ChartBarIcon className="w-5 h-5" /> },
    // { name: "Laporan", href: "/laporan", icon: <DocumentTextIcon className="w-5 h-5" /> },
  ];

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
        ${isOpen ? "w-64 translate-x-0" : "w-20 -translate-x-full md:translate-x-0 md:w-20"}
        `}
      >
        <div className="h-20 flex items-center justify-between px-6 border-b border-white/10">
          <h1 className={`font-bold text-xl tracking-wider transition-all duration-300 ${!isOpen && "md:hidden"}`}>
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

        <nav className="flex-1 py-6 px-3 space-y-2 overflow-y-auto">
          <p className={`px-3 text-xs font-semibold text-white/40 uppercase mb-2 transition-all ${!isOpen && "md:hidden"}`}>
            Menu Utama
          </p>
          
          {menuItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center gap-3 px-3 py-3 rounded-xl transition-all duration-200 group
                  ${isActive 
                    ? "bg-white/20 shadow-lg border border-white/20 backdrop-blur-sm" 
                    : "hover:bg-white/10 hover:translate-x-1"}
                `}
                title={!isOpen ? item.name : ""}
              >
                <div className={`${isActive ? "text-white" : "text-white/70 group-hover:text-white"}`}>
                  {item.icon}
                </div>
                <span className={`font-medium whitespace-nowrap transition-all duration-300 ${!isOpen && "md:hidden"}`}>
                  {item.name}
                </span>
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-white/10 space-y-2">
          <Link
            href="/pengaturan"
            className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-white/70 hover:bg-white/10 hover:text-white transition-all"
          >
            <Cog6ToothIcon className="w-5 h-5" />
            <span className={`font-medium transition-all ${!isOpen && "md:hidden"}`}>Pengaturan</span>
          </Link>
          
          <button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-red-200 hover:bg-red-500/20 hover:text-red-100 transition-all">
            <ArrowLeftOnRectangleIcon className="w-5 h-5" />
            <span className={`font-medium transition-all ${!isOpen && "md:hidden"}`}>Keluar</span>
          </button>
        </div>
      </aside>
    </>
  );
}