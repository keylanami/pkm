"use client";

import { useState, useEffect } from "react";
import Sidebar from "../Sidebar/page";

export default function MainLayout({ children }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  useEffect(() => {
    const savedState = localStorage.getItem("sidebarOpen");
    if (savedState !== null) {
      setIsSidebarOpen(savedState === "true");
    }
  }, []);

  const toggleSidebar = (state) => {
    setIsSidebarOpen(state);
    localStorage.setItem("sidebarOpen", state);
  };

  return (
    <div className="min-h-screen bg-[#F3F6FA] font-sans flex">
      <Sidebar isOpen={isSidebarOpen} setIsOpen={toggleSidebar} />

      <main
        className={`flex-1 transition-all duration-300 ease-in-out p-6 md:p-8 
        ${isSidebarOpen ? "md:ml-64" : "md:ml-20"}`}
      >
        {children}
      </main>
    </div>
  );
}
