// DashboardLayout.tsx
"use client";
import { useState } from "react";
import Sidebar from "../components/Sidebar";
import { TopBar } from "../components/TopBar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleSidebarClose = () => setSidebarOpen(false);
  const handleSidebarToggle = () => setSidebarOpen(!sidebarOpen);

  return (
    <div className="flex min-h-screen flex-col">
      <TopBar onMenuClick={handleSidebarToggle} />
      <div className="flex flex-1">
        {/* Sidebar en mobile */}
        {sidebarOpen && (
          <div className="fixed inset-0 z-40 flex md:hidden">
            <div
              className="absolute inset-0 bg-black bg-opacity-40"
              onClick={handleSidebarClose}
            />
            <Sidebar isOverlay={true} onNavigate={handleSidebarClose} />
          </div>
        )}

        {/* Sidebar en desktop */}
        <aside className="hidden md:block w-64 border-r">
          <Sidebar />
        </aside>
        <main className="flex-1 p-4 md:p-6">{children}</main>
      </div>

      <footer className="w-full border-t py-6  border-[#243B85] bg-[#243B85]/95 backdrop-blur supports-[backdrop-filter]:bg-[#2A4080]/60">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between">
          <p className="text-center md:text-left text-base text-gray-400 tracking-wide mb-4 md:mb-0">
            &copy; {new Date().getFullYear()} Rendix. Todos los derechos
            reservados.
          </p>
          <div className="w-full md:w-auto flex justify-center md:justify-end"></div>
        </div>
      </footer>
    </div>
  );
}
