"use client";

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import Sidebar from "../Sidebar/page";

export default function MainLayout({ children }) {
  const pathname = usePathname();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  useEffect(() => {
    const savedState = localStorage.getItem("sidebarOpen");
    
    if (window.innerWidth < 768) {
       setIsSidebarOpen(false);
    } else if (savedState !== null) {
      setIsSidebarOpen(savedState === "true");
    }
  }, []);

  const toggleSidebar = (state) => {
    setIsSidebarOpen(state);
    localStorage.setItem("sidebarOpen", state);
  };

  const noSidebarRoutes = [
    "/auth/login", 
    "/auth/register"
  ];

  const isAuthPage = noSidebarRoutes.some((route) => pathname.startsWith(route));
  const isLandingPage = pathname === "/";

  if (isAuthPage || isLandingPage) {
    return <>{children}</>;
  }

  return (
    <div className="min-h-screen bg-[#F3F6FA] font-sans flex">
      <Sidebar isOpen={isSidebarOpen} setIsOpen={toggleSidebar} />
      
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 z-30 bg-black/50 md:hidden backdrop-blur-sm transition-opacity"
          onClick={() => toggleSidebar(false)}
        />
      )}
      
      <main
        className={`flex-1 transition-all duration-300 ease-in-out p-6 md:p-8 
        ${isSidebarOpen ? "md:ml-72" : "md:ml-20"}`}
      >
        {children}
      </main>
    </div>
  );
}