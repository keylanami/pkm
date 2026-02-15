export default function AuthLayout({ children, title, subtitle }) {
  return (
    <div className="min-h-screen flex w-full font-sans">
      <div className="hidden lg:flex w-1/2 bg-gradient-to-b from-[#1C4D8D] to-[#3164A6] flex-col justify-center px-12 relative overflow-hidden text-white">
        <div className="relative z-10 max-w-md">
          <h1 className="text-5xl font-bold mb-4">Selamat Datang</h1>
          <p className="text-lg text-blue-100 leading-relaxed mb-8">
            Kelola keuangan bisnismu dengan mudah, cepat, dan tepat dengan fitur unggulan secara GRATIS.
          </p>
          
          <div className="mt-10 relative">
             <div className="bg-white/10 backdrop-blur-md p-4 rounded-xl border border-white/20 w-64 h-40 transform rotate-[-5deg] absolute top-0 left-0 shadow-xl">
                <div className="h-full w-full flex items-end justify-between px-2 pb-2">
                    <div className="w-3 h-12 bg-blue-300/80 rounded-t-sm"></div>
                    <div className="w-3 h-20 bg-blue-300/80 rounded-t-sm"></div>
                    <div className="w-3 h-16 bg-blue-300/80 rounded-t-sm"></div>
                    <div className="w-3 h-24 bg-blue-300/80 rounded-t-sm"></div>
                </div>
             </div>
             <div className="bg-white p-4 rounded-xl shadow-2xl w-56 h-32 absolute top-12 left-24 transform rotate-[5deg] flex items-center justify-center">
                 <div className="text-center">
                    <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-2 text-blue-600 text-xl font-bold">
                        $
                    </div>
                    <div className="h-2 w-20 bg-gray-200 rounded mx-auto"></div>
                 </div>
             </div>
          </div>
        </div>
        
        <div className="absolute -top-20 -left-20 w-64 h-64 bg-white/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-blue-400/20 rounded-full blur-3xl"></div>
      </div>

      <div className="w-full lg:w-1/2 bg-[#F8FAFC] flex flex-col justify-center items-center px-8 sm:px-12 lg:px-24">
        <div className="w-full max-w-md bg-white p-8 sm:p-10 rounded-3xl shadow-sm border border-slate-100">
            <div className="text-center mb-8">
                <h2 className="text-3xl font-bold text-slate-800 mb-2">{title}</h2>
                <p className="text-slate-500 text-sm">{subtitle}</p>
            </div>
            {children}
        </div>
      </div>
    </div>
  );
}