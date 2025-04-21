"use client";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  Repeat,

} from "lucide-react";
import clsx from "clsx";
import { HiUsers } from "react-icons/hi";
import { LiaWalletSolid } from "react-icons/lia";
import { MdOutlineAttachMoney } from "react-icons/md";

const navItems = [
  { label: "Dashboard", icon: LayoutDashboard, path: "/dashboard" },
  { label: "Transferencias", icon: Repeat, path: "/dashboard/transferencias" },
  { label: "Preventistas", icon: HiUsers, path: "/dashboard/preventistas" },
  { label: "Mercado Pago", icon: LiaWalletSolid, path: "/dashboard/mercadoPago" },
  { label: "Caja", icon: MdOutlineAttachMoney, path: "/dashboard/caja" },
];

export default function Sidebar() {
  const router = useRouter();
  const pathname = usePathname();

  return (
    <aside className="h-screen w-64 bg-[#1d3163] text-white p-4 border-r border-gray-800 overflow-hidden">
      <h2 className="text-xl font-bold mb-6 pl-2 tracking-wide">Navegación</h2>
      <nav className="flex flex-col gap-2">
        {navItems.map((item) => {
          const isActive = pathname === item.path;
          return (
            <button
            key={item.path}
            onClick={() => router.push(item.path)}
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
