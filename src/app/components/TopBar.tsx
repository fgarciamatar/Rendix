// TopBar.tsx
"use client";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { HiMenu } from "react-icons/hi";
import { useLoginStore } from "../stores/userLoginStore";
import icon from "./../favicon.ico";
import MenuTopBar from "./MenuTopBar";
import Userperfil from "./UserPerfil/Userperfil";

export function TopBar({ onMenuClick }: { onMenuClick: () => void }) {
  const userData = useLoginStore((state) => state.userData);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-gradient-to-b from-[#172a54] to-[#1f3f8f]">
      <div className="w-full flex h-20 items-center justify-between px-6">
        {/* Hamburguesa solo en mobile */}
        <button className="text-white md:hidden mr-4" onClick={onMenuClick}>
          <HiMenu size={28} />
        </button>
        {/* Logo + Título */}
        <Link href="/dashboard" className="flex items-center gap-3">
          <Image src={icon} alt="Logo" width={45} height={45} />
          <h1 className="text-base sm:text-xl md:text-2xl lg:text-3xl font-bold text-white tracking-wide">
            Rendix
          </h1>
        </Link>
        <h1 className="text-base sm:text-xl md:text-2xl lg:text-3xl font-bold text-white tracking-wide">
          {userData.company}
        </h1>

        {/* Perfil */}
        <div className="relative flex items-center">
          <button
            className="transition-all duration-200 ease-in-out cursor-pointer p-2 rounded-full hover:bg-[#455f82fa]"
            onClick={toggleMenu}
          >
            <Userperfil size="pequeño" />
          </button>
          {isMenuOpen && (
            <MenuTopBar
              name={userData.name}
              company={userData.company}
              onCloseMenu={() => setIsMenuOpen(false)}
            />
          )}
        </div>
      </div>
    </header>
  );
}
