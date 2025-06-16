// Sidebar.tsx
"use client";
import clsx from "clsx";
import { LayoutDashboard, Repeat } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { HiUsers } from "react-icons/hi";
import { LiaWalletSolid } from "react-icons/lia";
import { MdOutlineAttachMoney } from "react-icons/md";
import { useLoginStore } from "../stores/userLoginStore";

const navItems = [
  { label: "Dashboard", icon: LayoutDashboard, path: "/dashboard" },
  { label: "Transferencias", icon: Repeat, path: "/dashboard/transferencias" },
  { label: "Preventistas", icon: HiUsers, path: "/dashboard/preventistas" },
  { label: "Mercado Pago", icon: LiaWalletSolid, path: "/dashboard/mercadoPago" },
  { label: "Caja", icon: MdOutlineAttachMoney, path: "/dashboard/caja" },
];

const roleAccess: Record<string, string[]> = {
  admin: ["*"],
  cashier: ["*"],
  salesman: ["/dashboard", "/dashboard/transferencias"],
};

interface SidebarProps {
  onNavigate?: () => void;
  isOverlay?: boolean;
}

export default function Sidebar({ onNavigate, isOverlay = false }: SidebarProps) {

  const router = useRouter();
  const pathname = usePathname();
  const role = useLoginStore((state) => state.role);
  if (!role) return null;

  const allowedPaths = roleAccess[role] || [];
  const isAllowed = (path: string) => allowedPaths.includes("*") || allowedPaths.includes(path);
  const filteredItems = navItems.filter((item) => isAllowed(item.path));

  const handleNavigation = (path: string) => {
    router.push(path);
    onNavigate?.(); // Cierra el sidebar si se pasa prop
  };

  return (
    <aside
  className={clsx(
    "w-64 bg-gradient-to-b from-[#1f3f8f] to-[#0f172a] text-white p-4 border-r border-gray-800",
    isOverlay
      ? "fixed inset-y-0 left-0 z-50 min-h-screen"
      : "h-full"
  )}
>

      <h2 className="text-xl font-bold mb-6 pl-2 tracking-wide">Navegación</h2>
      <nav className="flex flex-col gap-2">
        {filteredItems.map((item) => {
          const isActive = pathname === item.path;
          return (
            <button
              key={item.path}
              onClick={() => handleNavigation(item.path)}
              className={clsx(
                "flex items-center gap-4 px-5 py-3 rounded-lg text-lg font-semibold transition-all duration-200 cursor-pointer",
                isActive
                  ? "bg-[#11214c] text-white"
                  : "text-gray-400 hover:bg-[#455f82fa] hover:text-white"
              )}
            >
              <item.icon size={22} />
              {item.label}
            </button>
          );
        })}
      </nav>
    </aside>
  );
}
