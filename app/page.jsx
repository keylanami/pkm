"use client";

import { useState } from "react"; 
import Link from "next/link";
import {
  ArrowRightIcon,
  ChartBarIcon,
  CpuChipIcon,
  CurrencyDollarIcon,
  Bars3Icon,
  XMarkIcon, 
} from "@heroicons/react/24/outline";

export default function LandingPage() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="min-h-screen font-sans text-[#EEEEEE] selection:bg-yellow-400 selection:text-slate-900 overflow-x-hidden">
      
      <div className="fixed inset-0 z-[-1] bg-gradient-to-b from-[#1C4D8D] via-[#265996] to-[#A5C0DD]"></div>

      <nav className={`fixed w-full z-50 top-0 left-0 transition-all duration-300 border-b border-white/10 ${isOpen ? 'bg-[#1C4D8D]' : 'bg-[#1C4D8D]/80 backdrop-blur-md'}`}>
        <div className="max-w-7xl mx-auto px-6 py-5">
          <div className="flex justify-between items-center">
            <div className="text-2xl font-black tracking-tight text-white flex items-center gap-2 cursor-pointer">
              Cuanly
            </div>

            <div className="hidden md:flex items-center gap-8 text-sm font-medium text-blue-100">
              {['Beranda', 'Fitur', 'Tentang'].map((item) => (
                <Link key={item} href={`#${item.toLowerCase()}`} className="hover:text-white hover:underline decoration-yellow-400 underline-offset-4 transition-all">
                  {item}
                </Link>
              ))}
            </div>

            <div className="flex items-center gap-4">
              <Link href="/auth/login" className="hidden md:block px-6 py-2.5 bg-[#FCD34D] text-[#1F2A44] rounded-full text-sm font-bold hover:bg-[#F59E0B] hover:shadow-[0_0_20px_rgba(252,211,77,0.4)] transition-all transform hover:-translate-y-0.5">
                Masuk
              </Link>
              
              <button 
                onClick={() => setIsOpen(!isOpen)} 
                className="md:hidden p-2 text-white hover:bg-white/10 rounded-lg transition-colors"
              >
                {isOpen ? (
                  <XMarkIcon className="w-6 h-6" />
                ) : (
                  <Bars3Icon className="w-6 h-6"/>
                )}
              </button>
            </div>
          </div>

          {isOpen && (
            <div className="md:hidden pt-6 pb-8 animate-fade-in-down">
              <div className="flex flex-col space-y-4">
                {['Beranda', 'Fitur', 'Tentang'].map((item) => (
                  <Link 
                    key={item} 
                    href={`#${item.toLowerCase()}`} 
                    onClick={() => setIsOpen(false)} 
                    className="text-lg font-medium text-blue-100 hover:text-white hover:pl-2 transition-all border-b border-white/5 pb-2"
                  >
                    {item}
                  </Link>
                ))}
                <Link 
                  href="/auth/login" 
                  onClick={() => setIsOpen(false)}
                  className="mt-4 w-full text-center px-6 py-3 bg-[#FCD34D] text-[#1F2A44] rounded-xl text-lg font-bold hover:bg-[#F59E0B] shadow-lg transition-all"
                >
                  Masuk Sekarang
                </Link>
              </div>
            </div>
          )}
        </div>
      </nav>

      <section id="beranda" className="relative pt-40 pb-20 px-6">
        <div className="max-w-5xl mx-auto text-center space-y-8">
          <h1 className="text-5xl md:text-7xl font-black tracking-tight leading-[1.15]">
            Kelola Keuangan Bisnis Mudah, <br />
            Cepat, dan Tepat dengan <span className="text-[#81A4FF]">Bantuan AI</span>
          </h1>
          
          <p className="text-lg md:text-xl text-blue-100/90 max-w-2xl mx-auto leading-relaxed font-medium">
            Laporan keuangan yang baik menciptakan peluang bisnis lebih besar 
            dan raih keuntungan yang akurat secara real-time.
          </p>

          <div className="mt-16 w-full aspect-[2/1] md:aspect-[2.5/1] rounded-[2rem] overflow-hidden shadow-2xl border border-white/20 relative group">
             <div className="absolute inset-0 bg-gradient-to-r from-[#FBCFE8] via-[#FEF3C7] to-[#10B981] opacity-90 transition-all duration-1000 group-hover:scale-105"></div>
           
             <div className="absolute inset-0 opacity-20 mix-blend-overlay" style={{backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`}}></div>
         
             <div className="absolute inset-0 bg-gradient-to-tr from-white/10 to-transparent pointer-events-none"></div>
          </div>
        </div>
      </section>

      <section id="fitur" className="py-24 px-6 md:px-16 max-w-[1440px] mx-auto">
        <div className="flex flex-col lg:flex-row items-start justify-center gap-16 lg:gap-24">
          
          <div className="lg:w-[548px] lg:sticky lg:top-32 space-y-6">
            <h2 className="text-[36px] md:text-[42px] font-bold leading-[120%] tracking-tight text-[#EEEEEE]">
              Sesuai dengan kebutuhan <br/> 
              <span className="text-blue-200">pengelolaan keuangan</span> <br/>
              bisnismu
            </h2>
            <p className="text-[16px] md:text-[18px] font-medium leading-[145%] text-[#EEEEEE]/90">
              Mulai kelola keuangan bisnis Anda dengan fitur unggulan dari kami yang dirancang spesifik untuk akselerasi pertumbuhan UMKM.
            </p>
            <div className="w-24 h-1.5 bg-gradient-to-r from-yellow-400 to-orange-400 rounded-full mt-4"></div>
          </div>

          <div className="flex flex-col gap-[15px] w-full lg:w-[540px]">
            <FeatureCard 
              title="Perencanaan Bisnis dari Nol"
              desc="Bantu pengguna merancang kebutuhan bisnis sejak awal, mulai dari penentuan jenis usaha, aset, hingga kebutuhan biaya produksi."
              icon={<ChartBarIcon className="w-6 h-6 text-[#1F2A44] z-10 relative"/>}
              shape="circle"
            />
            <FeatureCard 
              title="Perhitungan Keuangan Otomatis"
              desc="Bantu pengguna hitung kebutuhan biaya produksi, Harga Pokok Produksi (HPP), hingga menentukan harga jual secara mudah dan terstruktur."
              icon={<CpuChipIcon className="w-6 h-6 text-[#1F2A44] z-10 relative"/>}
              shape="diamond"
            />
            <FeatureCard 
              title="Balik Modal Lebih Terukur"
              desc="Membantu pengguna mencapai target balik modal melalui analisis perencanaan keuangan yang matang dan berbasis data."
              icon={<CurrencyDollarIcon className="w-6 h-6 text-[#1F2A44] z-10 relative"/>}
              shape="rectangle"
            />
          </div>
        </div>
      </section>

      <footer className="relative pt-32 pb-16 px-6 overflow-hidden">
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="flex flex-col items-center text-center space-y-12 mb-20">
            <h2 className="text-3xl md:text-5xl font-bold leading-tight max-w-3xl">
              Mulai kelola perencanaan keuangan <br/> bisnis Anda sekarang!
            </h2>
            
            <div className="w-full max-w-4xl grid grid-cols-1 md:grid-cols-3 gap-8 text-center md:text-left">
               <div className="space-y-2 p-6 rounded-2xl hover:bg-white/5 transition-colors">
                  <h4 className="font-bold text-xl">Gratis Selamanya</h4>
                  <p className="text-sm opacity-80">Untuk fitur dasar tanpa kartu kredit.</p>
               </div>
               <div className="space-y-2 p-6 rounded-2xl hover:bg-white/5 transition-colors">
                  <h4 className="font-bold text-xl">Enkripsi Bank</h4>
                  <p className="text-sm opacity-80">Keamanan data prioritas utama kami.</p>
               </div>
               <div className="space-y-2 p-6 rounded-2xl hover:bg-white/5 transition-colors">
                  <h4 className="font-bold text-xl">Support 24/7</h4>
                  <p className="text-sm opacity-80">Tim kami siap membantu kapanpun.</p>
               </div>
            </div>

            <button className="px-10 py-4 bg-[#1F2A44] text-white rounded-full text-lg font-bold shadow-2xl hover:shadow-[#1F2A44]/50 hover:scale-105 transition-all ring-4 ring-[#1F2A44]/20">
              Bergabung Sekarang
            </button>
          </div>

          <div className="border-t border-white/20 pt-8 flex flex-col md:flex-row justify-between items-center text-sm font-medium text-blue-100/60">
            <div className="flex items-center gap-2 mb-4 md:mb-0 text-white">
               <div className="w-6 h-6 bg-white/20 rounded-full animate-pulse"></div>
               <span className="font-bold">Cuanly</span>
            </div>
            <div className="flex gap-8">
                <a href="#" className="hover:text-white transition-colors">Features</a>
                <a href="#" className="hover:text-white transition-colors">Learn more</a>
                <a href="#" className="hover:text-white transition-colors">Support</a>
            </div>
            <div className="hidden md:flex gap-4">
               {[1,2,3].map(i => <div key={i} className="w-5 h-5 bg-white/20 rounded hover:bg-white cursor-pointer transition-colors"></div>)}
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

function FeatureCard({ title, desc, icon, shape }) {
  const shapeStyles = {
    circle: "rounded-full",
    diamond: "rotate-45 rounded-sm",
    rectangle: "rounded-sm h-full"
  };

  return (
    <div className="group box-border flex flex-col items-start p-6 gap-4 w-full bg-[#F6F8FC] border-2 border-[#D8E5FF] shadow-[2px_4px_4px_rgba(0,0,0,0.05)] rounded-[16px] hover:border-[#6C63FF]/50 transition-all hover:-translate-y-1 hover:shadow-xl">
      <div className="flex flex-row items-center gap-3 w-full">
        <div className="relative w-6 h-6 flex items-center justify-center">
           <div className={`absolute w-[18px] h-[18px] bg-[rgba(108,99,255,0.5)] ${shapeStyles[shape]}`}></div>
           {icon}
        </div>
        <h3 className="font-semibold text-[20px] md:text-[24px] leading-none tracking-tight text-[#1F2A44] group-hover:text-[#6C63FF] transition-colors">
          {title}
        </h3>
      </div>
      <p className="font-medium text-[16px] md:text-[18px] leading-[145%] tracking-[-0.005em] text-[#6B7280]">
        {desc}
      </p>
    </div>
  );
}